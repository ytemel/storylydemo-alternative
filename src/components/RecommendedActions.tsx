import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { storylyStyles } from "@/lib/storyly-design-system";
import { useLocation } from "wouter";

const mockActions = [
  {
    id: "action-1",
    title: "Category Promotion Recipes",
    description: "Boost conversion with targeted promotional strategies",
    icon: "🧠",
    suggestions: [
      {
        title: "Create new Promotion recipe",
        description: "Set up targeted promotional campaigns",
        route: "/dashboard/recipes?template=promotion",
      },
      {
        title: "Review past Promotion performance",
        description: "Analyze existing campaign metrics",
        route: "/dashboard/analytics?widget=promotion",
      },
      {
        title: "Optimize category targeting",
        description: "Refine audience segmentation",
        route: "/dashboard/audience?focus=categories",
      },
    ],
  },
  {
    id: "action-2", 
    title: "Story Widget Content Review",
    description: "Enhance engagement with optimized story content",
    icon: "📚",
    suggestions: [
      {
        title: "Go to Story",
        description: "Manage story content",
        route: "/dashboard/story",
      },
      {
        title: "Update story widget creatives",
        description: "Refresh visual content and assets",
        route: "/dashboard/story",
      },
      {
        title: "Analyze content performance",
        description: "Deep dive into engagement metrics",
        route: "/dashboard/analytics?focus=content",
      },
    ],
  },
      {
        id: "action-3",
    title: "Stronger CTAs",
    description: "Increase Result Page Clicks with compelling calls-to-action", 
    icon: "🚀",
    suggestions: [
      {
        title: "Optimise CTA copy",
        description: "Improve button text and messaging",
          route: "/dashboard/recipes",
      },
      {
        title: "A/B test banners with strong CTAs",
        description: "Test different call-to-action variations",
        route: "/dashboard/recipes?abtest=cta",
      },
      {
        title: "Review conversion funnels",
        description: "Analyze click-through performance",
        route: "/dashboard/analytics?focus=conversion",
      },
    ],
  },
];

export default function RecommendedActions() {
  const [, setLocation] = useLocation();

  return (
    <div className="mt-6">
      <h3 className={cn(storylyStyles.heading(2), "mb-4")}>Recommended Actions</h3>
      <div className="space-y-6">
        {mockActions.map((action) => (
          <div key={action.id}>
            {/* Action Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light">
                <span className="text-xl">{action.icon}</span>
              </div>
              <div>
                <h4 className={storylyStyles.heading(3)}>{action.title}</h4>
                <p className={storylyStyles.bodyText()}>{action.description}</p>
              </div>
            </div>
            
            {/* Suggestion Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-13">
              {action.suggestions.map((suggestion, idx) => (
                <div key={idx} className={storylyStyles.card()}>
                  <div className="text-center">
                    <h5 className={cn(storylyStyles.heading(3), "text-sm mb-2")}>{suggestion.title}</h5>
                    <p className={cn(storylyStyles.captionText(), "mb-4")}>{suggestion.description}</p>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="w-full"
                      onClick={() => setLocation(suggestion.route)}
                    >
                      Try it
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 