import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface CountUpStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

export const CountUpStat = ({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  icon: Icon,
  color,
  index,
}: CountUpStatProps) => {
  const { ref, formattedValue } = useCountUp({
    end: value,
    duration: 2500,
    decimals,
    suffix,
    prefix,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
      className="text-center group"
    >
      <motion.div
        className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5"
        style={{ background: `${color}15` }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon style={{ color }} size={28} />
      </motion.div>
      
      <motion.p
        className="text-5xl lg:text-6xl font-bold text-gradient-primary mb-3 font-mono-numbers tracking-tight"
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          delay: 0.5 + index * 0.1 
        }}
      >
        {formattedValue}
      </motion.p>
      
      <p className="text-sm text-[#9CA3AF] font-medium">{label}</p>
    </motion.div>
  );
};
