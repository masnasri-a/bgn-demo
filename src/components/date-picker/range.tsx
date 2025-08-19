"use client"

import * as React from "react"
import { useDateRangeStore } from "@/store/dateRangeStore"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerRange() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRangeStore();

  // Handler for selecting start date
  const handleStartDate = (date?: Date) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    setStartDate(formattedDate);
    // If endDate is before new startDate, reset endDate
    if (endDate && date && formattedDate > endDate) {
      setEndDate("");
    }
  };

  // Handler for selecting end date
  const today = new Date();
  // Remove time part for comparison
  today.setHours(0, 0, 0, 0);

  const handleEndDate = (date?: Date) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    if (startDate && date && formattedDate < startDate) {
      // Prevent selecting endDate before startDate
      return;
    }
    if (date && date > today) {
      // Prevent selecting endDate after today
      return;
    }
    setEndDate(formattedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!startDate || !endDate}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
        >
          <CalendarIcon />
          {startDate && endDate
            ? `${startDate} - ${endDate}`
            : <span>Pilih rentang tanggal</span>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="flex gap-4">
          <div>
            <div className="mb-2 text-sm font-medium">Start Date</div>
            <Calendar mode="single" selected={startDate ? new Date(startDate) : undefined} onSelect={handleStartDate}  disabled={(date) => {
                if (startDate && format(date, "yyyy-MM-dd") < startDate) return true;
                // Remove time part for comparison
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d > today;
              }}/>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">End Date</div>
            <Calendar
              mode="single"
              selected={endDate ? new Date(endDate) : undefined}
              onSelect={handleEndDate}
              disabled={(date) => {
                if (startDate && format(date, "yyyy-MM-dd") < startDate) return true;
                // Remove time part for comparison
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d > today;
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}