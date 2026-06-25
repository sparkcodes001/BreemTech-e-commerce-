import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, Search, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navRef = useRef(null);
  const menuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const iconsRef = useRef([]);
  const logoRef = useRef(null);
  const location = useLocation();

  // ✅ Subscribe to store changes for real-time updates
  const cartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial animations
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    )
      .fromTo(
        logoRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.7",
      )
      .fromTo(
        iconsRef.current,
        { y: -20, opacity: 0, scale: 0.5, rotation: -180 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.6",
      );
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo(
        menuRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        ".menu-item",
        { x: 50, opacity: 0, rotateY: 90 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: "back.out(1.2)",
        },
      );
    }
  }, [isMenuOpen]);

  // Search animation
  useEffect(() => {
    if (searchOpen) {
      gsap.to(searchContainerRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.fromTo(
        ".search-input",
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
      );
    } else {
      gsap.to(searchContainerRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && searchOpen) setSearchOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Mobiles", path: "/products?category=mobile" },
    { name: "PCs", path: "/products?category=pc" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-dark/95 backdrop-blur-md border-b border-dark-400 py-2 sm:py-3"
            : "bg-transparent py-3 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            ref={logoRef}
            to="/"
            className="flex items-center gap-2 group shrink-0 z-10 relative"
          >
            <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-light tracking-widest group-hover:text-accent transition-all duration-300 group-hover:scale-105">
              BREEM<span className="text-accent">TECH</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-all duration-300
                    relative after:absolute after:bottom-0 after:left-0 after:h-[1px] 
                    after:bg-accent after:transition-all after:duration-300
                    hover:text-accent hover:scale-105
                    ${
                      location.pathname === link.path
                        ? "text-accent after:w-full"
                        : "text-light/70 after:w-0 hover:after:w-full"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative z-10">
            {/* Search */}
            <button
              ref={(el) => (iconsRef.current[0] = el)}
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-light/70 hover:text-accent transition-all duration-300 p-1.5
                hover:scale-125 active:scale-95 hover:rotate-12"
              title="Search"
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist */}
            <Link
              ref={(el) => (iconsRef.current[1] = el)}
              to="/wishlist"
              className="text-light/70 hover:text-accent transition-all duration-300 
                relative p-1.5 hover:scale-125 active:scale-95 hidden sm:flex"
              title="Wishlist"
            >
              <Heart size={18} className="sm:w-5 sm:h-5" />
              {wishlistItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 bg-accent text-dark text-[10px] 
                  w-3.5 h-3.5 sm:w-4 sm:h-4 sm:text-xs rounded-full flex items-center justify-center font-bold
                  shadow-lg shadow-accent/50 animate-pulse"
                >
                  {wishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              ref={(el) => (iconsRef.current[2] = el)}
              to="/cart"
              className="text-light/70 hover:text-accent transition-all duration-300 
                relative p-1.5 hover:scale-125 active:scale-95"
              title="Shopping Cart"
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              {cartItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 bg-accent text-dark text-[10px] 
                  w-3.5 h-3.5 sm:w-4 sm:h-4 sm:text-xs rounded-full flex items-center justify-center font-bold
                  shadow-lg shadow-accent/50 animate-pulse"
                >
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              ref={(el) => (iconsRef.current[3] = el)}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-light hover:text-accent 
                transition-all duration-300 p-1.5 hover:scale-125 active:scale-95"
              title="Menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <div
        ref={searchContainerRef}
        className="fixed top-0 left-0 right-0 z-40 bg-dark/98 backdrop-blur-lg pt-20 pb-6 px-4
          opacity-0 pointer-events-none transition-all duration-300"
      >
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for mobiles, PCs, accessories..."
            className="search-input w-full bg-dark-200 text-light text-sm sm:text-base px-6 py-4 rounded-2xl 
              border-2 border-dark-400 focus:outline-none focus:border-accent 
              placeholder:text-primary-500 shadow-2xl"
            autoFocus={searchOpen}
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 hover:text-accent
              transition-all duration-300 hover:scale-110 active:scale-95"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-center text-primary-600 text-xs mt-4">
          Press <kbd className="px-2 py-1 bg-dark-300 rounded">ESC</kbd> to
          close
        </p>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 bg-dark/98 backdrop-blur-lg 
            flex flex-col justify-center items-center md:hidden"
        >
          <ul className="flex flex-col items-center gap-6 sm:gap-8">
            {navLinks.map((link) => (
              <li key={link.name} className="menu-item">
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-display text-3xl sm:text-4xl font-bold tracking-wider
                    transition-all duration-300 hover:text-accent hover:scale-110
                    ${
                      location.pathname === link.path
                        ? "text-accent"
                        : "text-light"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Icons */}
          <div className="absolute bottom-10 flex items-center gap-8">
            <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="menu-item text-light/70 hover:text-accent 
                transition-all duration-300 hover:scale-125 active:scale-95 relative"
              title="Wishlist"
            >
              <Heart size={28} />
              {wishlistItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-accent text-dark text-xs 
                  w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {wishlistItems}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="menu-item text-light/70 hover:text-accent 
                transition-all duration-300 hover:scale-125 active:scale-95 relative"
              title="Shopping Cart"
            >
              <ShoppingCart size={28} />
              {cartItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-accent text-dark text-xs 
                  w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {cartItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
