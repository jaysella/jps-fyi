import { getSession } from "@auth0/nextjs-auth0";
import { notFound, redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getSession();
  if (!session) return notFound();
  return redirect("/links");
}
