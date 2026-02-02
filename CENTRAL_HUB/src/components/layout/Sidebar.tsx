"use client";

import { useState } from "react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation items will be added later

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } flex flex-col h-full`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 h-[73px] flex items-center">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary">Central Hub</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* Empty navigation - will be populated later */}
      <nav className="flex-1 p-4">
        {/* Sidebar content will be added later */}
      </nav>
    </aside>
  );
}
