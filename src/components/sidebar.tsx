import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { storylyStyles } from "@/lib/storyly-design-system";
import {
  LayoutDashboard,
  Puzzle,
  Wand2,
  BarChart3,
  Settings,
  Zap,
  User,
  ChevronRight,
  Users,
  Target,
  Video,
  Grid3X3,
  Image,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Widget } from "@/shared/schema";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Recipes", href: "/dashboard/recipes", icon: Wand2 },
  { name: "Placement", href: "/dashboard/placements", icon: Target },
  { name: "Audience", href: "/dashboard/audience", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const recipesSubItems = [
  { name: "Campaigns", href: "/dashboard/recipes" },
];

// Fixed widgets that are always visible
const fixedWidgetItems = [
  { name: "Widget Library", href: "/dashboard/widgets", icon: Grid3X3 },
  { name: "Story Bar", href: "/dashboard/story-bar", icon: Video },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  // Fetch created widgets to display in sidebar
  const { data: widgets = [] } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });
  
  // Get unique widget types from ALL created widgets (both widget only and recipe widgets)
  const createdWidgetTypes = Array.from(new Set(
    widgets
      .filter(widget => 
        widget.type !== 'story-bar' && // Exclude story-bar since it's shown as fixed item
        widget.type !== 'standalone-story-bar' && // Exclude standalone-story-bar since story-bar is fixed
        widget.status !== 'archived' // Exclude archived widgets
      )
      .map(widget => widget.type)
  ));

  return (
    <aside className={cn(storylyStyles.sidebar(), "flex flex-col h-screen fixed left-0 top-0")}>
      {/* Logo Section */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className={cn(storylyStyles.heading(3), "text-gray-900")}>
            storyly
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || 
              (item.href === '/dashboard/recipes' && location?.startsWith('/dashboard/recipes'));
            
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    storylyStyles.navItem(isActive),
                    "w-full justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.name === 'Recipes' && (
                      <ChevronRight size={16} className={cn(
                        "transition-transform duration-150",
                        location?.startsWith('/dashboard/recipes') && "rotate-90"
                      )} />
                    )}
                  </div>
                </Link>
                
                {/* Recipes Submenu */}
                {item.name === 'Recipes' && (location?.startsWith('/dashboard/recipes')) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {recipesSubItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm",
                          "text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-150"
                        )}
                      >
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
        
        {/* Widget Library Section */}
        <div className="mt-6 space-y-1">
          {/* Widget Library Header */}
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Widget Library
            </h3>
          </div>
          
          {/* Fixed Widget Items */}
          {fixedWidgetItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm mx-4",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-150"
                )}
              >
                <Icon size={16} className="shrink-0" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          {/* Created Widget Types */}
          {createdWidgetTypes.map((widgetType) => {
            const widgetTypeHref = `/dashboard/widgets/type/${widgetType}`;
            const isActive = location === widgetTypeHref;
            
            // Get appropriate icon for widget type
            const getWidgetTypeIcon = (type: string) => {
              switch (type) {
                case 'video-feed': return Video;
                case 'banner': return Image;
                case 'swipe-card': return Grid3X3;
                case 'canvas': return Grid3X3;
                case 'quiz': return Grid3X3;
                case 'countdown': return Grid3X3;
                default: return Video;
              }
            };
            
            const Icon = getWidgetTypeIcon(widgetType);
            const displayName = widgetType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return (
              <Link
                key={widgetType}
                href={widgetTypeHref}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm mx-4",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-150"
                )}
              >
                <Icon size={16} className="shrink-0" />
                <span className="font-medium truncate">{displayName}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section - Moved to bottom */}
      <div className="mt-auto px-4 pb-6">
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                Levent Oral
              </div>
              <div className={cn(storylyStyles.captionText(), "truncate")}>
                levent@storyly.io
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
