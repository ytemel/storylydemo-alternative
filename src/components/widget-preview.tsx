import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { storylyStyles } from "@/lib/storyly-design-system";
import { Smartphone, Monitor } from "lucide-react";
import { useState } from "react";
import type { Widget } from "@/shared/schema";

interface WidgetPreviewProps {
  widget: Partial<Widget>;
  className?: string;
}

export default function WidgetPreview({
  widget,
  className,
}: WidgetPreviewProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  const getPreviewContent = () => {
    const { content, style, type } = widget;

    switch (type) {
      case "banner":
        return (
          <div
            className="rounded-lg p-4 text-center"
            style={{
              backgroundColor: style?.backgroundColor || "#6B46C1",
              color: style?.textColor || "#FFFFFF",
            }}
          >
            <h3 className="font-semibold mb-2">
              {content?.title || "Banner Title"}
            </h3>
            {content?.description && (
              <p className="text-sm mb-3">{content.description}</p>
            )}
            {content?.buttonText && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30"
              >
                {content.buttonText}
              </Button>
            )}
          </div>
        );

      case "story-bar":
        return (
          <div className="flex items-center justify-center space-x-2 p-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm">S1</span>
            </div>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">S2</span>
            </div>
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">S3</span>
            </div>
          </div>
        );

      case "video-feed":
        return (
          <div className="grid grid-cols-2 gap-2 p-4">
            <div className="aspect-video bg-primary rounded"></div>
            <div className="aspect-video bg-green-500 rounded"></div>
            <div className="aspect-video bg-yellow-500 rounded"></div>
            <div className="aspect-video bg-red-500 rounded"></div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            <p>Widget preview will appear here</p>
          </div>
        );
    }
  };

  return (
    <div className={cn(storylyStyles.card("preview"), className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={storylyStyles.heading(3)}>Preview</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "mobile" ? "default" : "secondary"}
            size="sm"
            onClick={() => setViewMode("mobile")}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
          <Button
            variant={viewMode === "desktop" ? "default" : "secondary"}
            size="sm"
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
        {viewMode === "mobile" ? (
          <div className="bg-white rounded-lg shadow-storyly-lg w-64 min-h-[200px]">
            {getPreviewContent()}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-storyly-lg w-full min-h-[200px]">
            {getPreviewContent()}
          </div>
        )}
      </div>
    </div>
  );
}
