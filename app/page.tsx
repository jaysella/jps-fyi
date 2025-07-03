import { auth0 } from "@/lib/auth0";
import { notFound, redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth0.getSession();
  if (!session) return notFound();
  return redirect("/links");
}
