import { NavLink, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Zap,
  LogOut,
  X,
} from "lucide-react";
import useAdminAuthStore from "../../store/adminAuthStore";

const navItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    to: "/admin/dashboard",
  },
  {
    icon: <Package size={18} />,
    label: "Products",
    to: "/admin/products",
  },
  {
    icon: <ShoppingCart size={18} />,
    label: "Orders",
    to: "/admin/orders",
  },
  {
    icon: <Users size={18} />,
    label: "Customers",
    to: "/admin/customers",
  },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { admin, logout } = useAdminAuthStore();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
    }
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        window.innerWidth < 1024
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    gsap.to(sidebarRef.current, {
      x: -20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        logout();
        navigate("/admin/login");
      },
    });
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleCloseClick}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-dark-200
          border-r border-dark-400 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between
          px-6 py-5 border-b border-dark-400"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl bg-accent/10
              border border-accent/30 flex items-center justify-center"
            >
              <Zap size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-light font-display font-bold text-base leading-none">
                Nexus
              </p>
              <p className="text-accent text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                Admin
              </p>
            </div>
          </div>

          {/* Close - Mobile */}
          <button
            type="button"
            onClick={handleCloseClick}
            className="lg:hidden w-8 h-8 rounded-lg bg-dark-300
              border border-dark-400 flex items-center justify-center
              text-primary-400 hover:text-light transition-colors
              active:scale-95 touch-manipulation"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleCloseClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-semibold transition-all duration-300
                ${
                  isActive
                    ? "bg-accent text-dark shadow-lg shadow-accent/20"
                    : "text-primary-400 hover:text-light hover:bg-dark-300"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Admin Profile + Logout */}
        <div className="px-3 py-4 border-t border-dark-400 space-y-3">
          {/* Profile */}
          <div
            className="flex items-center gap-3 px-4 py-3
            bg-dark-300 rounded-xl border border-dark-400"
          >
            <div
              className="w-9 h-9 rounded-full bg-accent/20
              border border-accent/30 flex items-center justify-center
              text-accent font-bold text-sm shrink-0"
            >
              {admin?.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-light font-semibold text-sm leading-none truncate">
                {admin?.name}
              </p>
              <p className="text-primary-500 text-[10px] mt-0.5 truncate">
                {admin?.role}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3
              rounded-xl text-sm font-semibold text-primary-400
              hover:text-red-400 hover:bg-red-500/10
              border border-transparent hover:border-red-500/20
              transition-all duration-300 active:scale-95"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
