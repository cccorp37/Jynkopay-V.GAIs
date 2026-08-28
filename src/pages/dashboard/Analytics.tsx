import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingBag,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Download,
  Filter,
  ChevronDown
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

const stats = [
  { 
    title: "Revenus totaux", 
    value: "4 250 000", 
    unit: "XOF",
    change: "+18.5%",
    positive: true,
    icon: DollarSign, 
    color: "#00C896",
    description: "vs mois dernier"
  },
  { 
    title: "Transactions", 
    value: "847", 
    unit: "",
    change: "+24%",
    positive: true,
    icon: ShoppingBag, 
    color: "#6C3FF5",
    description: "ce mois-ci"
  },
  { 
    title: "Utilisateurs actifs", 
    value: "1 234", 
    unit: "",
    change: "+12%",
    positive: true,
    icon: Users, 
    color: "#00E5FF",
    description: "30 derniers jours"
  },
  { 
    title: "Taux de conversion", 
    value: "3.2", 
    unit: "%",
    change: "-0.5%",
    positive: false,
    icon: TrendingUp, 
    color: "#FFB84D",
    description: "visiteurs → clients"
  },
];

const topPages = [
  { page: "/boutique", views: 12450, percentage: 35 },
  { page: "/produit/hoodie-premium", views: 8920, percentage: 25 },
  { page: "/checkout", views: 6340, percentage: 18 },
  { page: "/categories/vetements", views: 4560, percentage: 13 },
  { page: "/contact", views: 3120, percentage: 9 },
];

const trafficSources = [
  { source: "Recherche organique", value: 45, color: "#6C3FF5" },
  { source: "Réseaux sociaux", value: 28, color: "#00E5FF" },
  { source: "Direct", value: 15, color: "#00C896" },
  { source: "Référents", value: 8, color: "#FFB84D" },
  { source: "Email", value: 4, color: "#FF006B" },
];

const deviceStats = [
  { device: "Mobile", icon: Smartphone, percentage: 62, color: "#6C3FF5" },
  { device: "Desktop", icon: Monitor, percentage: 32, color: "#00E5FF" },
  { device: "Tablette", icon: Monitor, percentage: 6, color: "#FFB84D" },
];

const topCountries = [
  { country: "Sénégal", flag: "🇸🇳", users: 4520, percentage: 42 },
  { country: "Côte d'Ivoire", flag: "🇨🇮", users: 2890, percentage: 27 },
  { country: "Mali", flag: "🇲🇱", users: 1240, percentage: 12 },
  { country: "France", flag: "🇫🇷", users: 890, percentage: 8 },
  { country: "Autres", flag: "🌍", users: 1160, percentage: 11 },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Analytics</h1>
            <p className="text-[#9CA3AF]">Vue d'ensemble des performances de votre activité</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Button variant="secondary" className="gap-2">
                <Calendar size={16} />
                30 derniers jours
                <ChevronDown size={16} />
              </Button>
            </div>
            <Button variant="secondary">
              <Download size={18} className="mr-2" />
              Exporter
            </Button>
          </div>
        </motion.div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
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
                <span className={`text-sm font-medium px-2 py-0.5 rounded-lg ${
                  stat.positive 
                    ? "text-[#00C896] bg-[rgba(0,200,150,0.1)]" 
                    : "text-[#FF4757] bg-[rgba(255,71,87,0.1)]"
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-[#9CA3AF] mb-1">{stat.title}</p>
              <p className="text-2xl font-bold font-mono-numbers text-white">
                {stat.value} <span className="text-sm text-[#6B7280]">{stat.unit}</span>
              </p>
              <p className="text-xs text-[#6B7280] mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-white">Revenus</h3>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-2 text-[#9CA3AF]">
                  <div className="w-3 h-3 rounded-full bg-[#6C3FF5]" />
                  Ce mois
                </span>
                <span className="flex items-center gap-2 text-[#9CA3AF]">
                  <div className="w-3 h-3 rounded-full bg-[rgba(108,63,245,0.3)]" />
                  Mois dernier
                </span>
              </div>
            </div>
            
            {/* Placeholder Chart */}
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 85, 67, 92, 55, 73, 89, 62, 95].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    className="bg-gradient-to-t from-[#6C3FF5] to-[#00E5FF] rounded-t-lg"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height * 0.6}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    className="bg-[rgba(108,63,245,0.2)] rounded-t-lg"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-xs text-[#6B7280]">
              <span>Jan</span>
              <span>Fév</span>
              <span>Mar</span>
              <span>Avr</span>
              <span>Mai</span>
              <span>Juin</span>
              <span>Juil</span>
              <span>Août</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Déc</span>
            </div>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6"
          >
            <h3 className="text-lg font-display font-bold text-white mb-6">Sources de trafic</h3>
            
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#D1D5DB]">{source.source}</span>
                    <span className="text-sm font-mono-numbers text-white">{source.value}%</span>
                  </div>
                  <div className="h-2 bg-[rgba(45,51,82,0.5)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.value}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-white">Pages populaires</h3>
              <Eye className="text-[#6B7280]" size={20} />
            </div>
            
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <motion.div
                  key={page.page}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[rgba(108,63,245,0.1)] flex items-center justify-center text-xs font-medium text-[#6C3FF5]">
                      {index + 1}
                    </span>
                    <span className="text-sm text-[#D1D5DB] truncate max-w-[150px]">{page.page}</span>
                  </div>
                  <span className="text-sm font-mono-numbers text-white">{page.views.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-white">Appareils</h3>
              <Smartphone className="text-[#6B7280]" size={20} />
            </div>
            
            <div className="space-y-4">
              {deviceStats.map((device, index) => (
                <motion.div
                  key={device.device}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${device.color}20` }}
                  >
                    <device.icon style={{ color: device.color }} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#D1D5DB]">{device.device}</span>
                      <span className="text-sm font-mono-numbers text-white">{device.percentage}%</span>
                    </div>
                    <div className="h-2 bg-[rgba(45,51,82,0.5)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${device.percentage}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: device.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-white">Pays</h3>
              <Globe className="text-[#6B7280]" size={20} />
            </div>
            
            <div className="space-y-3">
              {topCountries.map((country, index) => (
                <motion.div
                  key={country.country}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[rgba(21,25,50,0.5)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-sm text-[#D1D5DB]">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono-numbers text-white">{country.users.toLocaleString()}</p>
                    <p className="text-xs text-[#6B7280]">{country.percentage}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Real-time Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-[#00C896]"
              />
              <span className="text-lg font-display font-bold text-white">Temps réel</span>
            </div>
            <span className="text-sm text-[#9CA3AF]">42 utilisateurs actifs maintenant</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Pages vues/min", value: "156", icon: Eye },
              { label: "Sessions actives", value: "42", icon: Users },
              { label: "Durée moyenne", value: "3:24", icon: Clock },
              { label: "Taux de rebond", value: "32%", icon: MousePointer },
            ].map((metric, index) => (
              <div key={metric.label} className="p-4 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)]">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon size={16} className="text-[#6B7280]" />
                  <span className="text-xs text-[#9CA3AF]">{metric.label}</span>
                </div>
                <p className="text-xl font-bold font-mono-numbers text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
