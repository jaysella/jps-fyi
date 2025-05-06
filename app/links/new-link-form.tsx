"use client";

import { createLink } from "@/app/actions/create-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { copyToClipboard } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NewLinkForm() {
  const [newUrl, setNewUrl] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newTTL, setNewTTL] = useState(String(60 * 60 * 24)); // default to 24 hours
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUrl) {
      setIsSubmitting(true);

      try {
        toast.promise(createLink(newUrl, newSlug, parseInt(newTTL)), {
          loading: "Creating link...",
          success: async (data) => {
            setNewUrl("");
            setNewSlug("");
            return await copyToClipboard(data.data?.key)
              .then(
                () =>
                  `/${data.data?.key} shortlink created successfully and copied to clipboard`
              )
              .catch(() => `/${data.data?.key} shortlink created successfully`);
          },
          error: "Failed to create link",
        });
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="p-4 bg-stone-50 border">
      <h2 className="text-lg font-bold tracking-tight mb-1">Create New Link</h2>
      <form
        onSubmit={handleAddUrl}
        className="flex flex-col md:flex-row w-full gap-2"
      >
        <div className="flex flex-col md:flex-row gap-2 flex-grow">
          <Input
            type="url"
            placeholder="Enter a long URL to shorten"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-grow"
            required
            disabled={isSubmitting}
          />
          <Input
            type="text"
            placeholder="Custom slug (optional)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="md:w-1/3"
            disabled={isSubmitting}
          />
          <Select onValueChange={(e) => setNewTTL(e)} defaultValue={newTTL}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select an expiration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Never</SelectItem>
              <SelectItem value={String(60 * 60)}>1 hour</SelectItem>
              <SelectItem value={String(60 * 60 * 24)}>1 day</SelectItem>
              <SelectItem value={String(60 * 60 * 24 * 7)}>1 week</SelectItem>
              <SelectItem value={String(60 * 60 * 24 * 7 * 31)}>
                1 month
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          <PlusCircle className="h-4 w-4" />
          Add Link
        </Button>
      </form>
    </div>
  );
}
