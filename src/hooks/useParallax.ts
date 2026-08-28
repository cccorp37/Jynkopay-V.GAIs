import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface UseParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
}

export const useParallax = ({ speed = 0.5, direction = "up" }: UseParallaxOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);

  return { ref, y, scrollYProgress };
};

export const useParallaxRange = (
  scrollYProgress: any,
  inputRange: number[],
  outputRange: number[]
) => {
  return useTransform(scrollYProgress, inputRange, outputRange);
};
