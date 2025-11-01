'use client';

import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { ProductDetail, SelectionState, OrderItem, computeLinePrice, computeUnitPrice } from '@/types/product';
import { ProductConfigurator } from './ProductConfigurator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductSheetProps {
  product: ProductDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: OrderItem) => void;
}

export function ProductSheet({ product, isOpen, onClose, onAddToCart }: ProductSheetProps) {
  const [selection, setSelection] = useState<SelectionState>({
    size: 'regular',
    quantity: 1,
    addOns: new Set(),
  });

  const configuratorRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTimeout(() => {
        setSelection({
          size: 'regular',
          quantity: 1,
          addOns: new Set(),
        });
      }, 300);
    }
  };

  const handleAddToOrder = () => {
    if (!product) return;

    const unitPrice = computeUnitPrice(product, selection);
    const totalPrice = computeLinePrice(product, selection);

    const orderItem: OrderItem = {
      productId: product.id,
      size: selection.size,
      addOns: Array.from(selection.addOns),
      quantity: selection.quantity,
      unitPrice,
      totalPrice,
    };

    onAddToCart(orderItem);
    onClose();

    setTimeout(() => {
      setSelection({
        size: 'regular',
        quantity: 1,
        addOns: new Set(),
      });
    }, 300);
  };

  const handleSelectionChange = (newSelection: SelectionState) => {
    setSelection(newSelection);
  };

  if (!product) return null;

  const totalPrice = computeLinePrice(product, selection);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-3xl p-0 flex flex-col overflow-hidden md:max-w-[920px] md:w-[92vw] md:mx-auto md:h-auto md:max-h-[82vh] md:rounded-2xl"
      >
        <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col">
          <div
            className="h-36 md:h-40 w-full bg-gray-100 rounded-t-3xl md:rounded-t-2xl bg-cover bg-center flex items-center justify-center text-gray-500 text-lg bg-gradient-to-br from-gray-100 to-gray-200"
            style={product.imageUrl ? { backgroundImage: `url(${product.imageUrl})` } : {}}
          >
            {!product.imageUrl && 'banner'}
          </div>

          <SheetHeader className="sr-only">
            <SheetTitle>{product.name}</SheetTitle>
          </SheetHeader>

          <div className="p-5 flex-1 overflow-y-auto md:overflow-hidden" ref={configuratorRef}>
            <ProductConfigurator
              product={product}
              initialSelection={selection}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white">
          <div className="mx-auto flex w-full max-w-[900px] items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
              <span className="font-semibold text-sm">Cancel</span>
            </Button>
            <Button
              onClick={handleAddToOrder}
              className="flex-1 bg-[#1a76bb] hover:bg-[#155a91] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Add to order <span className="ml-2">{totalPrice.toFixed(2)} TL</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
