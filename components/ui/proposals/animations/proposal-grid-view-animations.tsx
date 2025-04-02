import React, { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";

interface AnimatedCardProps {
  children: ReactNode;
  customAnimation?: MotionProps;
  index?: number;
}

/**
 * AnimatedCard - A reusable animation wrapper for card-based components
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  customAnimation,
  index = 0
}) => {
  // Default animation properties - faster spring animation with no delay
  const defaultAnimation: MotionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, margin: "-50px" },
    transition: {
      type: "spring",
      stiffness: 400,  // Increased from 300 for faster motion
      damping: 22,     // Reduced from 25 for faster settling
      duration: 0.3    // Reduced from 0.4 for faster overall animation
      // Removed delay entirely
    }
  };

  // Merge custom animations with defaults if provided
  const animationProps = customAnimation || defaultAnimation;
  
  return (
    <motion.div {...animationProps}>
      {children}
    </motion.div>
  );
};

/**
 * AnimatedListItem - A reusable animation wrapper for list-based components
 */
export const AnimatedListItem: React.FC<AnimatedCardProps> = ({
  children,
  customAnimation,
  index = 0
}) => {
  // Default list item animation (horizontal slide) - faster spring animation with no delay
  const defaultAnimation: MotionProps = {
    initial: { opacity: 0, x: -15 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, margin: "-40px" },
    transition: {
      type: "spring",
      stiffness: 500,    // Increased from 400 for faster motion
      damping: 25,       // Slightly reduced for faster settling
      duration: 0.25     // Reduced from 0.3 for faster overall animation
      // Removed delay entirely
    }
  };

  const animationProps = customAnimation || defaultAnimation;
  
  return (
    <motion.div {...animationProps}>
      {children}
    </motion.div>
  );
};

/**
 * AnimatedContainer - A wrapper for staggered container animations
 */
export const AnimatedContainer: React.FC<AnimatedCardProps> = ({
  children,
  customAnimation
}) => {
  const defaultAnimation: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.2     // Reduced from 0.3 for faster animation
      // Removed staggerChildren
    }
  };

  const animationProps = customAnimation || defaultAnimation;
  
  return (
    <motion.div {...animationProps}>
      {children}
    </motion.div>
  );
};