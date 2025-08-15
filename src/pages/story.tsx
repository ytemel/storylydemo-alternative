import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Story() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="animate-fade-in">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Story</h1>
            <p className="text-muted-foreground">
              Manage story widget content independently from Recipes
            </p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Story Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Campaign Story" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Story Type</Badge>
              <Badge variant="outline">Independent</Badge>
            </div>
            <div className="flex gap-2">
              <Button>Save</Button>
              <Button variant="outline">Preview</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


