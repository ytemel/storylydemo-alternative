import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  BarChart3,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import React from "react"; // Added missing import for React
import RecommendedActions from "../components/RecommendedActions";

export default function Analytics() {
  const [selectedWidgetType, setSelectedWidgetType] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [activeTab, setActiveTab] = useState("performance"); // Changed default to performance

  // Mock chart data - in real app this would come from analytics API
  const chartData = [
    {
      date: "Jun 19",
      reach: 45000,
      impression: 42000,
      click: 3500,
      conversion: 280,
    },
    {
      date: "Jun 20",
      reach: 52000,
      impression: 48000,
      click: 4100,
      conversion: 315,
    },
    {
      date: "Jun 21",
      reach: 48000,
      impression: 45000,
      click: 3800,
      conversion: 295,
    },
    {
      date: "Jun 22",
      reach: 65000,
      impression: 58000,
      click: 4900,
      conversion: 385,
    },
    {
      date: "Jun 23",
      reach: 58000,
      impression: 52000,
      click: 4200,
      conversion: 340,
    },
    {
      date: "Jun 24",
      reach: 72000,
      impression: 65000,
      click: 5200,
      conversion: 420,
    },
    {
      date: "Jun 25",
      reach: 68000,
      impression: 61000,
      click: 4800,
      conversion: 390,
    },
  ];

  const performanceMetrics = [
    {
      name: "Reach",
      value: "2.4m",
      change: "+62%",
      trend: "up",
      description: "Unique devices that caused an impression",
    },
    {
      name: "Impression",
      value: "82k",
      change: "-1%",
      trend: "down",
      description: "Total widget views",
    },
    {
      name: "Click",
      value: "453k",
      change: "+42%",
      trend: "up",
      description: "Widget interactions",
    },
    {
      name: "Add-to-wishlist rate",
      value: "12.5%",
      change: "+8%",
      trend: "up",
      description: "Percentage of users who added items to wishlist",
    },
    {
      name: "Product detail page visits",
      value: "45.2k",
      change: "+15%",
      trend: "up",
      description: "Number of product detail page visits",
    },
    {
      name: "CTR",
      value: "8.2%",
      change: "+12%",
      trend: "up",
      description: "Click-through rate for campaigns",
    },
    {
      name: "Add to Cart Rate",
      value: "6.8%",
      change: "+9%",
      trend: "up",
      description: "Percentage of users who added items to cart",
    },
    {
      name: "Conversion Rate",
      value: "3.2%",
      change: "+5%",
      trend: "up",
      description: "Overall conversion rate",
    },
    {
      name: "Units Sold",
      value: "1.2k",
      change: "+18%",
      trend: "up",
      description: "Total units sold through campaigns",
    },
    {
      name: "Add to Wishlist Rate",
      value: "9.3%",
      change: "+11%",
      trend: "up",
      description: "Percentage of users who added items to wishlist",
    },
    {
      name: "AOV",
      value: "$89.50",
      change: "+7%",
      trend: "up",
      description: "Average order value",
    },
    {
      name: "Skip",
      value: "132k",
      change: "-18%",
      trend: "down",
      description: "Users who skipped the widget",
    },
    {
      name: "Open",
      value: "132k",
      change: "-18%",
      trend: "down",
      description: "Widget opens",
    },
    {
      name: "Complete",
      value: "132k",
      change: "-18%",
      trend: "down",
      description: "Widget completions",
    },
  ];

  const storyGroups = [
    { name: "Trending", image: "👑", impression: "12.5K" },
    { name: "Offers", image: "🎯", impression: "12.5K" },
    { name: "Brands", image: "✨", impression: "12.5K" },
    { name: "Ramazan Tarifleri", image: "🍽️", impression: "12.5K" },
    { name: "What's Hot", image: "🔥", impression: "12.5K" },
    { name: "Black Friday", image: "🛍️", impression: "12.5K" },
  ];

  const topPerformers = [
    {
      id: 1,
      name: "Summer Collection",
      views: "12.5K",
      engagement: "85%",
      ctr: "4.2%",
    },
    {
      id: 2,
      name: "Product Launch",
      views: "12.5K",
      engagement: "78%",
      ctr: "3.8%",
    },
    {
      id: 3,
      name: "Holiday Special",
      views: "12.5K",
      engagement: "72%",
      ctr: "3.5%",
    },
    {
      id: 4,
      name: "New Arrivals",
      views: "12.5K",
      engagement: "69%",
      ctr: "3.2%",
    },
    {
      id: 5,
      name: "Weekend Sale",
      views: "12.5K",
      engagement: "65%",
      ctr: "2.9%",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Performance insights and metrics</p>
        </div>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Create report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <Select
          value={selectedWidgetType}
          onValueChange={setSelectedWidgetType}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select widget type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Widgets</SelectItem>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="story-bar">Story Bar</SelectItem>
            <SelectItem value="video-feed">Video Feed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Jan 19, 2022 - Jan 25, 2022
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Conversion Funnel Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center justify-between gap-2">
                {[
                  "Impression",
                  "Started",
                  "Answered",
                  "Completed",
                  "Result Page Click",
                  "PDP View",
                  "Conversion",
                ].map((stage, idx, arr) => (
                  <React.Fragment key={stage}>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-semibold text-purple-700 text-xs border border-purple-300">
                        {stage[0]}
                      </div>
                      <span className="text-xs mt-1 text-gray-700">
                        {stage}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            {performanceMetrics.map((metric) => (
              <Card key={metric.name} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    {metric.name}
                  </h3>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </Card>
            ))}
          </div>
          {/* Chart Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Reach</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Daily
                  </Button>
                  <Button variant="outline" size="sm">
                    Weekly
                  </Button>
                  <Button variant="outline" size="sm">
                    Monthly
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Unique devices that caused an impression
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="reach"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Total"
                    />
                    <Line
                      type="monotone"
                      dataKey="impression"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Women page"
                    />
                    <Line
                      type="monotone"
                      dataKey="click"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Default"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Story Groups */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Story Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                {storyGroups.map((group) => (
                  <div key={group.name} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto">
                      {group.image}
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {group.name}
                    </p>
                    <p className="text-xs text-gray-500">Impression</p>
                    <p className="text-xs font-medium">{group.impression}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                {topPerformers.map((performer) => (
                  <div key={performer.id} className="text-center">
                    <div className="w-full aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-2"></div>
                    <p className="text-xs text-gray-500 mb-1">View</p>
                    <p className="text-xs font-medium">{performer.views}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Widget Performance Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Story Groups</TableHead>
                    <TableHead>Widgets</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Reach</TableHead>
                    <TableHead>Impression</TableHead>
                    <TableHead>Click</TableHead>
                    <TableHead>Skip</TableHead>
                    <TableHead>Open</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm">
                          👑
                        </div>
                        <span className="text-sm font-medium">Trending</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Default</span>
                        <span className="text-xs text-gray-500">
                          Duolingo Language
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">None</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">47,345</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">47,345</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">-</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">-</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">0</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-sm">
                          🏠
                        </div>
                        <span className="text-sm font-medium">
                          New Arrivals
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Home page</span>
                        <span className="text-xs text-gray-500">
                          Duolingo Language
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">Labels</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">564,345</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">564,345</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">-</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">-</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">0</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 mb-2">
                AI-generated evaluation of your recipes and widgets:
              </div>
              <ul className="list-disc ml-6 text-sm text-gray-600 space-y-1">
                                  <li>
                    Story Bar widgets with Smart Sorting enabled have the highest
                    conversion rates.
                  </li>
                <li>
                  Recipes targeting new users perform best when combined with
                  onboarding content.
                </li>
                <li>
                  Performance drops when more than 4 widgets are shown on a
                  single page.
                </li>
                <li>
                Banner-to-vertical feed flows have driven 12% higher conversion in your industry over the past 30 days, yet none are currently in use on your side.
                </li>
                <li>
                Customers logging in for the first time are more likely to skip story content compared to returning users.
                </li>
                <li>
                Click rates exceed the industry average, but skip rates are also above the norm.                </li>
              </ul>
              <div className="mt-4 text-xs text-muted-foreground">
                These insights are generated by AI based on your recent campaign
                data and best practices.
              </div>
            </CardContent>
          </Card>
          <RecommendedActions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
