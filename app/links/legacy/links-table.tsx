"use client";

import { deleteLink } from "@/app/actions/delete-link-legacy";
import { updateLink } from "@/app/actions/update-link";
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
import { copyToClipboard, timeSinceFromTimestamp } from "@/lib/utils";
import { ShortenedUrl } from "@/types";
import { Copy, Edit, ExternalLink, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function LinksTable({ links }: { links: ShortenedUrl[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState<ShortenedUrl | null>(null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleEditUrl = (url: ShortenedUrl) => {
    setEditingId(url.id);
    setEditUrl({ ...url });
  };

  const handleSaveEdit = async () => {
    if (editUrl) {
      const result = await updateLink(
        editUrl.id,
        editUrl.slug,
        editUrl.originalUrl
      );

      if (result.success) {
        setEditingId(null);
        setEditUrl(null);
        toast.success("Link updated successfully");
      } else {
        toast.error("Failed to update link");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditUrl(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prevIds) => [...prevIds, id]);
    const result = await deleteLink(id);
    if (result.success) {
      toast.success("Link deleted");
    }
    // setDeletingIds((prevIds) => [...prevIds.filter((pId) => pId !== id)]);
  };

  return (
    <div className="space-y-4">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Slug</TableHead>
            <TableHead>Original URL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((url) => (
            <TableRow
              key={url.id}
              className={deletingIds.includes(url.id) ? "animate-pulse" : ""}
            >
              <TableCell className="font-medium">
                {editingId === url.id ? (
                  <div className="flex items-center space-x-2">
                    <span>{process.env.NEXT_PUBLIC_BASE_URL}</span>
                    <Input
                      value={editUrl?.slug}
                      onChange={(e) =>
                        setEditUrl({ ...editUrl!, slug: e.target.value })
                      }
                      className="w-24"
                    />
                  </div>
                ) : (
                  `/${url.slug}`
                )}
              </TableCell>
              <TableCell>
                {editingId === url.id ? (
                  <Input
                    value={editUrl?.originalUrl}
                    onChange={(e) =>
                      setEditUrl({ ...editUrl!, originalUrl: e.target.value })
                    }
                  />
                ) : (
                  url.originalUrl
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {timeSinceFromTimestamp(url.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 justify-end">
                  {editingId === url.id ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSaveEdit}
                        disabled={deletingIds.includes(url.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCancelEdit}
                        disabled={deletingIds.includes(url.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(url.shortUrl, "_blank")}
                        disabled={deletingIds.includes(url.id)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(url.shortUrl).then(() => {
                            toast.success("Link copied to clipboard");
                          })
                        }
                        disabled={deletingIds.includes(url.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditUrl(url)}
                        disabled={deletingIds.includes(url.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(url.id)}
                        disabled={deletingIds.includes(url.id)}
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
