import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  Monitor,
  Headphones,
  Tablet,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: "Smartphones",
    path: "/products?category=mobile",
    icon: Smartphone,
    count: 120,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: 2,
    name: "Laptops",
    path: "/products?category=pc",
    icon: Monitor,
    count: 85,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 3,
    name: "Accessories",
    path: "/products?category=accessories",
    icon: Headphones,
    count: 200,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: 4,
    name: "Tablets",
    path: "/products?category=tablet",
    icon: Tablet,
    count: 45,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
];

// Top brands for marquee
const brands = [
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    name: "Dell",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
  },
  {
    name: "HP",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
  },
  {
    name: "Lenovo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Lenovo_logo.svg",
  },
  {
    name: "ASUS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "OnePlus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/OnePlus_Logo.svg",
  },
];

// ── Infinite Marquee ──
const InfiniteMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-dark-200 border-y border-dark-400 py-6">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {/* Duplicate brands for seamless loop */}
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <div
            key={i}
            className="flex items-center justify-center min-w-[140px] h-12 grayscale opacity-40
              hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-6 object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ── Category Card ──
const CategoryCard = ({ cat, index, span }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const IconComponent = cat.icon;

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        },
      },
    );
  }, [index]);

  return (
    <Link
      to={cat.path}
      ref={cardRef}
      className={`group relative overflow-hidden rounded-3xl
        bg-dark-200 border border-dark-400
        hover:border-accent/50 transition-all duration-500
        hover:shadow-2xl hover:shadow-accent/10
        ${span === "large" ? "row-span-2" : ""}
        ${span === "wide" ? "col-span-2" : ""}
        min-h-[200px] sm:min-h-[240px]`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imageRef}
          src={cat.image}
          alt={cat.name}
          className="w-full h-full object-cover opacity-30
            group-hover:scale-110 group-hover:opacity-40
            transition-all duration-700"
        />
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-end">
        {/* Icon */}
        <div
          className="mb-4 w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30
          flex items-center justify-center text-accent backdrop-blur-sm
          group-hover:scale-110 group-hover:bg-accent/20 group-hover:border-accent/50
          transition-all duration-300"
        >
          <IconComponent size={24} />
        </div>

        {/* Name */}
        <h3
          className="font-display font-bold text-2xl sm:text-3xl text-light mb-2
          group-hover:text-accent transition-colors duration-300"
        >
          {cat.name}
        </h3>

        {/* Count + Arrow */}
        <div className="flex items-center justify-between">
          <span className="text-primary-400 text-sm font-medium">
            {cat.count}+ Products
          </span>
          <div
            className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30
            flex items-center justify-center text-accent
            group-hover:translate-x-1 transition-all duration-300"
          >
            <ArrowRight size={18} />
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
        bg-gradient-to-tr from-accent/5 via-transparent to-transparent
        transition-opacity duration-500 pointer-events-none"
      />
    </Link>
  );
};

// ── Main Section ──
const Categories = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".cat-heading",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-dark relative overflow-hidden">
      {/* ── Header ── */}
      <div className="section-padding pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div
            className="cat-heading flex items-center justify-center gap-2 text-accent text-xs sm:text-sm
            uppercase tracking-[0.3em] font-semibold mb-2"
          >
            <Zap size={14} className="animate-pulse" />
            Browse By Category
          </div>
          <h2
            className="cat-heading font-display font-bold
            text-3xl sm:text-4xl lg:text-5xl text-light"
          >
            Find Your Perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-light">
              Device
            </span>
          </h2>
          <p className="cat-heading text-primary-400 text-sm sm:text-base max-w-xl mx-auto">
            Explore our handpicked collection across phones, laptops, tablets
            and accessories
          </p>
        </div>
      </div>

      {/* ── Bento Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-4 sm:gap-5">
          {/* Large left card - Smartphones */}
          <CategoryCard cat={categories[0]} index={0} span="large" />

          {/* Top right - Laptops (wide) */}
          <div className="sm:col-span-1 lg:col-span-2">
            <CategoryCard cat={categories[1]} index={1} span="wide" />
          </div>

          {/* Bottom right cards */}
          <CategoryCard cat={categories[2]} index={2} />
          <CategoryCard cat={categories[3]} index={3} />
        </div>
      </div>

      {/* ── Infinite Moving Brands ── */}
      <InfiniteMarquee />

      {/* ── Stats Bar ── */}
      <div className="section-padding pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "450+", label: "Products", icon: "📦" },
              { value: "20+", label: "Brands", icon: "🏆" },
              { value: "5K+", label: "Customers", icon: "🎉" },
              { value: "24/7", label: "Support", icon: "💬" },
            ].map((stat, i) => (
              <div
                key={i}
                className="cat-heading bg-dark-200 border border-dark-400
                  rounded-2xl p-4 sm:p-6 text-center
                  hover:border-accent/40 hover:bg-dark-300
                  transition-all duration-300 group"
              >
                <div
                  className="text-2xl sm:text-3xl mb-2
                  group-hover:scale-125 transition-transform duration-300"
                >
                  {stat.icon}
                </div>
                <p
                  className="font-display font-bold text-xl sm:text-2xl text-accent mb-1
                  group-hover:text-light transition-colors duration-300"
                >
                  {stat.value}
                </p>
                <p className="text-primary-500 text-[10px] sm:text-xs uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none"
      />
    </section>
  );
};

export default Categories;
