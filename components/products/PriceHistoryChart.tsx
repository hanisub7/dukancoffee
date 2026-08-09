"use client";

import { useMemo, useState } from "react";

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

type ChartRange =
  | "30_DAYS"
  | "90_DAYS"
  | "6_MONTHS"
  | "1_YEAR"
  | "ALL";

const chartRanges: Array<{
  value: ChartRange;
  label: string;
  days: number | null;
}> = [
  {
    value: "30_DAYS",
    label: "30 يومًا",
    days: 30,
  },
  {
    value: "90_DAYS",
    label: "90 يومًا",
    days: 90,
  },
  {
    value: "6_MONTHS",
    label: "6 أشهر",
    days: 183,
  },
  {
    value: "1_YEAR",
    label: "سنة",
    days: 365,
  },
  {
    value: "ALL",
    label: "كل الفترة",
    days: null,
  },
];

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
  const [selectedRange, setSelectedRange] =
    useState<ChartRange>("ALL");

  const sortedData = useMemo(
    () =>
      [...data].sort(
        (firstItem, secondItem) =>
          new Date(firstItem.checkedAt).getTime() -
          new Date(secondItem.checkedAt).getTime(),
      ),
    [data],
  );

  const filteredData = useMemo(() => {
    const selectedRangeDetails = chartRanges.find(
      (range) => range.value === selectedRange,
    );

    if (
      !selectedRangeDetails ||
      selectedRangeDetails.days === null ||
      sortedData.length === 0
    ) {
      return sortedData;
    }

    const latestEntry =
      sortedData[sortedData.length - 1];

    const latestTimestamp = new Date(
      latestEntry.checkedAt,
    ).getTime();

    const earliestAllowedTimestamp =
      latestTimestamp -
      selectedRangeDetails.days *
        24 *
        60 *
        60 *
        1000;

    return sortedData.filter(
      (item) =>
        new Date(item.checkedAt).getTime() >=
        earliestAllowedTimestamp,
    );
  }, [selectedRange, sortedData]);

  const chartData = useMemo(
    () =>
      filteredData.map((item) => ({
        ...item,
        dateLabel: formatChartDate(item.checkedAt),
      })),
    [filteredData],
  );

  const statistics = useMemo(() => {
    if (filteredData.length === 0) {
      return null;
    }

    const prices = filteredData.map(
      (item) => item.price,
    );

    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);

    const averagePrice =
      prices.reduce(
        (total, price) => total + price,
        0,
      ) / prices.length;

    const latestPrice =
      filteredData[filteredData.length - 1].price;

    return {
      latestPrice,
      lowestPrice,
      highestPrice,
      averagePrice,
    };
  }, [filteredData]);

  return (
    <div dir="rtl" className="w-full">
      <div className="flex flex-col gap-5 border-b border-stone-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900">
            حركة السعر
          </h3>

          <p className="mt-1 text-sm leading-6 text-stone-500">
            اختر الفترة الزمنية لمراجعة الأسعار المسجلة.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {chartRanges.map((range) => {
            const selected =
              selectedRange === range.value;

            return (
              <button
                key={range.value}
                type="button"
                onClick={() =>
                  setSelectedRange(range.value)
                }
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-[#C85A1A] bg-orange-50 text-[#C85A1A]"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {statistics ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
<div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
  <p className="text-xs font-medium text-stone-500">
                أحدث سعر
              </p>

              <p
                dir="ltr"
                className="mt-2 text-left text-xl font-bold text-stone-900"
              >
                {formatChartPrice(
                  statistics.latestPrice,
                  currencyCode,
                )}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium text-stone-500">
                أقل سعر مسجل
              </p>

              <p
                dir="ltr"
                className="mt-2 text-left text-xl font-bold text-stone-900"
              >
                {formatChartPrice(
                  statistics.lowestPrice,
                  currencyCode,
                )}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium text-stone-500">
                أعلى سعر مسجل
              </p>

              <p
                dir="ltr"
                className="mt-2 text-left text-xl font-bold text-stone-900"
              >
                {formatChartPrice(
                  statistics.highestPrice,
                  currencyCode,
                )}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium text-stone-500">
                متوسط السعر
              </p>

              <p
                dir="ltr"
                className="mt-2 text-left text-xl font-bold text-stone-900"
              >
                {formatChartPrice(
                  statistics.averagePrice,
                  currencyCode,
                )}
              </p>
            </div>
          </div>

<div
  dir="ltr"
  className="mt-5 h-[240px] w-full sm:h-[300px]"
>
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
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
                  width={70}
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
                        className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-right shadow-xl"
                      >
                        <p className="text-xs font-medium text-stone-500">
                          {formatTooltipDate(
                            item.checkedAt,
                          )}
                        </p>

                        <p
                          dir="ltr"
                          className="mt-2 text-left text-xl font-extrabold tracking-tight text-[#C85A1A]"
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
                  strokeWidth={4}
                  connectNulls
                  dot={{
                    r: 5,
                    fill: "#FFFFFF",
                    stroke: "#C85A1A",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#C85A1A",
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-4 text-xs leading-5 text-stone-400">
            تعرض الإحصاءات الأسعار المسجلة خلال الفترة
            المحددة فقط.
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-6 py-12 text-center">
          <p className="font-semibold text-stone-900">
            لا توجد أسعار مسجلة لهذه الفترة
          </p>

          <p className="mt-2 text-sm text-stone-500">
            اختر فترة زمنية أخرى لعرض البيانات المتاحة.
          </p>
        </div>
      )}
    </div>
  );
}