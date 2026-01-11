"use client";

import { useCart, type CartItem } from "@/contexts/CartContext";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartButtonProps {
  item: Omit<CartItem, "addedAt">;
  className?: string;
  variant?: "primary" | "secondary" | "small";
}

export default function AddToCartButton({ 
  item, 
  className = "", 
  variant = "primary" 
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart) {
      addToCart(item);
    }
  };

  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200";
  
  const variantClasses = {
    primary: inCart
      ? "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg"
      : "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl",
    secondary: inCart
      ? "bg-green-100 text-green-700 border-2 border-green-300 px-4 py-2 rounded-lg"
      : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 px-4 py-2 rounded-lg hover:bg-blue-50",
    small: inCart
      ? "bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm"
      : "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm",
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={inCart}
    >
      {inCart ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
