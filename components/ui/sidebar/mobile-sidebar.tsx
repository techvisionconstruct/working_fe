"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Avatar, 
  AvatarFallback, 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/shared";
import { ChevronLeft, ChevronDown, LogOut, Settings } from "lucide-react";
import { useUser } from "../../contexts/user-context";
import Cookie from "js-cookie";
import { useMediaQuery } from "@/hooks/use-media-query";
import { navItems, type NavSection, type NavItem } from "./sidebar-data";

export function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [avatarFallback, setAvatarFallback] = useState('');

  // Set avatar fallback only on client-side to prevent hydration mismatch
  useEffect(() => {
    if (user?.username) {
      setAvatarFallback(user.username[0].toUpperCase());
    }
  }, [user?.username]);

  // Listen for custom event to open sidebar from mobile header
  useEffect(() => {
    const handleOpenSidenav = () => setMobileOpen(true);
    window.addEventListener('open-sidenav', handleOpenSidenav);
    return () => window.removeEventListener('open-sidenav', handleOpenSidenav);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen || profileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, profileOpen]);

  useEffect(() => {
    const currentPath = pathname || "/dashboard";
    const allItems = navItems.flatMap(section => section.items);
    const active = allItems.find(item => currentPath.startsWith(item.href))?.label || "";
    setActiveItem(active);
  }, [pathname]);

  const handleLogout = () => {
    Cookie.remove("auth-token", { path: "/" });
    router.push("/signin");
  };

  // Only render on mobile (after all hooks)
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {mobileOpen && (
        <div className="fixed inset-0 z-[200]">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
          {/* Mobile Sidebar */}
          <motion.div
            className="absolute left-0 top-0 h-full w-[280px] bg-sidebar border-r border-sidebar-border shadow-lg z-10"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-sidebar-accent/30 hover:bg-sidebar-accent/50"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <ChevronLeft size={20} />
            </button>
            {/* Logo and title */}
            <div className="h-20 mb-6 flex items-center px-6 gap-3">
              <Image 
                src="/icons/logo.svg" 
                alt="Projex Logo" 
                width={40} 
                height={40}
                className="object-contain" 
              />
              <div>
                <div 
                  className="text-muted-foreground uppercase tracking-wide text-xs leading-none font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  SIMPLE
                </div>
                <div 
                  className="font-bold text-xl text-sidebar-foreground uppercase leading-tight tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.09rem' }}
                >
                  PROJEX
                </div>
              </div>
            </div>
            {/* Navigation items */}
            <nav className="flex-1 px-3 overflow-y-auto">
              {navItems.map((section) => (
                <div key={section.section} className="mb-4">
                  {section.items.map((item) => (
                    <Link 
                      href={item.href} 
                      key={item.label}
                      onClick={() => {
                        setActiveItem(item.label);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md mb-1 transition-colors",
                        pathname?.startsWith(item.href) 
                          ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
                          : "text-muted-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            {/* User profile */}
            {user && (
              <div className="mt-auto p-4 border-t border-sidebar-border">
                <button
                  className="w-full flex items-center gap-3 rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent/50 transition"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <div className="transition-all duration-300">
                    <Avatar className="h-9 w-9 ring-2 ring-background">
                      <AvatarFallback className="font-medium text-sidebar-foreground uppercase">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col ml-2" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    <div className="font-medium text-sm text-sidebar-foreground">
                      {user?.username || "User"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </div>
                  </div>
                </button>
                {/* Logout confirm dialog */}
                <AnimatePresence>
                  {showLogoutConfirm && (
                    <motion.div
                      className="fixed inset-0 z-[300] flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowLogoutConfirm(false)}
                      />
                      <motion.div
                        className="relative bg-white dark:bg-sidebar rounded-2xl shadow-2xl p-8 w-[90vw] max-w-[340px] flex flex-col items-center gap-4"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <div className="text-lg font-semibold text-sidebar-foreground mb-2">Log out?</div>
                        <div className="text-sm text-muted-foreground mb-4">Are you sure you want to log out?</div>
                        <button
                          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition-all text-base"
                          onClick={handleLogout}
                        >
                          <LogOut size={18} /> Log out
                        </button>
                        <button
                          className="mt-2 text-xs text-muted-foreground hover:underline"
                          onClick={() => setShowLogoutConfirm(false)}
                        >
                          Cancel
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
