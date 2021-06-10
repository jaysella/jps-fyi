var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export default async (req, res) => {
  const {
    query: { mini },
  } = req;

  if (!mini || mini.length < 2 || mini.length > 7) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "A valid mini must be requested",
      },
    });
  }

  try {
    const miniResult = await guestClient.query(
      q.Get(q.Match(q.Index("mini_by_mini"), mini))
    );

    if (!miniResult) {
      return res.status(400).json({
        error: {
          name: "no_mini",
          message: "The requested mini does not exist",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "mini_found",
          message: "Mini located",
          mini: miniResult,
        },
      })
    );
  } catch (error) {
    if (error.message === "instance not found") {
      return res.status(400).json({
        error: {
          name: "no_mini",
          message: "The requested mini does not exist",
        },
      });
    }

    console.error(error);
    res.status(error.requestResult.statusCode).json({
      error: { name: "database_error", message: error.message },
    });
  }
};
