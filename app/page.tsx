'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, X, Plus, ArrowRight } from 'lucide-react';
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
    name: 'Hummus',
    description: 'Creamy chickpea dip served with warm pita bread and olive oil drizzle',
    price: 11.0,
    category: 'CATEGORY #1',
    image: 'https://images.pexels.com/photos/6107787/pexels-photo-6107787.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'Lamb Kavourma',
    description: 'Traditional slow-cooked lamb with aromatic spices and herbs',
    price: 29.0,
    category: 'CATEGORY #1',
    image: 'https://images.pexels.com/photos/5737241/pexels-photo-5737241.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'Greek Salad',
    description: 'Fresh tomatoes, cucumbers, olives, and feta cheese with olive oil',
    price: 14.0,
    category: 'CATEGORY #1',
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    name: 'Shish Kebab Chicken',
    description: 'Grilled chicken skewers with rice and roasted vegetables',
    price: 25.0,
    category: 'CATEGORY #1',
    image: 'https://images.pexels.com/photos/5737241/pexels-photo-5737241.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    name: 'Lamb Chops',
    description: 'Perfectly grilled lamb chops with seasonal vegetables',
    price: 29.0,
    category: 'CATEGORY #1',
    image: 'https://images.pexels.com/photos/299347/pexels-photo-299347.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '6',
    name: 'Lamb Shank',
    description: 'Slow-braised lamb shank with rich gravy and vegetables',
    price: 30.0,
    category: 'CATEGORY #1',
    image: 'https://images.pexels.com/photos/5737241/pexels-photo-5737241.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    <div className="flex flex-col h-screen bg-[#4a5d4a]">
      {/* Header */}
      <nav className="bg-[#4a5d4a] text-white sticky top-0 z-50">
        <div className="max-w-full px-6 h-[80px] flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setShowFullMenu(false)}
              className="hover:opacity-80 transition-all duration-200 active:scale-95"
            >
              <h1 className="text-3xl font-bold tracking-wide">EsnafSet</h1>
            </button>
          </div>

          <div className="flex items-center gap-4 absolute right-6">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:opacity-80 transition-all duration-200 active:scale-95"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:opacity-80 transition-all duration-200 active:scale-95 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-semibold shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="sticky top-[80px] z-40 bg-[#4a5d4a] border-b border-white/10">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-white placeholder-white/60"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-md mx-auto">
          {!showFullMenu ? (
            <div className="px-6 py-8">
              {/* Start an order section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Start an order</h2>
                <button
                  onClick={() => setShowFullMenu(true)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <span className="text-lg">View menu</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Pickup/Delivery Options */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setFulfillmentType('pickup');
                    setIsRestaurantDialogOpen(true);
                  }}
                  className={`p-6 rounded-2xl transition-all duration-200 ${
                    fulfillmentType === 'pickup'
                      ? 'bg-white/20 border-2 border-white/30'
                      : 'bg-white/10 border-2 border-white/20 hover:bg-white/15'
                  }`}
                >
                  <div className="text-left">
                    <div className="w-8 h-8 mb-3 text-white">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-1">Pickup</h3>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setFulfillmentType('delivery');
                    setIsRestaurantDialogOpen(true);
                  }}
                  className={`p-6 rounded-2xl transition-all duration-200 ${
                    fulfillmentType === 'delivery'
                      ? 'bg-white/20 border-2 border-white/30'
                      : 'bg-white/10 border-2 border-white/20 hover:bg-white/15'
                  }`}
                >
                  <div className="text-left">
                    <div className="w-8 h-8 mb-3 text-white">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                        <path d="M5 6h5v2H5zm11.5 1c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S17.33 7 16.5 7z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-1">Delivery</h3>
                  </div>
                </button>
              </div>

              {/* Menu highlights */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Menu highlights</h2>
                <p className="text-white/80 mb-6">Here are some other items you might enjoy</p>
                
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                  {MOCK_MENU_ITEMS.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-48">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-white text-lg mb-1">{item.name}</h3>
                          <p className="text-white font-bold text-lg">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {fulfillmentType && (
                <Button
                  onClick={() => setShowFullMenu(true)}
                  className="w-full bg-white text-[#4a5d4a] hover:bg-white/90 rounded-2xl h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  View Full Menu
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="sticky top-0 bg-[#4a5d4a] border-b border-white/10 z-30">
                <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 hover:bg-white/10 rounded-full flex-shrink-0 transition-all duration-200 active:scale-95"
                  >
                    <Search className="w-5 h-5 text-white" />
                  </button>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        selectedCategory === category
                          ? 'bg-white text-[#4a5d4a] shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 py-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedCategory}</h2>
                  <p className="text-white/80">
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
                      <div key={item.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
                        <div className="flex gap-4 p-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-lg mb-2 line-clamp-1">{item.name}</h3>
                            <p className="text-white/80 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-white font-bold text-lg">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-3">
                            <div className="w-24 h-24 rounded-xl overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {cartItems.find(ci => ci.id === item.id)?.quantity ? (
                              <div className="flex items-center justify-between gap-2 bg-[#f97316] rounded-xl h-10 px-3">
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="w-6 h-6 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 active:scale-95"
                                >
                                  <Plus className="w-3 h-3 text-white rotate-45" />
                                </button>
                                <span className="text-white font-semibold text-sm min-w-[20px] text-center">
                                  {cartItems.find(ci => ci.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => handleAddToCart(item.id)}
                                  className="w-6 h-6 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 active:scale-95"
                                >
                                  <Plus className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleAddToCart(item.id)}
                                className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl h-10 px-4 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
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

      {/* Bottom Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#4a5d4a] border-t border-white/10 z-40">
        <div className="max-w-md mx-auto px-4 h-18 flex items-center justify-between py-4">
          <div>
            <p className="text-white/80 text-sm">Your cart</p>
            <p className="font-semibold text-white text-base">{totalItems} items</p>
          </div>
          <Button
            onClick={() => setIsCartOpen(true)}
            className="bg-white text-[#4a5d4a] hover:bg-white/90 rounded-xl px-6 h-11 font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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