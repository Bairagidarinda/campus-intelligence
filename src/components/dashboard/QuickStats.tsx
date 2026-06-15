import { BookOpen, Utensils, CalendarDays } from "lucide-react";

const stats = [
  {
    label: "Books Available",
    value: "2,847",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Today's Special",
    value: "Paneer Tikka",
    icon: Utensils,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Events This Week",
    value: "12",
    icon: CalendarDays,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
