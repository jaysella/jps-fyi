import { Suspense } from "react";
import { LinksSection } from "./links.server";
import { NewLinkForm } from "./new-link-form";

export const metadata = {
  title: "Links",
};

export default async function LinksPage() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-10">
      <div className="space-y-8">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Links</h1>
            <p className="text-muted-foreground">Manage shortened URLs</p>
          </div>
          {/* <div className="flex justify-end">
            <LinksTableRefresh />
          </div> */}
        </div>
        <div className="space-y-4">
          <NewLinkForm />
          <Suspense fallback={"Loading..."}>
            <LinksSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
