import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Heart, Star, Eye, Check } from "lucide-react";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";

gsap.registerPlugin(ScrollTrigger);

const ProductCard = ({ product, index }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const [justAdded, setJustAdded] = useState(false);

  // Zustand stores
  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id),
  );

  // Check if item is already in cart
  const isInCart = cartItems.some((item) => item.id === product.id);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
        },
      },
    );
  }, [index]);

  const handleHover = () => {
    gsap.to(imageRef.current, {
      scale: 1.08,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();

    // Only add if not already in cart
    if (!isInCart) {
      addToCart(product, 1);
    }

    // Show "Added" feedback
    setJustAdded(true);

    // Success animation
    gsap.fromTo(
      `.add-cart-btn-${product.id}`,
      { scale: 0.9 },
      { scale: 1, duration: 0.3, ease: "back.out(2)" },
    );

    // Reset after 2 seconds
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  // ✅ FIXED: Create proper wishlist item with all required fields
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      // Ensure all required fields are present
      const wishlistItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        oldPrice: product.oldPrice || null,
        image: product.image,
        category: product.category,
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        stock: product.stock || 10,
        colors: product.colors || ["#000000"],
        isNew: product.isNew || false,
        discount: product.discount || 0,
        description: product.description || "",
      };
      addToWishlist(wishlistItem);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      className="group relative bg-dark-200 border border-dark-400
        rounded-2xl sm:rounded-3xl overflow-hidden
        hover:border-accent/40 transition-all duration-500
        hover:shadow-2xl hover:shadow-accent/10"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-dark-300 h-56 sm:h-64 lg:h-72">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500"
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-24
          bg-gradient-to-t from-dark-200 to-transparent"
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-dark/60 opacity-0
          group-hover:opacity-100 transition-all duration-300
          flex items-center justify-center gap-3"
        >
          <Link
            to={`/products/${product.id}`}
            className="w-11 h-11 bg-light text-dark rounded-full
              flex items-center justify-center hover:bg-accent
              transition-all duration-300 translate-y-4
              group-hover:translate-y-0 hover:scale-110 active:scale-95"
          >
            <Eye size={17} />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`w-11 h-11 rounded-full
              flex items-center justify-center
              transition-all duration-300 translate-y-4
              group-hover:translate-y-0 hover:scale-110 active:scale-95
              ${
                isInCart && !justAdded
                  ? "bg-green-500 text-white cursor-default"
                  : justAdded
                    ? "bg-green-500 text-white"
                    : "bg-light text-dark hover:bg-accent"
              }`}
            style={{ transitionDelay: "50ms" }}
          >
            {isInCart || justAdded ? (
              <Check size={17} />
            ) : (
              <ShoppingCart size={17} />
            )}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span
              className="bg-accent text-dark text-[9px] font-bold
              px-2.5 py-1 rounded-full uppercase tracking-widest"
            >
              New
            </span>
          )}
          {product.discount > 0 && (
            <span
              className="bg-dark/70 backdrop-blur-sm text-accent
              text-[9px] font-bold px-2.5 py-1 rounded-full
              border border-accent/40"
            >
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full
            backdrop-blur-md border flex items-center justify-center
            transition-all duration-300 hover:scale-110 active:scale-95
            ${
              isInWishlist
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "bg-dark/60 border-white/20 text-white/60 hover:text-red-400"
            }`}
        >
          <Heart size={14} className={isInWishlist ? "fill-red-400" : ""} />
        </button>

        {/* Stock */}
        {product.stock && product.stock <= 10 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div
              className="bg-dark/80 backdrop-blur-sm rounded-full
              px-3 py-1.5 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-[10px] font-medium">
                Only {product.stock} left
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span
            className="text-accent text-[10px] sm:text-xs font-semibold
            uppercase tracking-widest"
          >
            {product.brand}
          </span>
          <span className="text-primary-600 text-[10px] sm:text-xs">
            {product.category === "mobile" ? "📱" : "💻"}
          </span>
        </div>

        <h3
          className="text-light font-semibold text-sm sm:text-base
          leading-snug line-clamp-2 min-h-[40px]"
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(product.rating || 4.5)
                    ? "text-accent fill-accent"
                    : "text-dark-400"
                }
              />
            ))}
          </div>
          <span className="text-primary-400 text-[10px] sm:text-xs">
            ({product.reviews || 0})
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-dark-400">
          <div>
            <span className="font-bold text-light text-base sm:text-lg block leading-none">
              ${product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-primary-600 text-xs line-through mt-1 block">
                ${product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`add-cart-btn-${product.id} text-xs font-bold
              uppercase tracking-wider px-4 py-2.5 rounded-full
              transition-all duration-300
              hover:shadow-lg hover:shadow-accent/30
              hover:scale-105 active:scale-95 flex items-center gap-1.5
              ${
                isInCart && !justAdded
                  ? "bg-green-500 text-white cursor-default"
                  : justAdded
                    ? "bg-green-500 text-white"
                    : "bg-accent text-dark hover:bg-light"
              }`}
          >
            {isInCart || justAdded ? (
              <>
                <Check size={13} />
                {justAdded ? "Added!" : "In Cart"}
              </>
            ) : (
              <>
                <ShoppingCart size={13} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
