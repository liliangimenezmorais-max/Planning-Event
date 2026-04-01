"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 w-[300px]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-between pt-1 relative items-center mb-4 px-2",
        caption_label: "text-xl font-bold font-headline text-slate-900 capitalize",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 opacity-100 hover:bg-slate-100 text-slate-600 rounded-full transition-colors"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 w-full mb-2 border-b border-slate-100 pb-2",
        head_cell:
          "text-slate-500 rounded-md w-full font-bold text-sm uppercase text-center",
        row: "grid grid-cols-7 w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full flex items-center justify-center"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-bold text-slate-700 aria-selected:opacity-100 hover:bg-slate-100 hover:text-slate-900 transition-all rounded-lg"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue-100 text-primary hover:bg-blue-200 hover:text-primary focus:bg-blue-100 focus:text-primary shadow-none font-black",
        day_today: "text-primary underline decoration-2 underline-offset-4",
        day_outside:
          "day-outside text-slate-300 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-slate-200 opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        formatCaption: (date, options) => {
          const month = date.toLocaleString(options?.locale?.code, { month: 'long' });
          const year = date.getFullYear();
          return `${month} ${year}`;
        },
        formatWeekdayName: (date, options) => {
          return date.toLocaleString(options?.locale?.code, { weekday: 'short' }).charAt(0).toUpperCase();
        }
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-5 w-5", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-5 w-5", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
