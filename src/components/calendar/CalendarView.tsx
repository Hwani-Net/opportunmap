import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { Contest } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";
import { CATEGORY_LABEL } from "../../types/contest";
import EventChip from "./EventChip";

interface CalendarViewProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

const LEGEND_CATEGORIES = ["contest", "hackathon", "startup", "grant"] as const;

export default function CalendarView({
  contests,
  onSelectContest,
}: CalendarViewProps) {
  const events = contests.map((c) => ({
    id: c.id,
    title: c.title,
    start: c.applicationEnd.toDate(),
    backgroundColor: "transparent",
    borderColor: "transparent",
    extendedProps: { category: c.category, organizer: c.organizer },
  }));

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {LEGEND_CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[cat].main }}
            />
            <span className="text-xs text-[#9CA3AF] font-medium">
              {CATEGORY_LABEL[cat]}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listWeek",
          }}
          events={events}
          eventClick={(info) => onSelectContest(info.event.id)}
          eventContent={(arg) => <EventChip event={arg} />}
          locale="ko"
          height="auto"
          dayMaxEvents={3}
          buttonText={{
            today: "오늘",
            month: "월간",
            list: "주간",
          }}
          titleFormat={{ year: "numeric", month: "long" }}
        />
      </div>
    </div>
  );
}
