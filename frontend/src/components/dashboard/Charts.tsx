import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STATUS_DATA = [
  { name: "To Do", value: 8 },
  { name: "In Progress", value: 6 },
  { name: "In Review", value: 4 },
  { name: "Done", value: 6 },
];

const PRIORITY_DATA = [
  { name: "High", value: 5, color: "#ef4444" },
  { name: "Medium", value: 12, color: "#f59e0b" },
  { name: "Low", value: 7, color: "#3b82f6" },
];

export function Charts() {
  return (
    <div className="flex flex-col gap-16 rounded-16 border border-slate-100 bg-white p-24 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Tasks by Priority</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={PRIORITY_DATA}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {PRIORITY_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 10%)" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-12 mt-8">
          {PRIORITY_DATA.map((p) => (
            <div key={p.name} className="flex items-center gap-4">
              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[10px] text-slate-500 font-medium uppercase">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
