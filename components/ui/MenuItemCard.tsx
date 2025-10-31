'use client';

import { Plus } from 'lucide-react';
import { Button } from './button';

interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  quantity?: number;
  onAdd: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function MenuItemCard({
  id,
  name,
  description,
  price,
  image,
  quantity = 0,
  onAdd,
  onRemove,
}: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex gap-3 p-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{name}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {description}
          </p>
          <p className="text-[#1a76bb] font-semibold text-sm">
            ${price.toFixed(2)}
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        {quantity === 0 ? (
          <Button
            onClick={() => onAdd(id)}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl h-9 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-2 bg-[#f97316] rounded-xl h-9 px-2">
            <button
              onClick={() => onRemove?.(id)}
              className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 text-white rotate-45" />
            </button>
            <span className="text-white font-semibold text-sm">{quantity}</span>
            <button
              onClick={() => onAdd(id)}
              className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MenuItemCardSkeleton() {
  return (
    <div className="rounded-xl bg-neutral-100/70 shadow-sm border border-neutral-200 p-4 flex items-center gap-4">
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-full"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-2/3"></div>
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-1/4 mt-1"></div>
      </div>
      <div className="ml-auto h-20 w-20 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] flex-shrink-0"></div>
    </div>
  );
}
