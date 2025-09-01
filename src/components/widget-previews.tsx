import React from 'react';

interface WidgetPreviewProps {
  widgetType: string;
  className?: string;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ widgetType, className = "" }) => {
  const baseClass = `w-full h-full rounded-lg overflow-hidden ${className}`;

  switch (widgetType) {
    case 'story-bar':
    case 'standalone-story-bar':
      return (
        <div className={`${baseClass} bg-black relative`}>
          {/* Story bar with circular profile images */}
          <div className="flex items-center justify-center h-full p-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'video-feed':
      return (
        <div className={`${baseClass} bg-gradient-to-br from-blue-100 to-green-100`}>
          {/* Video feed grid layout */}
          <div className="grid grid-cols-3 gap-1 p-2 h-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gradient-to-br from-blue-400 to-green-400 rounded-sm relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'banner':
      return (
        <div className={`${baseClass} bg-gradient-to-r from-orange-200 to-yellow-200`}>
          {/* Banner with text and button */}
          <div className="h-full flex flex-col justify-center items-center p-3">
            <div className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full mb-2 font-semibold">
              Big Sale is Coming
            </div>
            <div className="bg-orange-600 text-white text-xs px-2 py-1 rounded text-center">
              Shop now
            </div>
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-3 bg-white rounded-full opacity-60"></div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'carousel':
      return (
        <div className={`${baseClass} bg-gradient-to-br from-green-100 to-blue-100`}>
          {/* Carousel with multiple items */}
          <div className="h-full p-2 flex items-center">
            <div className="flex gap-1 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0">
                  <div className="w-8 h-12 bg-green-400 rounded-sm relative">
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="bg-white h-1 rounded-full mb-1"></div>
                      <div className="bg-white h-0.5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'swipe-card':
      return (
        <div className={`${baseClass} bg-gradient-to-br from-purple-100 to-pink-100`}>
          {/* Swipe card stack */}
          <div className="h-full flex items-center justify-center p-2 relative">
            {/* Background cards */}
            <div className="absolute inset-3 bg-purple-300 rounded-lg transform rotate-3"></div>
            <div className="absolute inset-2 bg-purple-400 rounded-lg transform -rotate-2"></div>
            {/* Front card */}
            <div className="w-full h-full bg-purple-500 rounded-lg relative flex flex-col justify-end p-2">
              <div className="absolute top-2 right-2 bg-purple-700 text-white text-xs px-1 py-0.5 rounded">
                ?
              </div>
              <div className="bg-yellow-400 text-xs px-2 py-1 rounded text-black font-semibold">
                What's your style?
              </div>
            </div>
          </div>
        </div>
      );

    case 'countdown':
      return (
        <div className={`${baseClass} bg-gradient-to-br from-red-100 to-pink-100`}>
          {/* Countdown timer */}
          <div className="h-full flex flex-col justify-center items-center p-2">
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mb-1 font-bold">
              02:14:35
            </div>
            <div className="text-xs text-red-600 font-medium">
              Time Left
            </div>
          </div>
        </div>
      );

    case 'canvas':
      return (
        <div className={`${baseClass} bg-gradient-to-br from-blue-50 to-indigo-100`}>
          {/* Canvas with interactive elements */}
          <div className="h-full p-2 relative">
            <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
              <div className="bg-blue-400 rounded-sm"></div>
              <div className="bg-blue-300 rounded-full"></div>
              <div className="bg-blue-300 rounded-full"></div>
              <div className="bg-blue-400 rounded-sm"></div>
            </div>
          </div>
        </div>
      );

    case 'quiz':
      return (
        <div className={`${baseClass} bg-gradient-to-br from-yellow-100 to-orange-100`}>
          {/* Quiz interface */}
          <div className="h-full flex flex-col justify-center p-2">
            <div className="bg-yellow-400 text-black text-xs px-2 py-1 rounded mb-2 font-semibold">
              What's your style?
            </div>
            <div className="space-y-1">
              <div className="bg-yellow-300 h-1 rounded-full"></div>
              <div className="bg-yellow-300 h-1 rounded-full"></div>
              <div className="bg-yellow-300 h-1 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`${baseClass} bg-gray-100 flex items-center justify-center`}>
          <div className="text-gray-400 text-xs">Preview</div>
        </div>
      );
  }
};

export default WidgetPreview;
