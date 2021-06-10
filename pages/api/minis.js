var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export default async (req, res) => {
  try {
    const minis = await guestClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Mini"))),
        q.Lambda((x) => q.Get(x))
      )
    );

    if (!minis) {
      return res.status(400).json({
        error: {
          name: "no_minis",
          message: "No minis could be found",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "minis_found",
          message: "Minis located",
          minis,
        },
      })
    );
  } catch (error) {
    console.error(error);
    res.status(error.requestResult.statusCode).json({
      error: { name: "database_error", message: error.message },
    });
  }
};
