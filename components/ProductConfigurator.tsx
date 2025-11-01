'use client';

import { useState } from 'react';
import { ProductDetail, SelectionState, computeLinePrice, computeUnitPrice, computeAddOnsTotal } from '@/types/product';
import { QuantityStepper } from './QuantityStepper';
import { PriceReceipt } from './PriceReceipt';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductConfiguratorProps {
  product: ProductDetail;
  initialSelection?: Partial<SelectionState>;
  onSelectionChange?: (selection: SelectionState) => void;
}

export function ProductConfigurator({
  product,
  initialSelection,
  onSelectionChange
}: ProductConfiguratorProps) {
  const [selection, setSelection] = useState<SelectionState>({
    size: initialSelection?.size ?? product.sizes[0].id,
    quantity: initialSelection?.quantity ?? 1,
    addOns: initialSelection?.addOns ?? new Set(),
  });

  const updateSelection = (updates: Partial<SelectionState>) => {
    const newSelection = { ...selection, ...updates };
    setSelection(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSizeChange = (sizeId: string) => {
    updateSelection({ size: sizeId as SelectionState['size'] });
  };

  const handleQuantityChange = (quantity: number) => {
    updateSelection({ quantity });
  };

  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    const newAddOns = new Set(selection.addOns);
    if (checked) {
      newAddOns.add(addOnId);
    } else {
      newAddOns.delete(addOnId);
    }
    updateSelection({ addOns: newAddOns });
  };

  const unitPrice = computeUnitPrice(product, selection);
  const addOnsTotal = computeAddOnsTotal(product, selection);
  const totalPrice = computeLinePrice(product, selection);
  const baseProductPrice = (product.basePrice + (product.sizes.find(s => s.id === selection.size)?.delta ?? 0)) * selection.quantity;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold leading-tight">{product.name}</h2>
        {product.description && (
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        )}
        <div className="mt-1 text-lg font-semibold text-[#1a76bb]">{product.basePrice.toFixed(2)} TL</div>
      </div>

      <div>
        <label htmlFor="size-select" className="block text-sm font-medium mb-1">
          Size
        </label>
        <Select value={selection.size} onValueChange={handleSizeChange}>
          <SelectTrigger id="size-select" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {product.sizes.map((size) => (
              <SelectItem key={size.id} value={size.id}>
                {size.name}
                {size.delta > 0 && ` (+${size.delta.toFixed(2)} TL)`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Add-Ons</h4>
        <div className="divide-y rounded-xl border">
          <div className="max-h-[220px] overflow-y-auto">
            {product.addOns.map((addOn) => (
              <label
                key={addOn.id}
                htmlFor={`addon-${addOn.id}`}
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`addon-${addOn.id}`}
                    checked={selection.addOns.has(addOn.id)}
                    onCheckedChange={(checked) => handleAddOnToggle(addOn.id, checked as boolean)}
                    className="data-[state=checked]:bg-[#1a76bb] data-[state=checked]:border-[#1a76bb]"
                  />
                  <span className="text-sm">{addOn.name}</span>
                </div>
                <span className="text-sm text-gray-700">{addOn.price.toFixed(2)} TL</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => selection.quantity > 1 && handleQuantityChange(selection.quantity - 1)}
              disabled={selection.quantity <= 1}
              className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center font-medium">{selection.quantity}</span>
            <button
              onClick={() => handleQuantityChange(selection.quantity + 1)}
              className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-3 self-end min-w-[240px]">
          <div className="flex justify-between text-sm">
            <span>Product</span>
            <span>{baseProductPrice.toFixed(2)} TL</span>
          </div>
          {addOnsTotal * selection.quantity > 0 && (
            <div className="mt-1 flex justify-between text-sm">
              <span>Add-Ons</span>
              <span>{(addOnsTotal * selection.quantity).toFixed(2)} TL</span>
            </div>
          )}
          <div className="mt-2 border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-[#1a76bb]">{totalPrice.toFixed(2)} TL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
