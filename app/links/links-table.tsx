"use client";

import { deleteLink } from "@/app/actions/delete-link";
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
import { timeSinceFromTimestamp } from "@/helpers/timeSince";
import { ShortenedUrl } from "@/types";
import { Copy, Edit, ExternalLink, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

export function LinksTable({ links }: { links: any[] }) {
  const [urls, setUrls] = useState<ShortenedUrl[]>(links);

  const [newUrl, setNewUrl] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState<ShortenedUrl | null>(null);

  const handleEditUrl = (url: ShortenedUrl) => {
    setEditingId(url.id);
    setEditUrl({ ...url });
  };

  const handleSaveEdit = () => {
    if (editUrl) {
      setUrls(
        urls.map((url) =>
          url.id === editUrl.id
            ? {
                ...editUrl,
                shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${editUrl.slug}`,
              }
            : url
        )
      );
      setEditingId(null);
      setEditUrl(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditUrl(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteLink(id);
    if (result.success) {
      setUrls(urls.filter((url) => url.id !== id));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Short URL</TableHead>
          <TableHead>Original URL</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {urls.map((url) => (
          <TableRow key={url.id}>
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
            <TableCell>{timeSinceFromTimestamp(url.createdAt)}</TableCell>
            <TableCell>{url.clicks}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {editingId === url.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSaveEdit}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCancelEdit}
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
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(url.shortUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditUrl(url)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(url.id)}
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
  );
}
