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

  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 smooth-hover";
  
  const variantClasses = {
    primary: inCart
      ? "bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl smooth-hover"
      : "bg-gradient-to-r from-[#0EA5A4] to-[#0EA5A4]/90 hover:from-[#0EA5A4]/90 hover:to-[#0EA5A4] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl smooth-hover",
    secondary: inCart
      ? "bg-[#0EA5A4]/10 text-[#0EA5A4] border-2 border-[#0EA5A4]/30 px-4 py-2 rounded-lg smooth-hover"
      : "bg-white text-[#0EA5A4] border-2 border-[#E7E2D9] hover:border-[#0EA5A4] px-4 py-2 rounded-lg hover:bg-[#FAF7F2] smooth-hover",
    small: inCart
      ? "bg-[#0EA5A4] text-white px-3 py-1.5 rounded-lg text-sm smooth-hover"
      : "bg-gradient-to-r from-[#0EA5A4] to-[#0EA5A4]/90 hover:from-[#0EA5A4]/90 hover:to-[#0EA5A4] text-white px-3 py-1.5 rounded-lg text-sm smooth-hover",
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
