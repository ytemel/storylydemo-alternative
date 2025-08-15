import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Widget } from "@/shared/schema";

interface WidgetDetailsDrawerProps {
  widget: Widget;
  open: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export default function WidgetDetailsDrawer({
  widget,
  open,
  onClose,
  onDelete,
}: WidgetDetailsDrawerProps) {
  const [name, setName] = useState(widget.name);
  const [shareable, setShareable] = useState(false);
  const [smartSorting, setSmartSorting] = useState(false);

  // Placeholder for theme options
  const [theme, setTheme] = useState("current");

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <DrawerHeader className="flex flex-row items-center justify-between p-4 border-b">
          <DrawerTitle>Story bar details</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Widget Preview */}
          <div className="flex flex-col items-center space-y-2">
            {/* Replace with actual widget preview if available */}
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className="w-14 h-14 bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-gray-200"
                >
                  <span className="text-xs text-muted-foreground">
                    Story group title
                  </span>
                  {i === 1 && (
                    <span className="text-xs text-red-500 font-bold absolute top-1 right-1">
                      ★
                    </span>
                  )}
                  {i === 2 && (
                    <span className="text-xs text-white bg-red-500 rounded px-1 absolute bottom-1">
                      12:01:24
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge
                variant={theme === "current" ? "default" : "secondary"}
                onClick={() => setTheme("current")}
              >
                Current theme
              </Badge>
              <Badge
                variant={theme === "classic" ? "default" : "secondary"}
                onClick={() => setTheme("classic")}
              >
                Classic Layout
              </Badge>
            </div>
          </div>
          {/* Widget Name */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Widget name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-xs">Shareable story</div>
                <div className="text-xs text-muted-foreground">
                  Enable users to share stories.
                </div>
              </div>
              <Switch checked={shareable} onCheckedChange={setShareable} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-xs">Smart Sorting</div>
                <div className="text-xs text-muted-foreground">
                  Automatically orders your Story Groups based on their
                  performance.
                </div>
              </div>
              <Switch
                checked={smartSorting}
                onCheckedChange={setSmartSorting}
              />
            </div>
          </div>
          {/* Delete */}
          <div className="mt-8">
            <div className="text-xs text-muted-foreground mb-2">Delete</div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(widget.id)}
            >
              Delete widget
            </Button>
            <div className="text-xs text-muted-foreground mt-1">
              Permanently delete your widget and all its content. This action
              cannot be undone.
            </div>
          </div>
        </div>
        <DrawerFooter className="flex flex-row items-center justify-end gap-2 border-t p-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default">Update</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
