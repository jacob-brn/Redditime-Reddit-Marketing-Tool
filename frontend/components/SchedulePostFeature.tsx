"use client";
import { Area, AreaChart, Dot } from "recharts";
import { useMemo } from "react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 40 },
  { month: "March", desktop: 56 },
  { month: "April", desktop: 73 }, // Highest value
  { month: "May", desktop: 59 },
  { month: "June", desktop: 54 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function SchedulePostFeature() {
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((item) => item.desktop));
  }, []);

  const renderHighestDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (
      payload &&
      typeof payload === "object" &&
      "desktop" in payload &&
      payload.desktop === maxValue
    ) {
      return (
        <Dot
          {...props}
          key={`dot-${payload.desktop}`}
          cx={cx}
          cy={cy}
          r={5}
          fillOpacity={1}
          fill={"var(--chart-5)"}
          strokeWidth={2}
        />
      );
    }
    return <g key={`dot-${payload.desktop}`} />;
  };

  return (
    <div className="relative w-full h-min overflow-hidden">
      <ChartContainer config={chartConfig} className="w-full">
        <AreaChart
          className="w-full h-full"
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
            top: 10,
          }}
        >
          <Area
            dataKey="desktop"
            type="natural"
            fill={"var(--primary)"}
            fillOpacity={0.25}
            stroke="var(--primary)"
            stackId="a"
            dot={renderHighestDot}
            activeDot={false}
          />
        </AreaChart>
      </ChartContainer>
      <div className="pointer-events-none absolute bottom-0 left-0 h-14 sm:h-28 w-full bg-gradient-to-t from-background to-transparent z-20" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-full w-24 bg-gradient-to-r from-background from-10% to-transparent z-0" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-full w-24 bg-gradient-to-l from-background from-10% to-transparent z-0" />
    </div>
  );
}
