"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  copyToClipboard,
  formatTTL,
  timeSinceFromTimestamp,
} from "@/lib/utils";
import { ShortlinkData } from "@/types";
import { Copy, Edit, ExternalLink, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteShortlink } from "../actions/delete-link";

export function LinksTable({ links: shortlinks }: { links: ShortlinkData[] }) {
  const [editingKey, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState<ShortlinkData | null>(null);
  const [deletingKeys, setDeletingKeys] = useState<string[]>([]);

  const handleEditUrl = (url: ShortlinkData) => {
    setEditingId(url.key);
    setEditUrl({ ...url });
  };

  const handleSaveEdit = async () => {
    alert("Not implemented");
    // if (editUrl) {
    //   const result = await updateLink(
    //     editUrl.key,
    //     editUrl.key,
    //     editUrl.destinationUrl
    //   );

    //   if (result.success) {
    //     setEditingId(null);
    //     setEditUrl(null);
    //     toast.success("Link updated successfully");
    //   } else {
    //     toast.error("Failed to update link");
    //   }
    // }
  };

  const handleCancelEdit = () => {
    alert("Not implemented");
    // setEditingId(null);
    // setEditUrl(null);
  };

  const handleDelete = async (key: string) => {
    setDeletingKeys((prevKeys) => [...prevKeys, key]);
    const result = await deleteShortlink(key);
    if (result.success) {
      toast.success("Link deleted");
    } else {
      toast.error("Link not deleted: " + result.error);
    }
    setDeletingKeys((prevKeys) => prevKeys.filter((pKey) => pKey !== key));
  };

  return (
    <div className="space-y-4">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Slug</TableHead>
            <TableHead>Destination URL</TableHead>
            <TableHead>TTL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shortlinks.map((shortlink) => (
            <TableRow
              key={shortlink.key}
              className={
                deletingKeys.includes(shortlink.key) ? "animate-pulse" : ""
              }
            >
              <TableCell className="font-medium">
                {editingKey === shortlink.key ? (
                  <div className="flex items-center space-x-2">
                    <span>{process.env.NEXT_PUBLIC_BASE_URL}</span>
                    <Input
                      value={editUrl?.key}
                      onChange={(e) =>
                        setEditUrl({ ...editUrl!, key: e.target.value })
                      }
                      className="w-24"
                    />
                  </div>
                ) : (
                  `/${shortlink.key}`
                )}
              </TableCell>
              <TableCell>
                {editingKey === shortlink.key ? (
                  <Input
                    value={editUrl?.destinationUrl}
                    onChange={(e) =>
                      setEditUrl({
                        ...editUrl!,
                        destinationUrl: e.target.value,
                      })
                    }
                  />
                ) : (
                  shortlink.destinationUrl
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatTTL(shortlink.ttl)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {timeSinceFromTimestamp(shortlink.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 justify-end">
                  {editingKey === shortlink.key ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSaveEdit}
                        disabled={deletingKeys.includes(shortlink.key)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCancelEdit}
                        disabled={deletingKeys.includes(shortlink.key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(shortlink.url, "_blank")}
                        disabled={deletingKeys.includes(shortlink.key)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(shortlink.url).then(() => {
                            toast.success("Link copied to clipboard");
                          })
                        }
                        disabled={deletingKeys.includes(shortlink.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditUrl(shortlink)}
                        disabled={deletingKeys.includes(shortlink.key)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(shortlink.key)}
                        disabled={deletingKeys.includes(shortlink.key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
