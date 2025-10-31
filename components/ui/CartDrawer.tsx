'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from './button';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClear,
  onCheckout,
}: CartDrawerProps) {
  const { t } = useI18n();
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = 8.0;
  const total = subtotal + delivery;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] flex flex-col shadow-2xl"
          >
            <div className="max-w-md mx-auto w-full flex flex-col max-h-[85vh]">
              <div className="sticky top-0 bg-white rounded-t-3xl z-10 border-b border-gray-100">
                <div className="flex items-center justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
                <div className="px-6 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{t('cart.title')}</h2>
                    <p className="text-sm text-gray-600">
                      {t('cart.yourItems', { count: items.length })}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <X className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-center">
                      {t('cart.empty')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-sm line-clamp-1">
                              {item.name}
                            </h3>
                            <p className="text-[#1a76bb] font-semibold text-sm ml-2">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <p className="text-xs text-gray-600 mb-2">
                            ${item.price.toFixed(2)}
                          </p>

                          {item.size && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-500">{t('labels.size')}</p>
                              <p className="text-xs font-medium">{item.size}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  onUpdateQuantity(
                                    item.id,
                                    Math.max(0, item.quantity - 1)
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 active:scale-90"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-semibold text-sm w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  onUpdateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 active:scale-90"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                  <div className="mb-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('summary.products')}</span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('summary.delivery')}</span>
                        <span className="font-medium">
                          ${delivery.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg">{t('checkout.total')}</span>
                          <span className="font-bold text-lg text-[#1a76bb]">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={onClear}
                      variant="outline"
                      className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                    >
                      {t('actions.clear')}
                    </Button>
                    <Button
                      onClick={onCheckout}
                      className="flex-1 h-12 rounded-xl bg-[#1a76bb] hover:bg-[#155a8a] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                      {t('actions.checkout')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
