import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],

      // Add to cart
      addItem: (product, quantity = 1, selectedColor = null) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && item.color === selectedColor,
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.color === selectedColor
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                oldPrice: product.oldPrice,
                image: product.image,
                category: product.category,
                quantity,
                color: selectedColor || product.colors?.[0] || "#000000",
              },
            ],
          });
        }
      },

      // Update quantity
      updateQuantity: (id, color, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id && item.color === color
              ? { ...item, quantity }
              : item,
          ),
        });
      },

      // Remove item
      removeItem: (id, color) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.color === color),
          ),
        });
      },

      // Clear cart
      clearCart: () => set({ items: [] }),

      // ✅ FIXED: Count unique items (length), not total quantity
      getTotalItems: () => {
        return get().items.length;
      },

      // Get subtotal
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
