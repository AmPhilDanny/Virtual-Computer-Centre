export interface PricingInput {
  basePrice: number;
  priority: 'NORMAL' | 'EXPRESS';
  expressMultiplier: number;
  coupon?: {
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minAmount?: number;
  } | null;
}

export interface PricingBreakdown {
  subtotal: number;
  priorityFee: number;
  discount: number;
  total: number;
}

export function calculateOrderTotal(input: PricingInput): PricingBreakdown {
  const { basePrice, priority, expressMultiplier, coupon } = input;
  
  // 1. Calculate Priority Fee
  const subtotal = basePrice;
  const isExpress = priority === 'EXPRESS';
  const priorityFee = isExpress ? (basePrice * (expressMultiplier - 1)) : 0;
  
  const targetForDiscount = subtotal + priorityFee;
  let discount = 0;

  // 2. Apply Coupon
  if (coupon) {
    // Check min amount
    if (!coupon.minAmount || targetForDiscount >= coupon.minAmount) {
      if (coupon.discountType === 'PERCENTAGE') {
        discount = targetForDiscount * (coupon.discountValue / 100);
      } else {
        discount = coupon.discountValue;
      }
    }
  }

  // 3. Ensure discount doesn't exceed total
  discount = Math.min(discount, targetForDiscount);

  return {
    subtotal,
    priorityFee,
    discount: Math.round(discount * 100) / 100,
    total: Math.round((targetForDiscount - discount) * 100) / 100
  };
}
