import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import faunadb from "faunadb";

const q = faunadb.query;
const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export async function GET() {
  try {
    const minis = await guestClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Mini"))),
        q.Lambda((x) => q.Get(x))
      )
    );

    if (!minis) {
      return Response.json(
        {
          error: {
            name: "no_minis",
            message: "No minis could be found",
          },
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: {
          name: "minis_found",
          message: "Minis located",
          minis,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: { name: "database_error", message: error.message },
      },
      { status: error.requestResult.statusCode }
    );
  }
}

function generateString(length) {
  const string = [...Array(length)]
    .map((i) => (~~(Math.random() * 36)).toString(36))
    .join("");
  return string;
}

export const POST = withApiAuthRequired(async (request) => {
  const req = await request.json();
  let { destination, slug } = req;

  if (!destination) {
    return Response.json(
      {
        error: {
          name: "missing_params",
          message: "All parameters must be provided",
        },
      },
      { status: 400 }
    );
  }

  if (!slug) {
    slug = generateString(5);
  } else {
    if (slug.length < 2 || slug.length > 7) {
      return Response.json(
        {
          error: {
            name: "invalid_length",
            message: "A mini must be between 2 and 7 characters",
          },
        },
        { status: 400 }
      );
    }
  }

  try {
    const miniRequest = await guestClient.query(
      q.Create(q.Collection("Mini"), {
        data: {
          destination,
          mini: slug,
          createdAt: q.Now(),
          updatedAt: q.Now(),
        },
      })
    );

    if (!miniRequest.ref) {
      return Response.json(
        {
          error: { name: "no_mini_ref", message: "Mini ref not returned" },
        },
        { status: 404 }
      );
    }

    console.log(miniRequest);

    return Response.json(
      {
        success: {
          name: "mini_created",
          message: "Mini successfully created",
          miniRequest,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "database_error", message: error.message },
      { status: error.requestResult.statusCode }
    );
  }
});
