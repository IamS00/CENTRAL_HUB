"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/auth/UserMenu";
import AuthModal from "@/components/auth/AuthModal";

export default function Navbar() {
  const [language, setLanguage] = useState("EN");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const pathname = usePathname();

  const handleLoginClick = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthMode("register");
    setIsAuthModalOpen(true);
  };

  // Get current route for display
  const getCurrentRoute = () => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/admin")) return "Admin";
    if (pathname.startsWith("/resources")) return "Resources";
    if (pathname.startsWith("/categories")) return "Categories";
    if (pathname.startsWith("/favorites")) return "Favorites";
    return pathname.split("/").filter(Boolean).join(" / ");
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 h-[73px] flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Left section - Current Route */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {getCurrentRoute()}
            </h1>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
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

            {/* User Menu */}
            <UserMenu
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
            />
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </>
  );
}
