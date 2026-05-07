"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

function parseDateFromString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function CalendarClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? parseDateFromString(dateParam) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const params = new URLSearchParams(searchParams);
    params.set("date", formatDateToString(date));
    router.push(`/dashboard?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {selectedDate ? formatDisplayDate(selectedDate) : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md"
        />
      </PopoverContent>
    </Popover>
  );
}