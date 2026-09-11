import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "var(--popover-foreground)",
    fontSize: 12,
  },
  labelStyle: { color: "var(--muted-foreground)" },
};

export function ThreatChart({
  data,
}: {
  data: { hour: string; safe: number; suspicious: number; highRisk: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          {(
            [
              ["safeFill", "var(--safe)"],
              ["suspFill", "var(--suspicious)"],
              ["highFill", "var(--critical)"],
            ] as const
          ).map(([id, color]) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.5} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="hour" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="safe"
          name="Safe calls"
          stroke="var(--safe)"
          fill="url(#safeFill)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="suspicious"
          name="Suspicious"
          stroke="var(--suspicious)"
          fill="url(#suspFill)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="highRisk"
          name="High risk"
          stroke="var(--critical)"
          fill="url(#highFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RiskDistributionChart({
  data,
}: {
  data: { name: string; value: number; tone: "safe" | "medium" | "suspicious" | "critical" }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={104} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={`var(--${entry.tone})`} stroke="var(--background)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ThreatsOverTimeChart({ data }: { data: { day: string; threats: number; calls: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="threats"
          name="Threats detected"
          stroke="var(--critical)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="calls"
          name="Calls analysed"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryBarChart({
  data,
  dataKey,
  nameKey,
  color = "var(--primary)",
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey: string;
  color?: string | undefined;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={nameKey} {...axisProps} interval={0} angle={-18} dy={10} height={52} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={46} />
      </BarChart>
    </ResponsiveContainer>
  );
}
