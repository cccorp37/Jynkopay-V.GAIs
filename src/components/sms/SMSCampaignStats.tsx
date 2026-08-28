import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

interface CampaignStats {
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  contactsCount: number;
  deliveryRate: number;
}

interface SMSCampaignStatsProps {
  stats: CampaignStats | null;
  loading?: boolean;
}

export function SMSCampaignStats({ stats, loading = false }: SMSCampaignStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl glass border border-[rgba(45,51,82,0.5)] animate-pulse"
          >
            <div className="h-10 w-10 rounded-xl bg-[rgba(108,63,245,0.15)] mb-3" />
            <div className="h-4 w-20 bg-[rgba(45,51,82,0.5)] rounded mb-2" />
            <div className="h-8 w-16 bg-[rgba(45,51,82,0.5)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "SMS envoyés",
      value: stats?.sentCount?.toLocaleString() || "0",
      icon: Send,
      color: "#6C3FF5",
      change: stats?.sentCount && stats.sentCount > 0 ? "+100%" : null,
    },
    {
      title: "Livrés",
      value: stats?.deliveredCount?.toLocaleString() || "0",
      icon: CheckCircle,
      color: "#00C896",
      change: stats?.deliveryRate ? `${stats.deliveryRate}%` : null,
    },
    {
      title: "Échoués",
      value: stats?.failedCount?.toLocaleString() || "0",
      icon: XCircle,
      color: "#FF4757",
      change: null,
    },
    {
      title: "Contacts",
      value: stats?.contactsCount?.toLocaleString() || "0",
      icon: Users,
      color: "#00E5FF",
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-5 rounded-2xl glass border border-[rgba(45,51,82,0.5)]"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon style={{ color: stat.color }} size={20} />
            </div>
            {stat.change && (
              <span className="text-sm font-medium text-[#00C896] bg-[rgba(0,200,150,0.1)] px-2 py-0.5 rounded-lg">
                {stat.change}
              </span>
            )}
          </div>
          <p className="text-sm text-[#9CA3AF] mb-1">{stat.title}</p>
          <p className="text-2xl font-bold font-mono-numbers text-white">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

interface SMSCreditsProps {
  credits?: number;
}

export function SMSCredits({ credits = 0 }: SMSCreditsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-[rgba(255,184,77,0.1)] border border-[rgba(255,184,77,0.3)]"
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap className="text-[#FFB84D]" size={16} />
        <span className="text-[#FFB84D] font-medium text-sm">Crédits SMS</span>
      </div>
      <p className="text-2xl font-bold font-mono-numbers text-white">
        {credits.toLocaleString()}
      </p>
      <p className="text-xs text-[#9CA3AF] mt-1">≈ {credits.toLocaleString()} SMS restants</p>
    </motion.div>
  );
}
