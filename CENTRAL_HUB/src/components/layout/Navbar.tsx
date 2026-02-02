"use client";

import { useState } from "react";

export default function Navbar() {
  const [language, setLanguage] = useState("EN");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 h-[73px] flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Search bar */}
        <div className="flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Search resources..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer bg-white"
            >
              <option value="EN">EN</option>
              <option value="RO">RO</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
