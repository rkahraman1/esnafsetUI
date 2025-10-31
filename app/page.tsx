'use client';

import { useState, useEffect } from 'react';
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
  {
    id: '6',
    name: 'Product Name',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    price: 8.0,
    category: 'CATEGORY #1',
  },
];

type FulfillmentType = 'pickup' | 'delivery';

export default function Home() {
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

    toast.success('Added to cart!', {
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
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    toast.success('Order placed successfully!');
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
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a76bb] focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

        <div className="pt-4 pb-2 px-4">
          <p className="text-gray-900 text-base font-bold">
            Siparişe başlamak için bir seçenek seçiniz.
          </p>
        </div>

        {!showFullMenu && (
          <div className="pt-4 px-4">
            <div className="mb-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setFulfillmentType('pickup');
                  setIsRestaurantDialogOpen(true);
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#1a76bb] bg-[#1a76bb]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-[#1a76bb]/50 hover:shadow-md'
                }`}
              >
                <UtensilsCrossed className="w-6 h-6 mb-1 mx-auto text-[#1a76bb]" />
                <h3 className="font-semibold text-lg">Gel-Al</h3>
                <p className="text-sm text-gray-600">Siparişi restorandan kendiniz teslim alırsınız.</p>
              </button>

              <button
                onClick={() => {
                  setFulfillmentType('delivery');
                  setIsRestaurantDialogOpen(true);
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#1a76bb] bg-[#1a76bb]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-[#1a76bb]/50 hover:shadow-md'
                }`}
              >
                <div className="text-xl mb-1">🚚</div>
                <h3 className="font-semibold text-sm">Delivery</h3>
                <p className="text-[10px] text-gray-600">We'll bring it to you</p>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">

          {!showFullMenu ? (
            <div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Menu Highlights</h2>
                  <p className="text-sm text-gray-600">
                    Discover our most popular categories
                  </p>
                </div>
                <Button
                  onClick={() => setShowFullMenu(true)}
                  className="bg-[#1a76bb] hover:bg-[#155a8a] text-white rounded-xl px-4 h-10 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  Full Menu
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {MOCK_MENU_ITEMS.slice(0, 5).map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <p className="text-[#1a76bb] font-semibold text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-2">
                        <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 pb-3">
                      {cartItems.find(ci => ci.id === item.id)?.quantity ? (
                        <div className="flex items-center justify-between gap-2 bg-[#f97316] rounded-xl h-9 px-2">
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 active:scale-95"
                          >
                            <Plus className="w-4 h-4 text-white rotate-45" />
                          </button>
                          <span className="text-white font-semibold text-sm">
                            {cartItems.find(ci => ci.id === item.id)?.quantity || 0}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 active:scale-95"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleAddToCart(item.id)}
                          className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl h-9 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {fulfillmentType && (
                <Button
                  onClick={() => setShowFullMenu(true)}
                  className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  View Full Menu
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-sm">
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

              <div className="px-4 py-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-1">{selectedCategory}</h2>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {isLoading ? (
                    <>
                      <MenuItemCardSkeleton />
                      <MenuItemCardSkeleton />
                      <MenuItemCardSkeleton />
                      <MenuItemCardSkeleton />
                    </>
                  ) : (
                    filteredItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        quantity={cartItems.find(ci => ci.id === item.id)?.quantity || 0}
                        onAdd={handleAddToCart}
                        onRemove={handleRemoveFromCart}
                      />
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
            <p className="text-sm text-gray-600">Your cart</p>
            <p className="font-semibold text-base">{totalItems} items</p>
          </div>
          <Button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl px-6 h-11 font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={totalItems === 0}
          >
            View Cart
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
              toast.success('Pickup confirmed');
            } else {
              toast.success('Delivery address confirmed');
            }
          }
        }}
        fulfillmentType={fulfillmentType || 'pickup'}
        onFulfillmentTypeChange={(type) => setFulfillmentType(type)}
      />
    </div>
  );
}
