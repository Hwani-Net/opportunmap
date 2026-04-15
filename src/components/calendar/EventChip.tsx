import type { EventContentArg } from "@fullcalendar/core";
import type { Category } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";

export default function EventChip({ event }: { event: EventContentArg }) {
  const category = event.event.extendedProps.category as Category;
  const colors = CATEGORY_COLORS[category];

  return (
    <div
      className="flex items-center px-2 py-1 rounded-r cursor-pointer transition-opacity hover:opacity-80 w-full overflow-hidden"
      style={{
        borderLeft: `3px solid ${colors.main}`,
        backgroundColor: colors.bg,
      }}
    >
      <span
        className="text-[11px] font-semibold truncate"
        style={{ color: colors.text }}
      >
        {event.event.title}
      </span>
    </div>
  );
}
