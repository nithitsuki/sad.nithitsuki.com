"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export function ShowCalendarButton() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="mb-0" aria-label="Show calendar" title="Show calendar">
          <CalendarDays />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle>Calendar</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />
      </DialogContent>
    </Dialog>
  );
}
