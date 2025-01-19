import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Suspense } from "react";
import { LinksSection } from "./links.server";

export const metadata = {
  title: "Links",
};

export default withPageAuthRequired(
  async function LinksPage() {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Links</h1>
            <p className="text-muted-foreground">Manage shortened URLs</p>
          </div>
          <div>
            <Suspense fallback={"Loading..."}>
              <LinksSection />
            </Suspense>
          </div>
        </div>
      </div>
    );
  },
  { returnTo: "/links" }
);
