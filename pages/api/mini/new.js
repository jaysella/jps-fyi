var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export default async (req, res) => {
  const { destination, mini } = req.body;

  if (!destination || !mini) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All parameters must be provided",
      },
    });
  }

  try {
    const miniRequest = await guestClient.query(
      q.Create(q.Collection("Mini"), {
        data: {
          destination,
          mini,
          createdAt: q.Now(),
          updatedAt: q.Now(),
        },
      })
    );

    if (!miniRequest.ref) {
      return res.status(404).json({
        error: { name: "no_mini_ref", message: "Mini ref not returned" },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "mini_created",
          message: "Mini successfully created",
          miniRequest,
        },
      })
    );
  } catch (error) {
    console.error(error);
    res
      .status(error.requestResult.statusCode)
      .json({ error: "database_error", message: error.message });
  }
};
