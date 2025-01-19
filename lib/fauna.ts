import faunadb from "faunadb";

const q = faunadb.query;

export function createFaunaClient() {
  if (!process.env.FAUNA_GUEST_SECRET) {
    throw new Error("Configuration error: `FAUNA_GUEST_SECRET` environment variable not defined")
  }
  return new faunadb.Client({
    secret: process.env.FAUNA_GUEST_SECRET,
  });
}
