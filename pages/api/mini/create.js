import { withApiAuthRequired } from "@auth0/nextjs-auth0";

var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

function generateString(length) {
  const string = [...Array(length)]
    .map((i) => (~~(Math.random() * 36)).toString(36))
    .join("");
  return string;
}

export default withApiAuthRequired(async (req, res) => {
  let { destination, mini } = req.body;

  if (!destination) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All parameters must be provided",
      },
    });
  }

  if (!mini) {
    mini = generateString(5);
  } else {
    if (mini.length < 2 || mini.length > 7) {
      return res.status(400).json({
        error: {
          name: "invalid_length",
          message: "A mini must be between 2 and 7 characters",
        },
      });
    }
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
});
