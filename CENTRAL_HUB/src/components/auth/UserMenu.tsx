"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, LogIn, LogOut, UserPlus, Shield } from "lucide-react";

interface UserMenuProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

export default function UserMenu({ onLoginClick, onRegisterClick }: UserMenuProps) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* User Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="User menu"
            >
                <User className="w-5 h-5 text-gray-700" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        {session ? (
                            <>
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">
                                        {session.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {session.user?.email}
                                    </p>
                                    {(session.user as any)?.role === "ADMIN" && (
                                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                            <Shield className="w-3 h-3" />
                                            Admin
                                        </div>
                                    )}
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Not Logged In */}
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            onLoginClick();
                                            setIsOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            onRegisterClick();
                                            setIsOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Register
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
