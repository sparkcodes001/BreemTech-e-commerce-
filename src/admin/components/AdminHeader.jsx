import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Menu, Bell, Search } from "lucide-react";
import useAdminAuthStore from "../../store/adminAuthStore";
import useAdminStore from "../../store/adminStore";

const AdminHeader = ({ onMenuClick, title }) => {
  const { admin } = useAdminAuthStore();
  const orders = useAdminStore((state) => state.orders);
  const headerRef = useRef(null);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="h-16 bg-dark-200 border-b border-dark-400
      flex items-center justify-between px-4 sm:px-6
      sticky top-0 z-30"
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Hamburger - Mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl bg-dark-300
            border border-dark-400 flex items-center justify-center
            text-primary-400 hover:text-light transition-colors"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-light font-display font-bold text-lg sm:text-xl leading-none">
            {title}
          </h1>
          <p className="text-primary-600 text-[10px] sm:text-xs mt-0.5">
            Nexus Admin Panel
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search - Desktop */}
        <div
          className="hidden sm:flex items-center gap-2
          bg-dark-300 border border-dark-400 rounded-xl
          px-3 py-2 w-48"
        >
          <Search size={14} className="text-primary-500 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-light text-xs
              placeholder:text-primary-600 focus:outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-xl bg-dark-300
          border border-dark-400 flex items-center justify-center
          text-primary-400 hover:text-light transition-colors"
        >
          <Bell size={16} />
          {pendingCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4
              bg-accent text-dark text-[9px] font-bold
              rounded-full flex items-center justify-center"
            >
              {pendingCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl bg-accent/20
          border border-accent/30 flex items-center justify-center
          text-accent font-bold text-sm cursor-pointer
          hover:bg-accent/30 transition-colors"
        >
          {admin?.avatar}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
