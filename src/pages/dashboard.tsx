import { useLocation } from "wouter";
import { storylyStyles } from "@/lib/storyly-design-system";
import Sidebar from "@/components/sidebar";
import Overview from "./overview";
import Widgets from "./widgets";
import Recipes from "./recipes";
import Story from "./story";
import StoriesOverview from "./stories-overview";
import StoriesContent from "./stories-content";
import Analytics from "./analytics";
import Settings from "./settings";
import Placements from "./placements";
import Audience from "./audience";
import StoryBar from "./story-bar";
import WidgetType from "./widget-type";
import RecipeCatalogue from "./recipe-catalogue";
import WidgetDetail from "./widget-detail";

export default function Dashboard() {
  console.log("Dashboard component rendering...");
  const [location] = useLocation();
  console.log("Current location:", location);

  // Determine which component to render based on the path
  const renderComponent = () => {
    if (location === "/" || location === "/dashboard") {
      return <Overview />;
    } else if (location === "/dashboard/widgets") {
      return <Widgets />;
    } else if (location?.startsWith("/dashboard/widgets/type/")) {
      return <WidgetType />;
    } else if (location?.match(/^\/dashboard\/widgets\/\d+$/)) {
      return <WidgetDetail />;
    } else if (location === "/dashboard/recipes") {
      return <Recipes />;
    } else if (location === "/dashboard/recipes/catalogue") {
      return <RecipeCatalogue />;
    } else if (location === "/dashboard/recipes/widgets") {
      return <Widgets />;
    } else if (location === "/dashboard/placements") {
      return <Placements />;
    } else if (location === "/dashboard/audience") {
      return <Audience />;
    } else if (location === "/dashboard/story-bar") {
      return <StoryBar />;
    } else if (location === "/dashboard/story") {
      return <Story />;
    } else if (location === "/dashboard/stories/overview") {
      return <StoriesOverview />;
    } else if (location === "/dashboard/stories/content") {
      return <StoriesContent />;
    } else if (location === "/dashboard/analytics") {
      return <Analytics />;
    } else if (location === "/dashboard/settings") {
      return <Settings />;
    } else {
      return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1" style={{ marginLeft: '250px' }}>
        <div className={storylyStyles.mainContent()}>
          {renderComponent()}
        </div>
      </main>
    </div>
  );
}
