import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AudienceSegment } from "@/shared/schema";

export default function Audience() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: segments = [], isLoading } = useQuery<AudienceSegment[]>({
    queryKey: ["/api/audience-segments"],
  });

  // Mock data to match the screenshot exactly
  const mockAudiences = [
    {
      id: 1,
      name: "YT_test1",
      type: "BLOOMREACH",
      audience: "Processing...",
      fields: 0,
      lastUpdated: "14.07.2025 11:54",
      integration: "integration",
    },
    {
      id: 2,
      name: "yt test 2",
      type: "BLOOMREACH",
      audience: "Processing...",
      fields: 0,
      lastUpdated: "14.07.2025 13:06",
      integration: "integration",
    },
    {
      id: 3,
      name: "yt test 3",
      type: "BLOOMREACH",
      audience: "Processing...",
      fields: 2,
      lastUpdated: "14.07.2025 13:33",
      integration: "integration",
    },
    {
      id: 4,
      name: "gg",
      type: "CLEVERTAP",
      audience: "0",
      fields: 0,
      lastUpdated: "16.07.2025 11:36",
      integration: "integration",
    },
  ];

  const filteredAudiences = mockAudiences.filter((audience) =>
    audience.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAudiences = [...filteredAudiences].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BLOOMREACH":
        return "bg-teal-100 text-teal-800";
      case "CLEVERTAP":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
    </TableHead>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Audiences</h1>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Audience
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="type">Type</SortableHeader>
              <SortableHeader field="audience">Audience</SortableHeader>
              <SortableHeader field="fields">Fields</SortableHeader>
              <SortableHeader field="lastUpdated">Last updated</SortableHeader>
              <TableHead>Integration</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-pulse">Loading audiences...</div>
                </TableCell>
              </TableRow>
            ) : sortedAudiences.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No audiences found
                </TableCell>
              </TableRow>
            ) : (
              sortedAudiences.map((audience) => (
                <TableRow key={audience.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{audience.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium ${getTypeColor(
                        audience.type
                      )}`}
                    >
                      {audience.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {audience.audience}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{audience.fields}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {audience.lastUpdated}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-purple-600 cursor-pointer hover:underline">
                      {audience.integration}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
