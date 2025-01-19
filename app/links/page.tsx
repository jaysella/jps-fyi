import { Suspense } from "react";
import { LinksTableRefresh } from "./links-table-refresh";
import { LinksSection } from "./links.server";

export const metadata = {
  title: "Links",
};

export default function LinksPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Links</h1>
            <p className="text-muted-foreground">Manage shortened URLs</p>
          </div>
          <div className="flex justify-end">
            <LinksTableRefresh />
          </div>
        </div>
        <div>
          <Suspense fallback={"Loading..."}>
            <LinksSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
