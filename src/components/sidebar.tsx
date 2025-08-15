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
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Recipes", href: "/dashboard/recipes", icon: Wand2 },
  { name: "Stories", href: "/dashboard/stories/overview", icon: Puzzle },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, badge: "New" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const recipesSubItems = [
  { name: "Recipe Studio", href: "/dashboard/recipes" },
  { name: "Widgets", href: "/dashboard/recipes/widgets" },
];

const storiesSubItems = [
  { name: "Overview", href: "/dashboard/stories/overview" },
  { name: "Content", href: "/dashboard/stories/content" },
];

export default function Sidebar() {
  const [location] = useLocation();

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
              (item.href === '/dashboard' && location === '/') ||
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
                    {item.badge && (
                      <span className={cn(
                        storylyStyles.badge(item.badge === 'New' ? 'purple' : 'default'),
                        "text-xs px-2 py-0.5"
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {(item.name === 'Recipes' || item.name === 'Stories') && (
                      <ChevronRight size={16} className={cn(
                        "transition-transform duration-150",
                        ((location?.startsWith('/dashboard/recipes') && item.name === 'Recipes')
                          || (location?.startsWith('/dashboard/stories') && item.name === 'Stories')) && "rotate-90"
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

                {/* Stories Submenu */}
                {item.name === 'Stories' && (location?.startsWith('/dashboard/stories')) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {storiesSubItems.map((subItem) => (
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
