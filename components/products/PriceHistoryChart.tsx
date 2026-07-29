"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PriceHistoryChartItem = {
  id: string;
  price: number;
  checkedAt: string;
};

type PriceHistoryChartProps = {
  data: PriceHistoryChartItem[];
  currencyCode: string;
};

function formatChartDate(value: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatTooltipDate(value: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatChartPrice(
  value: number,
  currencyCode: string,
): string {
  const formattedValue = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);

  return `${formattedValue} ${currencyCode}`;
}

export default function PriceHistoryChart({
  data,
  currencyCode,
}: PriceHistoryChartProps) {
  const chartData = [...data]
    .sort(
      (firstItem, secondItem) =>
        new Date(firstItem.checkedAt).getTime() -
        new Date(secondItem.checkedAt).getTime(),
    )
    .map((item) => ({
      ...item,
      dateLabel: formatChartDate(item.checkedAt),
    }));

  return (
    <div
      dir="ltr"
      className="h-[320px] w-full sm:h-[380px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 10,
            left: 10,
          }}
        >
          <CartesianGrid
            stroke="#E7E5E4"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="dateLabel"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#78716C",
              fontSize: 12,
            }}
            minTickGap={24}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#78716C",
              fontSize: 12,
            }}
            tickFormatter={(value: number) =>
              new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 0,
              }).format(value)
            }
            width={64}
            domain={["auto", "auto"]}
          />

          <Tooltip
            cursor={{
              stroke: "#A8A29E",
              strokeDasharray: "4 4",
            }}
            content={({ active, payload }) => {
              if (
                !active ||
                !payload ||
                payload.length === 0
              ) {
                return null;
              }

              const item = payload[0]?.payload as
                | PriceHistoryChartItem
                | undefined;

              if (!item) {
                return null;
              }

              return (
                <div
                  dir="rtl"
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-right shadow-lg"
                >
                  <p className="text-xs text-black/50">
                    {formatTooltipDate(item.checkedAt)}
                  </p>

                  <p
                    dir="ltr"
                    className="mt-1 text-left text-base font-bold text-[#C85A1A]"
                  >
                    {formatChartPrice(
                      item.price,
                      currencyCode,
                    )}
                  </p>
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#C85A1A"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#FFFFFF",
              stroke: "#C85A1A",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "#C85A1A",
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}