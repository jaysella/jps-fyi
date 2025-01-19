"use client";

import { createLink } from "@/app/actions/create-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NewLinkForm() {
  const [newUrl, setNewUrl] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl) {
      setIsSubmitting(true);

      try {
        const result = await createLink(newUrl, newSlug);
        if (result.success) {
          toast.success("Link created successfully");
          setNewUrl("");
          setNewSlug("");
        } else {
          toast.error("Failed to create link");
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleAddUrl}
      className="flex flex-row w-full space-x-2 mb-6"
    >
      <div className="flex space-x-2 flex-grow">
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
          className="w-1/3"
          disabled={isSubmitting}
        />
      </div>
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
      >
        <PlusCircle className="h-4 w-4" />
        Add URL
      </Button>
    </form>
  );
}
