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
    window.location.reload();
  };

  return (
    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />{" "}
      Refresh
    </Button>
  );
}
