'use client';

import { Money } from '@/types/product';

interface PriceReceiptProps {
  productPrice: Money;
  addOnsPrice: Money;
  total: Money;
}

export function PriceReceipt({ productPrice, addOnsPrice, total }: PriceReceiptProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Product</span>
        <span className="font-medium">{productPrice.toFixed(2)} TL</span>
      </div>
      {addOnsPrice > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Add-Ons</span>
          <span className="font-medium">{addOnsPrice.toFixed(2)} TL</span>
        </div>
      )}
      <div className="pt-2 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-[#1a76bb]">{total.toFixed(2)} TL</span>
        </div>
      </div>
    </div>
  );
}
