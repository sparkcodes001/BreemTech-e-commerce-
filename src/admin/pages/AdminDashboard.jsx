import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import useAdminStore from "../../store/adminStore";
import { products } from "../../data/products";

const statusConfig = {
  delivered: {
    label: "Delivered",
    class: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  shipped: {
    label: "Shipped",
    class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  pending: {
    label: "Pending",
    class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  cancelled: {
    label: "Cancelled",
    class: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-dark-200 border border-dark-400
        rounded-xl px-4 py-3 shadow-xl"
      >
        <p className="text-primary-400 text-xs mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-light font-bold text-sm">
            {entry.name === "revenue" ? "$" : ""}
            {entry.value.toLocaleString()}
            {entry.name === "orders" ? " orders" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const orders = useAdminStore((state) => state.orders);
  const monthlySales = useAdminStore((state) => state.monthlySales);
  const getStats = useAdminStore((state) => state.getStats);

  const stats = getStats();
  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  const statsRef = useRef(null);
  const chartsRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".stat-card",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      },
    );

    gsap.fromTo(
      ".chart-card",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.4,
      },
    );

    gsap.fromTo(
      ".table-row",
      { x: -20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.6,
      },
    );
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <TrendingUp size={20} />,
      change: "+12.5%",
      up: true,
      color: "accent",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart size={20} />,
      change: "+8.2%",
      up: true,
      color: "blue",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: <Users size={20} />,
      change: "+5.1%",
      up: true,
      color: "green",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <Clock size={20} />,
      change: "-2.4%",
      up: false,
      color: "yellow",
    },
  ];

  const colorMap = {
    accent: {
      bg: "bg-accent/10",
      border: "border-accent/20",
      text: "text-accent",
      glow: "shadow-accent/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      glow: "shadow-blue-500/10",
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      text: "text-green-400",
      glow: "shadow-green-500/10",
    },
    yellow: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400",
      glow: "shadow-yellow-500/10",
    },
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div
        ref={statsRef}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {statCards.map((stat, i) => {
          const c = colorMap[stat.color];
          return (
            <div
              key={i}
              className={`stat-card bg-dark-200 border border-dark-400
                rounded-2xl p-5 hover:border-accent/30
                transition-all duration-300 hover:shadow-lg ${c.glow}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl ${c.bg}
                  border ${c.border} flex items-center justify-center
                  ${c.text}`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold
                  ${stat.up ? "text-green-400" : "text-red-400"}`}
                >
                  {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <p className="text-light font-display font-bold text-2xl">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div
          className="chart-card lg:col-span-2 bg-dark-200
          border border-dark-400 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-light font-bold text-base">
                Revenue Overview
              </h3>
              <p className="text-primary-500 text-xs mt-0.5">Last 6 months</p>
            </div>
            <span
              className="bg-accent/10 border border-accent/20
              text-accent text-xs font-bold px-3 py-1.5 rounded-xl"
            >
              Monthly
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlySales}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8F135" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C8F135" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2a2a"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C8F135"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={{ fill: "#C8F135", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#C8F135" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div
          className="chart-card bg-dark-200 border border-dark-400
          rounded-2xl p-5"
        >
          <div className="mb-6">
            <h3 className="text-light font-bold text-base">Orders</h3>
            <p className="text-primary-500 text-xs mt-0.5">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlySales} barSize={20}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2a2a"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="orders"
                fill="#C8F135"
                radius={[6, 6, 0, 0]}
                fillOpacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div
          className="lg:col-span-2 bg-dark-200 border border-dark-400
          rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-light font-bold text-base">Recent Orders</h3>
              <p className="text-primary-500 text-xs mt-0.5">
                Latest transactions
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1.5 text-accent
                text-xs font-semibold hover:gap-2.5 transition-all duration-300"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-primary-500 text-sm text-center py-8">
                No orders yet
              </p>
            ) : (
              recentOrders.map((order) => {
                const s = statusConfig[order.status];
                return (
                  <div
                    key={order.id}
                    className="table-row flex items-center gap-3
                      bg-dark-300 rounded-xl p-3
                      hover:border-accent/20 border border-transparent
                      transition-all duration-300"
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full bg-accent/10
                      border border-accent/20 flex items-center justify-center
                      text-accent font-bold text-sm shrink-0"
                    >
                      {order.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-light font-semibold text-sm truncate">
                        {order.customer}
                      </p>
                      <p className="text-primary-500 text-xs truncate">
                        {order.products[0]}
                        {order.products.length > 1 &&
                          ` +${order.products.length - 1}`}
                      </p>
                    </div>

                    {/* Amount */}
                    <p className="text-light font-bold text-sm shrink-0">
                      ${order.total.toLocaleString()}
                    </p>

                    {/* Status */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1
                      rounded-full border shrink-0 ${s.class}`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div
          className="bg-dark-200 border border-dark-400
          rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-light font-bold text-base">Low Stock</h3>
              <p className="text-primary-500 text-xs mt-0.5">Needs attention</p>
            </div>
            <span
              className="bg-red-500/10 border border-red-500/20
              text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full"
            >
              {lowStockProducts.length} items
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <p className="text-primary-500 text-sm text-center py-4">
                All products well stocked ✅
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3
                    bg-dark-300 rounded-xl p-3
                    border border-transparent hover:border-red-500/20
                    transition-all duration-300"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover
                    border border-dark-400 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-light font-semibold text-xs truncate">
                      {p.name}
                    </p>
                    <p className="text-red-400 text-[10px] font-semibold mt-0.5">
                      {p.stock} left
                    </p>
                  </div>
                  <div className="w-12 bg-dark-400 rounded-full h-1.5 shrink-0">
                    <div
                      className="bg-red-400 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min((p.stock / 10) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div
            className="mt-4 pt-4 border-t border-dark-400
            grid grid-cols-2 gap-3"
          >
            <div className="bg-dark-300 rounded-xl p-3 text-center">
              <p className="text-light font-bold text-lg">{products.length}</p>
              <p className="text-primary-500 text-[10px] mt-0.5">
                Total Products
              </p>
            </div>
            <div className="bg-dark-300 rounded-xl p-3 text-center">
              <p className="text-green-400 font-bold text-lg">
                {products.filter((p) => p.stock > 10).length}
              </p>
              <p className="text-primary-500 text-[10px] mt-0.5">In Stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
