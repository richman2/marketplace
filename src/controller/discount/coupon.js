import { Coupon } from "../../models/coupon.js";

export const applyCoupon = async (productId, coupon_code) => {
  const coupon = await Coupon.findOne({ where: { code: coupon_code, isActive: true } });
  if (!coupon) {
    return false;
  }
  if (coupon.usedCount >= coupon.usageLimit) {
    
  }
};
