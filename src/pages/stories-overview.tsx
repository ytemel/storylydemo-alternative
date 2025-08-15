import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function StoriesOverview() {
  return (
    <div className="animate-fade-in">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Overview</h1>
            <p className="text-muted-foreground">Set up your collections and create shoppable experiences</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold">Add Your Product Feed</h2>
              <p className="text-sm text-muted-foreground">Set up your collections and create shoppable experiences</p>
            </div>
            <div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Add product feed →</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Widgets</Badge>
              <span className="text-muted-foreground text-sm">1</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 text-xs text-muted-foreground mb-2">
              <div>Widgets</div>
              <div className="text-center">Avg. Engagement Rate</div>
              <div className="text-center">Avg. CTR</div>
              <div className="text-center">Avg. Response Rate</div>
            </div>
            <Separator />
            <div className="grid grid-cols-4 items-center py-3">
              <div>
                <div className="w-2 h-2 bg-purple-500 rounded-full inline-block mr-2" />
                <span className="text-sm font-medium">Product Detail</span>
                <div className="text-[11px] text-muted-foreground">My Second Beautiful App</div>
              </div>
              <div className="text-center text-sm">-</div>
              <div className="text-center text-sm">-</div>
              <div className="text-center text-sm">-</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


