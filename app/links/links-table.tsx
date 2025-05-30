"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { updateShortlink } from "../actions/update-link";

export function LinksTable({ links: shortlinks }: { links: ShortlinkData[] }) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [shortlinkEdits, setShortlinkEdits] = useState<{
    key: string;
    newKey?: string;
    newDestinationUrl?: string;
    newTTL?: string;
  } | null>(null);
  const [deletingKeys, setDeletingKeys] = useState<string[]>([]);

  const handleEditUrl = (url: ShortlinkData) => {
    setEditingKey(url.key);
    setShortlinkEdits({ ...url });
  };

  const handleSaveEdit = async () => {
    if (shortlinkEdits) {
      const result = await updateShortlink(shortlinkEdits.key, {
        newKey: shortlinkEdits.newKey,
        newDestinationUrl: shortlinkEdits.newDestinationUrl,
        newTTL: shortlinkEdits.newTTL
          ? parseInt(shortlinkEdits.newTTL)
          : undefined,
      });

      if (result.success) {
        setEditingKey(null);
        setShortlinkEdits(null);
        toast.success("Link updated successfully");
      } else {
        toast.error("Failed to update link");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setShortlinkEdits(null);
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
      <form
        onSubmit={(ev: React.SyntheticEvent<HTMLFormElement>) => {
          ev.preventDefault();
          handleSaveEdit();
        }}
      >
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Destination URL</TableHead>
              <TableHead>TTL</TableHead>
              <TableHead>Visits</TableHead>
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
                        value={shortlinkEdits?.newKey ?? shortlinkEdits?.key}
                        onChange={(e) =>
                          setShortlinkEdits({
                            key: shortlink.key,
                            newKey: e.target.value,
                          })
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
                      value={
                        shortlinkEdits?.newDestinationUrl ??
                        shortlink.destinationUrl
                      }
                      onChange={(e) =>
                        setShortlinkEdits({
                          key: shortlink.key,
                          newDestinationUrl: e.target.value,
                        })
                      }
                    />
                  ) : (
                    shortlink.destinationUrl
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {editingKey === shortlink.key ? (
                    <Select
                      onValueChange={(e) =>
                        setShortlinkEdits({
                          key: shortlink.key,
                          newTTL: e,
                        })
                      }
                      defaultValue={String(shortlink.ttl)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select a TTL" />
                      </SelectTrigger>
                      <SelectContent>
                        {shortlink.ttl !== -1 && (
                          <SelectItem value={String(shortlink.ttl)}>
                            Current ({formatTTL(shortlink.ttl)})
                          </SelectItem>
                        )}
                        <SelectItem value="-1">Never</SelectItem>
                        <SelectItem value={String(60 * 60)}>1 hour</SelectItem>
                        <SelectItem value={String(60 * 60 * 24)}>
                          1 day
                        </SelectItem>
                        <SelectItem value={String(60 * 60 * 24 * 7)}>
                          1 week
                        </SelectItem>
                        <SelectItem value={String(60 * 60 * 24 * 7 * 31)}>
                          1 month
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    formatTTL(shortlink.ttl)
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {shortlink.visits}
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
      </form>
    </div>
  );
}
