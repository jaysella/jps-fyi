"use client";

import { refreshLinks } from "@/app/actions/refresh-links";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function LinksTableRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshLinks();
    // Fetch the latest data from the server
    window.location.reload(); // TODO: needed?
  };

  return (
    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />{" "}
      Refresh
    </Button>
  );
}
