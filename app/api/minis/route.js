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
