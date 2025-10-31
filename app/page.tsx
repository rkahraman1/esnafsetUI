'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { ShoppingCart, Search, User, X, Plus, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItemCard, MenuItemCardSkeleton } from '@/components/ui/MenuItemCard';
import { CartDrawer, CartItem } from '@/components/ui/CartDrawer';
import { CheckoutForm } from '@/components/CheckoutForm';
import { RestaurantConfirmDialog } from '@/components/RestaurantConfirmDialog';
import { toast } from 'sonner';

const CATEGORIES = [
  'CATEGORY #1',
  'CATEGORY #2',
  'CATEGORY #3',
  'CATEGORY #4',
  'CATEGORY #5',
  'CATEGORY #6',
  'CATEGORY #7',
  'CATEGORY #8',
];

const MOCK_MENU_ITEMS = [
  {
    id: '1',
    name: 'Product Name',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    price: 8.0,
    category: 'CATEGORY #1',
  },
  {
    id: '2',
    name: 'Product Name',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    price: 8.0,
    category: 'CATEGORY #1',
  },
  {
    id: '3',
    name: 'Product Name',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    price: 8.0,
    category: 'CATEGORY #1',
  },
  {
    id: '4',
    name: 'Product Name',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    price: 8.0,
    category: 'CATEGORY #1',
  },
  {
    id: '5',
    name: 'Product Name',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    price: 8.0,
    category: 'CATEGORY #1',
  },
];

type FulfillmentType = 'pickup' | 'delivery';

export default function Home() {
  const { t, tp } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType | null>(null);
  const [isRestaurantDialogOpen, setIsRestaurantDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (itemId: string) => {
    const menuItem = MOCK_MENU_ITEMS.find((item) => item.id === itemId);
    if (!menuItem) return;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          size: 'Regular',
        },
      ];
    });

    toast.success(t('toast.addedToCart'), {
      duration: 2000,
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId);
      if (!existingItem) return prev;

      if (existingItem.quantity === 1) {
        return prev.filter((item) => item.id !== itemId);
      }

      return prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.success(t('toast.cartCleared'));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    toast.success(t('toast.orderSuccess'));
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartDelivery = 8.0;
  const cartTotal = cartSubtotal + cartDelivery;

  const filteredItems = MOCK_MENU_ITEMS.filter((item) => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <nav className="bg-[#1a76bb] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-full px-6 h-[114px] flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setShowFullMenu(false)}
              className="hover:opacity-80 transition-all duration-200 active:scale-95"
            >
              <h1 className="text-4xl font-bold tracking-wide">EsnafSet</h1>
            </button>
          </div>

          <div className="flex items-center gap-5 absolute right-6">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:opacity-80 transition-all duration-200 active:scale-95"
            >
              <Search className="w-8 h-8" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:opacity-80 transition-all duration-200 active:scale-95 relative"
            >
              <ShoppingCart className="w-8 h-8" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-sm w-7 h-7 rounded-full flex items-center justify-center font-semibold shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="sticky top-[114px] z-40 bg-white border-b border-gray-200 shadow-md">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a76bb] focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="relative h-48 w-full px-4 py-2">
          <div className="w-full h-full overflow-hidden rounded-2xl">
          <img
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Restaurant banner - delicious food spread"
            className="w-full h-full object-cover"
          />
          </div>
        </div>

        {!showFullMenu && (
          <div className="pt-4 pb-2 px-4">
            <p className="text-gray-900 text-base font-bold">
              {t('hero.chooseMethod')}
            </p>
          </div>
        )}

        {!showFullMenu && (
          <div className="pt-4 px-4">
            <div className="mx-auto max-w-[1120px] w-full">
              <div className="flex gap-4 mb-5">
                <button
                  onClick={() => {
                    setFulfillmentType('pickup');
                    setIsRestaurantDialogOpen(true);
                  }}
                  className="flex-1 rounded-2xl border px-4 py-3 text-lg font-semibold bg-[#1a76bb] text-white border-[#1a76bb] transition-all duration-200 hover:shadow-md"
                >
                  <div>{t('checkout.pickup')}</div>
                  <div className="text-xs font-normal">{t('checkout.pickup.sub')}</div>
                </button>

                <button
                  onClick={() => {
                    setFulfillmentType('delivery');
                    setIsRestaurantDialogOpen(true);
                  }}
                  className="flex-1 rounded-2xl border px-4 py-3 text-lg font-semibold bg-[#1a76bb] text-white border-[#1a76bb] transition-all duration-200 hover:shadow-md"
                >
                  <div>{t('checkout.delivery')}</div>
                  <div className="text-xs font-normal">{t('checkout.delivery.sub')}</div>
                </button>
              </div>

              <div className="w-full rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4">
                <h3 className="mb-3 text-xl font-semibold text-blue-900">
                  {t('lists.mostLiked')}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {MOCK_MENU_ITEMS.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >
                      <div className="grid h-28 place-items-center bg-gray-100">
                        <span className="text-xs text-gray-500">{t('search.noImage')}</span>
                      </div>

                      <div className="border-t border-blue-200 bg-blue-50/70 px-3 py-2">
                        <p className="text-sm font-semibold leading-tight text-blue-700">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">

          {!showFullMenu ? (
            <div>

              {fulfillmentType && (
                <div className="px-4">
                  <Button
                    onClick={() => setShowFullMenu(true)}
                    className="w-full bg-[#1a76bb] hover:bg-[#155a91] text-white rounded-xl h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    {t('menu.viewFull')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0 transition-all duration-200 active:scale-95"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        selectedCategory === category
                          ? 'bg-[#1a76bb] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                  </div>
                </div>
              </div>

              <div className="px-4 py-6">
                <div className="mb-6 flex items-baseline">
                  <h1 className="text-3xl md:text-4xl font-bold">{selectedCategory}</h1>
                  <p className="text-sm text-muted-foreground ml-3">
                    {filteredItems.length} items
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {isLoading ? (
                    <>
                      <MenuItemCardSkeleton />
                      <MenuItemCardSkeleton />
                      <MenuItemCardSkeleton />
                      <MenuItemCardSkeleton />
                    </>
                  ) : (
                    filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-neutral-100/70 shadow-sm border border-neutral-200 p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                          <p className="text-[#2759C9] font-semibold mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="ml-auto h-20 w-20 rounded-xl bg-neutral-300 grid place-items-center text-xs text-neutral-600 flex-shrink-0">
                          {t('search.noImage')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto px-4 h-18 flex items-center justify-between py-4">
          <div>
            <p className="text-sm text-gray-600">{t('cart.yourCart')}</p>
            <p className="font-semibold text-base">{totalItems} {tp('cart.items', totalItems)}</p>
          </div>
          <Button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl px-6 h-11 font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={totalItems === 0}
          >
            {t('actions.viewCart')}
          </Button>
        </div>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClear={handleClearCart}
        onCheckout={() => {
          if (!fulfillmentType) {
            setIsCartOpen(false);
            setIsRestaurantDialogOpen(true);
          } else {
            handleCheckout();
          }
        }}
      />

      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tenantSlug="esnafset"
        total={cartTotal}
        onSuccess={handleCheckoutSuccess}
        fulfillmentType={fulfillmentType || 'pickup'}
      />

      <RestaurantConfirmDialog
        isOpen={isRestaurantDialogOpen}
        onClose={() => {
          setIsRestaurantDialogOpen(false);
        }}
        onConfirm={() => {
          if (!fulfillmentType) {
            return;
          }
          setIsRestaurantDialogOpen(false);
          if (cartItems.length > 0) {
            handleCheckout();
          } else {
            if (fulfillmentType === 'pickup') {
              toast.success(t('toast.pickupConfirmed'));
            } else {
              toast.success(t('toast.deliveryConfirmed'));
            }
          }
        }}
        fulfillmentType={fulfillmentType || 'pickup'}
        onFulfillmentTypeChange={(type) => setFulfillmentType(type)}
      />
    </div>
  );
}
