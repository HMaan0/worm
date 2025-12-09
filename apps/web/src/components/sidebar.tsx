"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  FileText,
  GraduationCap,
  Phone,
  Users,
  MessageSquare,
  Megaphone,
  CreditCard,
  Users2,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Setup", href: "/setup", icon: Settings },
  { label: "Instructions", href: "/instructions", icon: FileText },
  { label: "Training", href: "/training", icon: GraduationCap },
  { label: "Phone Number", href: "/phone-number", icon: Phone },
  { label: "Contacts", href: "/contacts", icon: Users },
  { label: "Conversations", href: "/conversations", icon: MessageSquare },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

function NavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href as any}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
        isActive
          ? "bg-teal-50 text-teal-700"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <Icon className="size-5" />
      <span className="text-sm font-medium">{item.label}</span>
    </Link>
  );
}

function NavItemMobile({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href as any}
      className={cn(
        "flex items-center justify-center p-3 rounded-lg transition-colors",
        isActive
          ? "bg-teal-50 text-teal-700"
          : "text-gray-700 hover:bg-gray-100"
      )}
      title={item.label}
    >
      <Icon className="size-6" />
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full w-64 bg-transparent ">
        {/* Featherworth Branding */}
        <div className="px-6 py-6 border-gray-200">
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg">
            <Image
              src="https://wallpapers.com/images/hd/animated-robin-teen-titans-avatar-8uu9xxf8z18i12fp.jpg"
              alt="Featherworth"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="text-lg font-semibold text-gray-900 ">
              Featherworth
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Heads Up Box */}
        <div className="px-4 pb-4">
          <Alert variant="warning" className="mb-4">
            <AlertTitle className="text-amber-900">Heads Up!</AlertTitle>
            <AlertDescription className="text-amber-800 mb-3">
              You'll need to start a plan before you choose a dedicated phone
              number
            </AlertDescription>
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              Choose Plan
            </Button>
          </Alert>
        </div>

        {/* Sign Out */}
        <div className="px-4 pb-6  border-gray-200 pt-4">
          <button
            onClick={() => {
              // Handle sign out
              console.log("Sign out clicked");
            }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors w-full text-left"
          >
            <ArrowLeft className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
        <nav className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => (
            <NavItemMobile
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </>
  );
}
