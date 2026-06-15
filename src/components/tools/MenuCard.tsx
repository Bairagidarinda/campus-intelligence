import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Flame, Star } from "lucide-react";

interface MenuCardProps {
  toolName: string;
  data: any;
}

export function MenuCard({ toolName, data }: MenuCardProps) {
  const isWeekly = toolName.includes("weekly");

  // Handle weekly menu structure: {days: [{day, cafeterias: [{name, meals: {breakfast: ...}}]}]}
  if (isWeekly && data.days) {
    return (
      <div className="mt-2 space-y-3">
        {data.days.map((dayEntry: any, dIdx: number) => (
          <div key={dIdx} className="space-y-2">
            <p className="text-sm font-semibold text-slate-200">{dayEntry.day}</p>
            {dayEntry.cafeterias?.map((cafe: any, cIdx: number) => (
              <Card key={cIdx} className="border-l-4 border-l-orange-500 bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-orange-400" />
                    <CardTitle className="text-sm text-slate-100">{cafe.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {cafe.meals && Object.entries(cafe.meals).map(([mealType, mealData]: [string, any]) => (
                    <MealSection key={mealType} mealType={mealType} mealData={mealData} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Handle today's menu structure: {date: "Monday", cafeterias: [{name, meals: {breakfast: ...}}]}
  if (data.cafeterias && Array.isArray(data.cafeterias)) {
    return (
      <div className="mt-2 space-y-3">
        {data.cafeterias.map((cafe: any, cIdx: number) => (
          <Card key={cIdx} className="border-l-4 border-l-orange-500 bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-orange-400" />
                <CardTitle className="text-sm text-slate-100">
                  {cafe.name} — {data.date || "Today"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {cafe.meals && Object.entries(cafe.meals).map(([mealType, mealData]: [string, any]) => (
                <MealSection key={mealType} mealType={mealType} mealData={mealData} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Fallback for single cafeteria data
  const cafeName = data.cafeteria || data.cafeteria_name || "Campus Cafeteria";
  const meals = data.meals || {};

  return (
    <div className="mt-2">
      <Card className="border-l-4 border-l-orange-500 bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-orange-400" />
            <CardTitle className="text-sm text-slate-100">
              {isWeekly ? `${cafeName} — Weekly Menu` : `${cafeName} — ${data.date || "Today"}`}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {Object.entries(meals).map(([mealType, mealData]: [string, any]) => (
            <MealSection key={mealType} mealType={mealType} mealData={mealData} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MealSection({ mealType, mealData }: { mealType: string; mealData: any }) {
  if (!mealData || !mealData.items || mealData.items.length === 0) {
    return (
      <div className="rounded-md border border-slate-700/50 bg-slate-800/30 p-2">
        <p className="mb-1 font-medium capitalize text-slate-300">{mealType}</p>
        <p className="text-[10px] text-slate-500">No items available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-700/50 bg-slate-800/30 p-2">
      <p className="mb-2 font-medium capitalize text-slate-300">{mealType}</p>
      <div className="flex flex-wrap gap-1.5">
        {mealData.items.map((item: any, i: number) => (
          <Badge key={i} variant="outline" className="gap-1 border-slate-600/50 bg-slate-700/30 text-[10px] text-slate-300">
            {item.name}
            {item.is_todays_special && <Star className="h-2.5 w-2.5 text-amber-400" />}
            {item.type === "veg" && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
            {item.type === "non-veg" && <span className="h-2 w-2 rounded-full bg-red-400" />}
            {item.type === "vegan" && <span className="h-2 w-2 rounded-full bg-yellow-400" />}
            {item.calories && (
              <span className="flex items-center gap-0.5 text-slate-400">
                <Flame className="h-2.5 w-2.5" />
                {item.calories}
              </span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}
