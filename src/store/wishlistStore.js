import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],

      // Add item to wishlist
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        // Don't add if already in wishlist
        if (existingItem) return;

        set({
          items: [
            ...items,
            {
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
              colors: product.colors || [],
              isNew: product.isNew || false,
              discount: product.discount || 0,
              description: product.description || "",
              addedAt: new Date().toISOString(),
            },
          ],
        });
      },

      // Remove item from wishlist
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      // Toggle item in wishlist (add if not present, remove if present)
      toggleItem: (product) => {
        const isInWishlist = get().isInWishlist(product.id);
        if (isInWishlist) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      // Clear entire wishlist
      clearWishlist: () => set({ items: [] }),

      // Check if item is in wishlist
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      // Get total unique items count (for navbar badge)
      getTotalItems: () => {
        return get().items.length;
      },

      // Move item to cart (removes from wishlist)
      moveToCart: (id, addToCartFn, selectedColor = null) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        // Add to cart using the cart store's addItem function
        addToCartFn(item, 1, selectedColor || item.colors?.[0] || "#000000");

        // Remove from wishlist
        get().removeItem(id);
      },

      // Move all wishlist items to cart
      moveAllToCart: (addToCartFn) => {
        const items = get().items;
        items.forEach((item) => {
          addToCartFn(item, 1, item.colors?.[0] || "#000000");
        });
        // Clear wishlist after moving all
        set({ items: [] });
      },
    }),
    {
      name: "wishlist-storage", // localStorage key
    },
  ),
);

export default useWishlistStore;
