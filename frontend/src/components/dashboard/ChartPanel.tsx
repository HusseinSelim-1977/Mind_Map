import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

const MOCK_LINE_DATA = [
  { name: "Mon", tasks: 4 },
  { name: "Tue", tasks: 7 },
  { name: "Wed", tasks: 5 },
  { name: "Thu", tasks: 12 },
  { name: "Fri", tasks: 8 },
  { name: "Sat", tasks: 3 },
  { name: "Sun", tasks: 2 },
];

export function ChartPanel() {
  const [range, setRange] = useState("week");

  return (
    <div className="flex flex-col gap-24 rounded-16 border border-slate-100 bg-white p-24 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Team Velocity</h3>
          <p className="text-xs text-slate-400">Tasks completed over time</p>
        </div>
        <div className="flex gap-8 rounded-8 bg-slate-50 p-4">
          {["week", "month"].map((r) => (
            <Button
              key={r}
              variant="ghost"
              size="sm"
              onClick={() => setRange(r)}
              className={cn(
                "h-8 px-12 text-[10px] uppercase tracking-wider",
                range === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_LINE_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8" />
            <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 10%)" }}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#0f172a"
              strokeWidth={2}
              dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
