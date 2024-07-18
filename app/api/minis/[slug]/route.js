import faunadb from "faunadb";

const q = faunadb.query;
const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export async function GET(request, { params }) {
  if (!params.slug || params.slug.length < 2 || params.slug.length > 7) {
    return Response.json(
      {
        error: {
          name: "missing_params",
          message: "A valid mini must be requested",
        },
      },
      { status: 400 }
    );
  }

  try {
    const miniResult = await guestClient.query(
      q.Get(q.Match(q.Index("mini_by_mini"), params.slug))
    );

    if (!miniResult) {
      return Response.json(
        {
          error: {
            name: "no_mini",
            message: "The requested mini does not exist",
          },
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: {
          name: "mini_found",
          message: "Mini located",
          mini: miniResult,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.message === "instance not found") {
      return Response.json(
        {
          error: {
            name: "no_mini",
            message: "The requested mini does not exist",
          },
        },
        { status: 400 }
      );
    }

    console.error(error);
    return Response.json(
      {
        error: { name: "database_error", message: error.message },
      },
      { status: error.requestResult.statusCode }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!params.slug) {
    return Response.json(
      {
        error: {
          name: "missing_params",
          message: "A valid mini must be requested",
        },
      },
      { status: 400 }
    );
  }

  try {
    const miniResult = await guestClient.query(
      q.Delete(q.Ref(q.Collection("Mini"), params.slug))
    );

    if (!miniResult) {
      return Response.json(
        {
          error: {
            name: "no_mini",
            message: "The requested mini does not exist",
          },
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: {
          name: "mini_deleted",
          message: "Mini deleted",
          mini: miniResult,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.message === "instance not found") {
      return Response.json(
        {
          error: {
            name: "no_mini",
            message: "The requested mini does not exist",
          },
        },
        { status: 400 }
      );
    }

    console.error(error);
    return Response.json(
      {
        error: { name: "database_error", message: error.message },
      },
      { status: error.requestResult.statusCode }
    );
  }
}
