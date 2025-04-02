"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/avatar";
import { 
  Home, 
  FileText, 
  Layers, 
  File, 
  FlaskConical, 
  Variable, 
  Calculator,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Group navigation items by section with Lucide icons
const navItems = [
  // Main section
  {
    section: "main",
    items: [
      { 
        icon: Home, 
        label: "Dashboard", 
        href: "/dashboard" 
      },
    ]
  },
  // Primary content section
  {
    section: "primary",
    items: [
      { 
        icon: File, 
        label: "Templates", 
        href: "/templates" 
      },
      { 
        icon: Layers, 
        label: "Proposals", 
        href: "/proposals" 
      },
      { 
        icon: FileText, 
        label: "Contracts", 
        href: "/contracts" 
      },
    ]
  },
  // Utility section
  {
    section: "utility",
    items: [
      { 
        icon: Variable, 
        label: "Variables", 
        href: "/variables" 
      },
      { 
        icon: Calculator, 
        label: "Categories", 
        href: "/categories" 
      },
      { 
        icon: FlaskConical, 
        label: "Elements", 
        href: "/elements" 
      },
    ]
  }
];

export function Sidenav() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Fixed type issue by making item string | null instead of just null
  const [tooltipPosition, setTooltipPosition] = useState({ 
    top: 0, 
    item: null as string | null,
    // Store window height to check if tooltip is near bottom
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 0 
  });
  
  // Ref for the nav container to get positions
  const navRef = useRef<HTMLDivElement>(null);

  // Update window height on resize
  useEffect(() => {
    const handleResize = () => {
      setTooltipPosition(prev => ({
        ...prev,
        windowHeight: window.innerHeight
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set active item based on current route
  useEffect(() => {
    const currentPath = pathname || "/dashboard";
    
    // Find the active item from all sections
    const allItems = navItems.flatMap(section => section.items);
    const active = allItems.find(item => currentPath.startsWith(item.href))?.label || "Dashboard";
    
    setActiveItem(active);
  }, [pathname]);

  // Animation variants for sidebar container with morphing effect
  const sidebarVariants = {
    expanded: { 
      width: "16rem", // 256px
      borderRadius: "16px",
      transition: { 
        width: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }, // Bouncy easing
        borderRadius: { duration: 0.3 }
      }
    },
    collapsed: { 
      width: "5rem", // 80px
      borderRadius: "16px",
      transition: { 
        width: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }, // Bouncy easing
        borderRadius: { duration: 0.3, delay: 0.1 }
      }
    }
  };

  // Logo container variants
  const logoContainerVariants = {
    expanded: { 
      justifyContent: "flex-start",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    collapsed: { 
      justifyContent: "center",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // Improved text animation variants to prevent clipping
  const textVariants = {
    expanded: { 
      opacity: 1, 
      width: "auto",
      height: "auto",
      marginLeft: "4px",
      display: "flex",
      flexDirection: "column" as const,
      transition: { 
        opacity: { duration: 0.3, delay: 0.1 },
        width: { duration: 0.3 },
        height: { duration: 0.3 }
      }
    },
    collapsed: { 
      opacity: 0,
      width: 0,
      height: 0,
      marginLeft: 0,
      display: "flex",
      flexDirection: "column" as const,
      transition: { 
        opacity: { duration: 0.2 },
        width: { duration: 0.3, delay: 0.05 },
        height: { duration: 0.3, delay: 0.05 }
      }
    }
  };

  // Update tooltip position when hovering an item
  const handleItemHover = (item: string, e: React.MouseEvent) => {
    if (!isCollapsed) return;
    
    // Get the target element
    const targetElement = e.currentTarget;
    const rect = targetElement.getBoundingClientRect();
    
    // Set the tooltip position to match the hovered item's position
    setTooltipPosition({ 
      top: rect.top + (rect.height / 2),
      item: item,
      windowHeight: window.innerHeight
    });
    setHoverItem(item);
  };

  // Handle logo hover
  const handleLogoHover = (isHovering: boolean, e?: React.MouseEvent) => {
    if (!isCollapsed) return;
    
    if (isHovering && e) {  // Only proceed if we have the event
      const targetElement = e.currentTarget;
      const rect = targetElement.getBoundingClientRect();
      setTooltipPosition({ 
        top: rect.top + (rect.height / 2),
        item: "logo",
        windowHeight: window.innerHeight
      });
      setHoverItem("logo");
    } else {
      setHoverItem(null);
    }
  };

  // Handle profile hover
  const handleProfileHover = (isHovering: boolean, e?: React.MouseEvent) => {
    if (!isCollapsed) return;
    
    if (isHovering && e) {  // Only proceed if we have the event
      const targetElement = e.currentTarget;
      const rect = targetElement.getBoundingClientRect();
      setTooltipPosition({ 
        top: rect.top + (rect.height / 2),
        item: "profile",
        windowHeight: window.innerHeight
      });
      setHoverItem("profile");
    } else {
      setHoverItem(null);
    }
  };

  // Determine if tooltip should be shown above for profile (near bottom of screen)
  const isProfileTooltipNearBottom = 
    hoverItem === "profile" && 
    tooltipPosition.top > tooltipPosition.windowHeight - 100; // 100px threshold

  return (
    <div className="relative h-screen" ref={navRef}>
      <motion.div 
        className="h-screen bg-sidebar flex flex-col py-6 border-r border-sidebar-border shadow-sm relative overflow-hidden"
        variants={sidebarVariants}
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
      >
        {/* Logo and brand section with fixed layout */}
        <motion.div 
          className="flex items-center mb-12 px-2"
          variants={logoContainerVariants}
          initial="expanded"
          animate={isCollapsed ? "collapsed" : "expanded"}
        >
          <div 
            className="flex-shrink-0"
            onMouseEnter={(e) => handleLogoHover(true, e)}
            onMouseLeave={() => handleLogoHover(false)}
          >
            <motion.div
              animate={{
                scale: isCollapsed ? 0.8 : 1
              }}
              transition={{
                scale: { duration: 0.3 }
              }}
            >
              <Image 
                src="/icons/logo.svg" 
                alt="Projex Logo" 
                width={56} 
                height={56} 
                className="object-contain"
              />
            </motion.div>
          </div>
          
          {/* Fixed SIMPLE PROJEX layout with adjusted spacing */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div 
                className="flex flex-col overflow-visible"
                variants={textVariants}
                initial={false}
                animate="expanded"
                exit="collapsed"
                style={{ 
                  willChange: "transform, opacity",
                  transformOrigin: "left",
                  minWidth: "120px" // Ensures enough space for the text
                }}
              >
                <div 
                  style={{ 
                    fontFamily: "'DM Sans', sans-serif", 
                    fontSize: "8pt",
                    letterSpacing: "0",
                    lineHeight: 0.9
                  }} 
                  className="text-muted-foreground uppercase tracking-wide mb-0.5" // Added a slight spacing
                >
                  SIMPLE
                </div>
                <div 
                  style={{ 
                    fontFamily: "'DM Sans', sans-serif", 
                    fontSize: "22pt", 
                    letterSpacing: "0.09rem",
                    lineHeight: "0.85"
                  }} 
                  className="font-bold text-sidebar-foreground uppercase"
                >
                  PROJEX
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Navigation items by section */}
        <nav className="flex-1 flex flex-col px-2 overflow-y-auto">
          {navItems.map((section, index) => (
            <motion.div 
              key={section.section} 
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: index * 0.1,
                  duration: 0.3
                }
              }}
            >
              {section.items.map((item) => (
                <NavItem 
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={activeItem === item.label}
                  isHovered={hoverItem === item.label}
                  isCollapsed={isCollapsed}
                  onHover={(e) => handleItemHover(item.label, e)}
                  onLeave={() => setHoverItem(null)}
                  onClick={() => setActiveItem(item.label)}
                />
              ))}
              {/* Add divider after sections (except the last one) */}
              {index < navItems.length - 1 && (
                <motion.div 
                  className="my-3 border-b border-sidebar-border mx-2"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          ))}
        </nav>
        
        {/* User profile section - Fixed alignment when collapsed */}
        <motion.div 
          className="mt-auto pt-4 border-t border-sidebar-border px-2"
          variants={logoContainerVariants}
          initial="expanded"
          animate={isCollapsed ? "collapsed" : "expanded"}
        >
          <motion.div 
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : ""
            )}
            whileHover={{ x: isCollapsed ? 0 : 2 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="relative"
              onMouseEnter={(e) => handleProfileHover(true, e)}
              onMouseLeave={() => handleProfileHover(false)}
            >
              <motion.div
                animate={{
                  scale: isCollapsed ? 0.9 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className={cn("ring-2 ring-sidebar-ring/20", isCollapsed ? "h-8 w-8" : "h-9 w-9")}>
                  <AvatarImage src="https://github.com/Rejhinald.png" alt="User" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
            
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div 
                  style={{ 
                    fontFamily: "'Open Sans', sans-serif", 
                    willChange: "transform, opacity",
                    minWidth: "80px" // Ensures enough space for the text
                  }}
                  className="flex flex-col justify-center overflow-visible ml-3"
                  variants={textVariants}
                  initial={false}
                  animate="expanded"
                  exit="collapsed"
                >
                  <div className="font-medium text-sm text-sidebar-foreground">Rejhinald</div>
                  <div className="text-xs text-muted-foreground">
                    Admin
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Toggle button - Properly positioned at the middle right edge */}
      <motion.button
        className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-8 h-8 bg-sidebar border-2 border-sidebar-border rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-sidebar-accent"
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        animate={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
        }}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? 
          <ChevronRight size={16} className="text-sidebar-foreground" /> : 
          <ChevronLeft size={16} className="text-sidebar-foreground" />
        }
      </motion.button>
      
      {/* Tooltip positioned OUTSIDE the sidebar - Like the toggle button */}
      <AnimatePresence>
        {isCollapsed && hoverItem && (
          <motion.div
            className="fixed z-[100] px-3 py-1.5 bg-popover text-popover-foreground rounded-md shadow-md whitespace-nowrap"
            style={{ 
              left: 'calc(5rem + 8px)', // Position to the right of collapsed sidebar
              // For profile near bottom, position tooltip above instead of centered
              top: isProfileTooltipNearBottom ? tooltipPosition.top - 40 : tooltipPosition.top,
              transform: isProfileTooltipNearBottom ? 'translateY(-100%)' : 'translateY(-50%)',
            }}
            initial={{ opacity: 0, x: -5, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Arrow positioning based on tooltip placement */}
            <div 
              className={cn(
                "absolute w-2 h-2 bg-popover rotate-45",
                isProfileTooltipNearBottom ? "-bottom-1 left-3" : "-left-1 top-1/2 -mt-1"
              )} 
            />
            
            {/* Different tooltip content based on hovered item */}
            <div className="relative z-10">
              {hoverItem === "logo" && (
                <span className="font-medium">Simple Projex</span>
              )}
              
              {hoverItem === "profile" && (
                <>
                  <div className="font-medium">Rejhinald</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </>
              )}
              
              {hoverItem !== "logo" && hoverItem !== "profile" && (
                <span className="font-medium">{hoverItem}</span>
                // Removed the circle indicator here
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Navigation item component with enhanced tooltip and morphing animations
function NavItem({ 
  icon: Icon, 
  label, 
  href, 
  isActive, 
  isHovered,
  isCollapsed,
  onHover,
  onLeave,
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  href: string; 
  isActive: boolean; 
  isHovered: boolean;
  isCollapsed: boolean;
  onHover: (e: React.MouseEvent) => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="block relative">
      <motion.div
        className={cn(
          "flex items-center gap-3 py-2.5 rounded-[30px] relative",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "justify-center px-2" : "px-3",
          isActive ? "font-bold bg-sidebar-accent" : ""
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: "var(--sidebar-accent)",
          transition: { duration: 0.2, ease: "easeInOut" }
        }}
        animate={{
          backgroundColor: isActive ? "var(--sidebar-accent)" : "transparent",
        }}
        transition={{
          duration: 0.2,
          backgroundColor: { duration: 0.15 }
        }}
      >
        {/* Fixed icon container with persisted rendering to prevent flickering */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          <motion.div
            initial={false}
            animate={{ 
              scale: isActive || isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
              opacity: 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10,
              opacity: { duration: 0 }
            }}
          >
            <Icon 
              size={22} 
              className={cn(
                "transition-colors",
                isActive 
                  ? "text-sidebar-foreground" 
                  : "text-muted-foreground"
              )} 
            />
          </motion.div>
          
          {isActive && (
            <motion.div 
              className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-sidebar-primary"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 15 
              }}
            />
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              className="overflow-hidden"
              style={{ minWidth: "100px" }}
              initial={false}
              animate={{ 
                width: "auto", 
                opacity: 1,
                transition: { duration: 0.3 }
              }}
              exit={{ 
                width: 0, 
                opacity: 0,
                transition: { duration: 0.3 }
              }}
            >
              <motion.span 
                style={{ 
                  fontFamily: "'Open Sans', sans-serif", 
                  fontSize: "16px",
                  willChange: "transform, opacity",
                  display: "block",
                  whiteSpace: "nowrap"
                }}
                className={cn(
                  "transition-all duration-300",
                  isActive ? "text-sidebar-foreground" : "text-muted-foreground"
                )}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  fontWeight: isActive ? 600 : 400
                }}
                transition={{ 
                  duration: 0.2,
                  opacity: { duration: 0.2 }
                }}
              >
                {label}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}