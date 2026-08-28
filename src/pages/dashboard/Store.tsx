import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Store as StoreIcon,
  Plus,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  Eye,
  Edit,
  ExternalLink,
  LayoutGrid,
  List,
  Search,
  Filter,
  MoreHorizontal,
  Image as ImageIcon,
  Tag,
  Truck,
  DollarSign,
  BarChart3,
  Zap,
  Globe,
  Palette
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useStore, Product } from "@/hooks/useStore";

const Store = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { products, isLoading } = useStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasStore, setHasStore] = useState(false);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR").format(amount || 0) + " " + currency;
  };

  const storeStats = useMemo(() => {
    const totalSales = products.reduce((sum, p) => sum + ((p.price || 0) * (p.sales || 0)), 0);
    const activeProducts = products.filter(p => p.status === "active").length;
    const totalOrders = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    
    return [
      { title: "Ventes totales", value: new Intl.NumberFormat("fr-FR").format(totalSales), unit: "XOF", change: "", icon: DollarSign, color: "#00C896" },
      { title: "Commandes", value: totalOrders.toString(), unit: "", change: "", icon: ShoppingBag, color: "#00D2FF" },
      { title: "Produits actifs", value: activeProducts.toString(), unit: "", change: "", icon: Package, color: "#00E6A5" },
      { title: "Visiteurs (30j)", value: "0", unit: "", change: "", icon: Users, color: "#FFB84D" },
    ];
  }, [products]);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Store not created yet
  if (!hasStore) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg"
          >
            <motion.div 
              className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <StoreIcon className="text-white" size={48} />
            </motion.div>
            
            <h1 className="text-3xl font-display font-bold text-white mb-4">
              Lancez votre boutique en ligne
            </h1>
            <p className="text-[#9CA3AF] text-lg mb-8">
              Créez votre e-commerce en quelques minutes. Templates professionnels, paiements intégrés, gestion simplifiée.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Palette, label: "50+ Templates", color: "#6C3FF5" },
                { icon: DollarSign, label: "Paiements intégrés", color: "#00C896" },
                { icon: Truck, label: "Livraison facile", color: "#FFB84D" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="p-4 rounded-xl glass border border-[rgba(45,51,82,0.5)]"
                >
                  <div 
                    className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon style={{ color: feature.color }} size={20} />
                  </div>
                  <p className="text-sm text-[#D1D5DB]">{feature.label}</p>
                </motion.div>
              ))}
            </div>
            
            <Button 
              size="lg" 
              className="h-14 px-8"
              onClick={() => setHasStore(true)}
            >
              <Plus size={20} className="mr-2" />
              Créer ma boutique gratuitement
            </Button>
            
            <p className="text-sm text-[#6B7280] mt-4">
              Gratuit jusqu'à 10 produits • À partir de 5 000 XOF/mois ensuite
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

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
            <h1 className="text-2xl font-display font-bold text-white">Ma Boutique</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#9CA3AF]">maboutique.jynkopay.shop</span>
              <button className="p-1 rounded hover:bg-[rgba(108,63,245,0.1)] transition-colors">
                <ExternalLink size={14} className="text-[#6C3FF5]" />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <Eye size={18} className="mr-2" />
              Aperçu
            </Button>
            <Button variant="secondary">
              <Edit size={18} className="mr-2" />
              Personnaliser
            </Button>
            <Button>
              <Plus size={18} className="mr-2" />
              Nouveau produit
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {storeStats.map((stat, index) => (
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
                <span className="text-sm font-medium text-[#00C896] bg-[rgba(0,200,150,0.1)] px-2 py-0.5 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-[#9CA3AF] mb-1">{stat.title}</p>
              <p className="text-2xl font-bold font-mono-numbers text-white">
                {stat.value} <span className="text-sm text-[#6B7280]">{stat.unit}</span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl glass border border-[rgba(45,51,82,0.5)]"
        >
          {/* Products Header */}
          <div className="p-6 border-b border-[rgba(45,51,82,0.5)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Package className="text-[#6C3FF5]" size={24} />
                <h3 className="text-lg font-display font-bold text-white">Produits ({products.length})</h3>
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-10 w-48 h-10 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]"
                  />
                </div>
                
                <div className="flex rounded-xl bg-[rgba(21,25,50,0.5)] p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid" ? "bg-[#6C3FF5] text-white" : "text-[#9CA3AF]"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list" ? "bg-[#6C3FF5] text-white" : "text-[#9CA3AF]"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid/List */}
          <div className="p-6">
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="rounded-xl border border-[rgba(45,51,82,0.5)] bg-[rgba(21,25,50,0.5)] overflow-hidden group cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-[rgba(45,51,82,0.3)] flex items-center justify-center">
                      <ImageIcon size={48} className="text-[#6B7280]" />
                      {product.status !== "active" && (
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium ${
                          product.status === "draft" 
                            ? "bg-[rgba(108,63,245,0.2)] text-[#6C3FF5]"
                            : "bg-[rgba(255,71,87,0.2)] text-[#FF4757]"
                        }`}>
                          {product.status === "draft" ? "Brouillon" : "Rupture"}
                        </div>
                      )}
                      <button className="absolute top-2 right-2 p-2 rounded-lg bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} className="text-white" />
                      </button>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs text-[#6B7280] mb-1">{product.category}</p>
                      <h4 className="font-medium text-white mb-2 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold font-mono-numbers text-[#00C896]">
                          {formatAmount(product.price, product.currency)}
                        </p>
                        <span className="text-xs text-[#6B7280]">{product.stock} en stock</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Add Product Card */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, borderColor: "#6C3FF5" }}
                  className="aspect-square rounded-xl border-2 border-dashed border-[rgba(45,51,82,0.5)] flex flex-col items-center justify-center gap-3 transition-all hover:bg-[rgba(108,63,245,0.05)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgba(108,63,245,0.1)] flex items-center justify-center">
                    <Plus className="text-[#6C3FF5]" size={24} />
                  </div>
                  <span className="text-sm text-[#9CA3AF]">Ajouter un produit</span>
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(45,51,82,0.5)] bg-[rgba(21,25,50,0.5)] cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg bg-[rgba(45,51,82,0.3)] flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={24} className="text-[#6B7280]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white">{product.name}</h4>
                      <p className="text-sm text-[#6B7280]">{product.category}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold font-mono-numbers text-[#00C896]">
                        {formatAmount(product.price, product.currency)}
                      </p>
                      <p className="text-xs text-[#6B7280]">{product.stock} en stock</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-white">{product.sales}</p>
                      <p className="text-xs text-[#6B7280]">ventes</p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      product.status === "active"
                        ? "bg-[rgba(0,200,150,0.1)] text-[#00C896]"
                        : product.status === "draft"
                        ? "bg-[rgba(108,63,245,0.1)] text-[#6C3FF5]"
                        : "bg-[rgba(255,71,87,0.1)] text-[#FF4757]"
                    }`}>
                      {product.status === "active" ? "Actif" : product.status === "draft" ? "Brouillon" : "Rupture"}
                    </div>
                    
                    <button className="p-2 rounded-lg hover:bg-[rgba(108,63,245,0.1)] transition-colors">
                      <MoreHorizontal size={18} className="text-[#6B7280]" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: "Voir les analytics", description: "Statistiques détaillées de votre boutique", color: "#6C3FF5", href: "/dashboard/analytics" },
            { icon: Globe, title: "Domaine personnalisé", description: "Connectez votre propre domaine", color: "#00E5FF", href: "#" },
            { icon: Zap, title: "Boost marketing", description: "Promouvoir vos produits", color: "#FFB84D", href: "/dashboard/marketing" },
          ].map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4, borderColor: action.color }}
              className="p-6 rounded-2xl glass border border-[rgba(45,51,82,0.5)] text-left transition-all"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <action.icon style={{ color: action.color }} size={24} />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-1">{action.title}</h3>
              <p className="text-sm text-[#9CA3AF]">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Store;
