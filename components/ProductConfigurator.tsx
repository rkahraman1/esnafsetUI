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
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">
      <div className="min-w-0">
        <div>
          <label htmlFor="size-select" className="block text-sm font-medium mb-2">
            Size
          </label>
          <Select value={selection.size} onValueChange={handleSizeChange}>
            <SelectTrigger id="size-select" className="w-full h-9 py-2 px-3">
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

        <Separator className="my-3" />

        <div>
          <h3 className="text-sm font-semibold mb-2">Add-Ons</h3>
          <div className="space-y-0 overflow-y-auto md:overflow-visible max-h-[38vh] md:max-h-none pr-1">
            {product.addOns.map((addOn, index) => (
              <label
                key={addOn.id}
                htmlFor={`addon-${addOn.id}`}
                className="flex items-center justify-between border-b last:border-b-0 py-2 min-h-[40px] cursor-pointer hover:bg-gray-50 px-1 transition-colors"
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

      <div className="min-w-0 space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          {product.description && (
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          )}
          <p className="text-lg font-semibold text-[#1a76bb] mt-1">{product.basePrice.toFixed(2)} TL</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <QuantityStepper value={selection.quantity} onChange={handleQuantityChange} />
        </div>

        <div className="rounded-xl border bg-gray-50 p-3">
          <PriceReceipt
            productPrice={baseProductPrice}
            addOnsPrice={addOnsTotal * selection.quantity}
            total={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
