"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsData {
  _id: {
    [x: string]: any;
    day: number;
    month: number;
    year: number;
  };
  count: number;
}

const bulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const AnalyticsPage = () => {
  const [chartData, setChartData] = useState<AnalyticsData[]>([]);
  const [searchParams] = useSearchParams();
  const [versi, setVersi] = useState<string[]>(["Semua"]);
  const appName = searchParams.get("appName") || "HidupBanjaran";
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    const uniqueVersions = Array.from(
      new Set(chartData.map((item) => item._id.version))
    );
    setVersi(["Semua", ...uniqueVersions]);
  }, [chartData]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/enroll/analytics?appName=${appName}`
      );
      if (response.ok) {
        const data = await response.json();
        setChartData(data.data);
      } else {
        console.error("Failed to fetch analytics data");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const formattedData = chartData.map((item) => {
    return {
      date: `(${item._id.version}) ${item._id.day} ${
        bulan[item._id.month - 1]
      } ${item._id.year}`,
      count: item.count,
    };
  });

  const filteredData = formattedData.filter((item) =>
    selectedVersion && selectedVersion !== "Semua"
      ? item.date.includes(selectedVersion)
      : true
  );

  const chartConfig = {
    count: {
      label: "Enrollments",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="default"
            className="ml-2"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Analytic Enrolled Apps</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{appName}</CardTitle>
          <CardDescription>Enrollment data visualization.</CardDescription>
          <Select onValueChange={(value) => setSelectedVersion(value)}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter Berdasarkan Versi" />
            </SelectTrigger>
            <SelectContent>
              {versi.map((e) => {
                return (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={filteredData}
                accessibilityLayer
                margin={{
                  top: 30,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
                maxBarSize={100}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value}
                  fontSize={14}
                  fontWeight={"bold"}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel indicator="dashed" />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={10}>
                  <LabelList
                    position="insideTop"
                    offset={20}
                    className="fill-white"
                    fontSize={14}
                    fontWeight={"bold"}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
