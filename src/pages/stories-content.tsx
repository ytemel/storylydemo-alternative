import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StoriesContent() {
  return (
    <div className="animate-fade-in">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content</h1>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">New Story Group</Button>
        </div>
      </header>

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gray-200 rounded" />
                <div className="text-sm">Product Detail</div>
              </div>
              <Badge variant="secondary">All (1)</Badge>
              <Badge>Active (1)</Badge>
              <Badge variant="outline">Inactive</Badge>
              <Badge variant="outline">Test</Badge>
              <Badge variant="outline">Archived</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 text-xs text-muted-foreground mb-3">
              <div>Story Group</div>
              <div>Status</div>
              <div>Audience</div>
              <div>Stories</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="border rounded-lg p-3 flex items-center">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-5 h-5 rounded-full border" />
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="text-sm font-medium">My Third Story Group</div>
              </div>
              <div className="w-24 text-sm">On</div>
              <div className="w-32 text-sm">None</div>
              <div className="w-32 flex gap-2">
                <div className="w-8 h-14 bg-gray-200 rounded" />
                <div className="w-8 h-14 bg-gray-200 rounded" />
                <div className="w-8 h-14 bg-gray-200 rounded" />
              </div>
              <div className="ml-auto">
                <Button variant="ghost">⋯</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


