import React, { useState } from 'react'
import { storylyStyles } from '@/lib/storyly-design-system'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Puzzle, 
  MapPin, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Bell,
  User,
  ChevronRight,
  Palette,
  Layers,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SidebarShowcase() {
  const [activeItem, setActiveItem] = useState('widgets')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'recipes', label: 'Recipes', icon: Puzzle, badge: null },
    { id: 'story', label: 'Story', icon: Layers, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'New' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ]

  const widgetSubItems = [
    { id: 'story-bar', label: 'Story Bar', icon: Layers },
    { id: 'banner', label: 'Banner', icon: Palette },
    { id: 'video-feed', label: 'Video Feed', icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Storyly Sidebar */}
      <div className={storylyStyles.sidebar()}>
        
        {/* Logo Section */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className={cn(storylyStyles.heading(3), "text-gray-900")}>
              storyly
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              const isHovered = hoveredItem === item.id
              
              return (
                <div key={item.id}>
                  <button
                    onClick={() => setActiveItem(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      storylyStyles.navItem(isActive),
                      "w-full justify-between"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="shrink-0" />
                      <span className="font-medium">{item.label}</span>
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
                      {item.id === 'widgets' && (
                        <ChevronRight size={16} className={cn(
                          "transition-transform duration-150",
                          isActive && "rotate-90"
                        )} />
                      )}
                    </div>
                  </button>
                  
                  {/* Widget Submenu */}
                  {item.id === 'widgets' && isActive && (
                    <div className="ml-6 mt-1 space-y-1">
                      {widgetSubItems.map((subItem) => {
                        const SubIcon = subItem.icon
                        return (
                          <button
                            key={subItem.id}
                            className={cn(
                              "flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm",
                              "text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-150"
                            )}
                          >
                            <SubIcon size={16} className="shrink-0" />
                            <span>{subItem.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Widget Section */}
        <div className="px-4 mt-8">
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className={cn(storylyStyles.captionText(), "uppercase tracking-wider font-semibold")}>
                Widget
              </span>
            </div>
            
            <div className="space-y-1">
              <button className={cn(
                storylyStyles.navItem(),
                "w-full"
              )}>
                <Layers size={20} />
                <span className="font-medium">Story Bar</span>
                <ChevronRight size={16} />
              </button>
              
              <button className={cn(
                storylyStyles.navItem(),
                "w-full"
              )}>
                <Palette size={20} />
                <span className="font-medium">Banner</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-4 pb-6">
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className={storylyStyles.header()}>
          <div className="flex items-center justify-between w-full">
            
            {/* Breadcrumb */}
            <div>
              <h1 className={storylyStyles.heading(2)}>
                Widgets
              </h1>
              <p className={storylyStyles.captionText()}>
                Manage your story widgets and placements
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search widgets..."
                  className={cn(storylyStyles.input(), "pl-10 w-64")}
                />
              </div>
              
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
              </button>
              
              <Button className="btn-primary">
                <Plus size={16} />
                Create new
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={storylyStyles.mainContent()}>
          <div className="max-w-6xl mx-auto">
            
            {/* Widget Types Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Story Bar Widget */}
              <div className={storylyStyles.card("widget")}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                    <Layers size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className={storylyStyles.heading(3)}>Story bar</h3>
                    <p className={storylyStyles.captionText()}>Interactive story carousel</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex gap-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-12 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"></div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={storylyStyles.badge("default")}>Not applied yet</span>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </div>
              </div>

              {/* Video Feed Widget */}
              <div className={storylyStyles.card("widget")}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className={storylyStyles.heading(3)}>Video feed</h3>
                    <p className={storylyStyles.captionText()}>Scrollable video content</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4 aspect-video">
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="bg-gradient-to-br from-blue-400 to-green-400 rounded"></div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={storylyStyles.badge("success")}>Applied on 2 placements</span>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </div>
              </div>

              {/* Banner Widget */}
              <div className={storylyStyles.card("widget")}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Palette size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className={storylyStyles.heading(3)}>Banner</h3>
                    <p className={storylyStyles.captionText()}>Promotional banner display</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="w-full h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">Big Sale is Coming</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={storylyStyles.badge("default")}>Not applied yet</span>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </div>

            {/* Design System Info */}
            <div className={storylyStyles.card()}>
              <h2 className={storylyStyles.heading(2) + " mb-4"}>
                Storyly Design System - Sidebar Implementation
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={storylyStyles.heading(3) + " mb-3"}>Navigation Features</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>240px</strong> fixed width sidebar</li>
                    <li>• <strong>Purple accent</strong> for active states (#8B5CF6)</li>
                    <li>• <strong>Smooth transitions</strong> (150ms ease-in-out)</li>
                    <li>• <strong>Hover feedback</strong> with gray backgrounds</li>
                    <li>• <strong>Icon + text</strong> layout with badges</li>
                    <li>• <strong>Collapsible submenus</strong> for widgets</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className={storylyStyles.heading(3) + " mb-3"}>Styling Details</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>White background</strong> with subtle border</li>
                    <li>• <strong>12px padding</strong> on navigation items</li>
                    <li>• <strong>8px border radius</strong> for interactive elements</li>
                    <li>• <strong>Gray 500</strong> default text color</li>
                    <li>• <strong>Purple light</strong> background for active items</li>
                    <li>• <strong>User profile</strong> section at bottom</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}