import React from 'react'
import { Button } from '@/components/ui/button'
import { storylyStyles, STORYLY_TOKENS } from '@/lib/storyly-design-system'
import { cn } from '@/lib/utils'

export function StorylyDesignShowcase() {
  return (
    <div className="storyly-main">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className={storylyStyles.heading(1)}>
            Storyly Design System Showcase
          </h1>
          <p className={storylyStyles.bodyText("base")}>
            Demonstrating the implementation of the extracted Storyly design tokens and components.
          </p>
        </div>

        {/* Color Palette */}
        <section className={storylyStyles.card()}>
          <h2 className={storylyStyles.heading(2) + " mb-6"}>Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Primary Colors */}
            <div>
              <h3 className={storylyStyles.heading(3) + " mb-4"}>Primary Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary"></div>
                  <div>
                    <div className="font-medium text-sm">Primary</div>
                    <div className={storylyStyles.captionText()}>#8B5CF6</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-hover"></div>
                  <div>
                    <div className="font-medium text-sm">Primary Hover</div>
                    <div className={storylyStyles.captionText()}>#7C3AED</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-light"></div>
                  <div>
                    <div className="font-medium text-sm">Primary Light</div>
                    <div className={storylyStyles.captionText()}>#EDE9FE</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gray Scale */}
            <div>
              <h3 className={storylyStyles.heading(3) + " mb-4"}>Gray Scale</h3>
              <div className="space-y-3">
                {(['900', '700', '500', '300', '100', '50'] as const).map((shade) => (
                  <div key={shade} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gray-${shade}`}></div>
                    <div>
                      <div className="font-medium text-sm">Gray {shade}</div>
                      <div className={storylyStyles.captionText()}>
                        {STORYLY_TOKENS.colors.gray[shade]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className={storylyStyles.heading(3) + " mb-4"}>Semantic Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success"></div>
                  <div>
                    <div className="font-medium text-sm">Success</div>
                    <div className={storylyStyles.captionText()}>#10B981</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning"></div>
                  <div>
                    <div className="font-medium text-sm">Warning</div>
                    <div className={storylyStyles.captionText()}>#F59E0B</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-error"></div>
                  <div>
                    <div className="font-medium text-sm">Error</div>
                    <div className={storylyStyles.captionText()}>#EF4444</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Button Variants */}
        <section className={storylyStyles.card()}>
          <h2 className={storylyStyles.heading(2) + " mb-6"}>Button Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Primary Buttons */}
            <div>
              <h3 className={storylyStyles.heading(3) + " mb-4"}>Primary Buttons</h3>
              <div className="space-y-3">
                <Button size="lg">Large Primary</Button>
                <Button>Default Primary</Button>
                <Button size="sm">Small Primary</Button>
                <Button disabled>Disabled Primary</Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className={storylyStyles.heading(3) + " mb-4"}>Secondary Buttons</h3>
              <div className="space-y-3">
                <Button variant="secondary" size="lg">Large Secondary</Button>
                <Button variant="secondary">Default Secondary</Button>
                <Button variant="secondary" size="sm">Small Secondary</Button>
                <Button variant="secondary" disabled>Disabled Secondary</Button>
              </div>
            </div>

            {/* Ghost Buttons */}
            <div>
              <h3 className={storylyStyles.heading(3) + " mb-4"}>Ghost Buttons</h3>
              <div className="space-y-3">
                <Button variant="ghost" size="lg">Large Ghost</Button>
                <Button variant="ghost">Default Ghost</Button>
                <Button variant="ghost" size="sm">Small Ghost</Button>
                <Button variant="ghost" disabled>Disabled Ghost</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Card Variants */}
        <section className={storylyStyles.card()}>
          <h2 className={storylyStyles.heading(2) + " mb-6"}>Card Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Default Card */}
            <div className={storylyStyles.card()}>
              <h3 className={storylyStyles.heading(3) + " mb-2"}>Default Card</h3>
              <p className={storylyStyles.bodyText()}>
                This is a standard card component with the Storyly design system styling.
              </p>
            </div>

            {/* Widget Card */}
            <div className={storylyStyles.card("widget")}>
              <h3 className={storylyStyles.heading(3) + " mb-2"}>Widget Card</h3>
              <p className={storylyStyles.bodyText()}>
                Interactive widget card with cursor pointer and minimum height.
              </p>
            </div>

            {/* Preview Card */}
            <div className={storylyStyles.card("preview")}>
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className={storylyStyles.captionText()}>16:9 Preview Area</p>
              </div>
            </div>
          </div>
        </section>

        {/* Badge Components */}
        <section className={storylyStyles.card()}>
          <h2 className={storylyStyles.heading(2) + " mb-6"}>Badge Components</h2>
          
          <div className="flex flex-wrap gap-4">
            <span className={storylyStyles.badge()}>Default Badge</span>
            <span className={storylyStyles.badge("success")}>Success Badge</span>
            <span className={storylyStyles.badge("warning")}>Warning Badge</span>
            <span className={storylyStyles.badge("purple")}>Purple Badge</span>
          </div>
        </section>

        {/* Form Components */}
        <section className={storylyStyles.card()}>
          <h2 className={storylyStyles.heading(2) + " mb-6"}>Form Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="Enter your email"
                className={storylyStyles.input()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input 
                type="text" 
                placeholder="Enter your name"
                className={storylyStyles.input()}
              />
            </div>
          </div>
        </section>

        {/* Typography Scale */}
        <section className={storylyStyles.card()}>
          <h2 className={storylyStyles.heading(2) + " mb-6"}>Typography Scale</h2>
          
          <div className="space-y-4">
            <h1 className={storylyStyles.heading(1)}>Heading 1 - Main Titles</h1>
            <h2 className={storylyStyles.heading(2)}>Heading 2 - Section Titles</h2>
            <h3 className={storylyStyles.heading(3)}>Heading 3 - Subsection Titles</h3>
            <p className={storylyStyles.bodyText("base")}>Body text (base) - Regular content with good readability</p>
            <p className={storylyStyles.bodyText()}>Body text (small) - Compact content for dense layouts</p>
            <p className={storylyStyles.captionText()}>Caption text - Supporting information and metadata</p>
          </div>
        </section>

        {/* Navigation Example */}
        <section className={storylyStyles.card()}>
          <h2 className={storylyStyles.heading(2) + " mb-6"}>Navigation Components</h2>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <nav className="space-y-1">
              <a href="#" className={storylyStyles.navItem(true)}>
                📊 Dashboard (Active)
              </a>
              <a href="#" className={storylyStyles.navItem()}>
                🎨 Widgets
              </a>
              <a href="#" className={storylyStyles.navItem()}>
                📍 Placements
              </a>
              <a href="#" className={storylyStyles.navItem()}>
                👥 Audience
              </a>
              <a href="#" className={storylyStyles.navItem()}>
                📈 Analytics
              </a>
            </nav>
          </div>
        </section>

      </div>
    </div>
  )
}