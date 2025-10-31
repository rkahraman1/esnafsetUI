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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setShowFullMenu(false)}
            className="hover:opacity-80 transition-all duration-200 active:scale-95"
          >
            <h1 className="text-2xl font-bold text-gray-900">EsnafSet</h1>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95 relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a76bb] focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="relative h-48 bg-gray-200 flex items-center justify-center w-full overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Restaurant banner"
          className="w-full h-full object-cover"
        />
      </div>

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-md mx-auto">
          {!showFullMenu ? (
            <div className="px-4 py-6">
              {/* Start an order section */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start an order</h2>
                <button
                  onClick={() => setShowFullMenu(true)}
                  className="flex items-center gap-2 text-[#1a76bb] hover:text-[#155a94] transition-colors"
                >
                  <span>View menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Pickup/Delivery Options */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setFulfillmentType('pickup');
                    setIsRestaurantDialogOpen(true);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    fulfillmentType === 'pickup'
                      ? 'border-[#1a76bb] bg-[#1a76bb]/5 shadow-md'
                      : 'border-gray-200 bg-white hover:border-[#1a76bb]/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-2xl mb-2">🏪</div>
                    <h3 className="font-semibold text-gray-900">Pickup</h3>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setFulfillmentType('delivery');
                    setIsRestaurantDialogOpen(true);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    fulfillmentType === 'delivery'
                      ? 'border-[#1a76bb] bg-[#1a76bb]/5 shadow-md'
                      : 'border-gray-200 bg-white hover:border-[#1a76bb]/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-2xl mb-2">🚚</div>
                    <h3 className="font-semibold text-gray-900">Delivery</h3>
                  </div>
                </button>
              </div>

              {/* Menu highlights */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Menu highlights</h2>
                <p className="text-gray-600 mb-4">Here are some other items you might enjoy</p>
                
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                  {MOCK_MENU_ITEMS.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-40">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h3>
                          <p className="text-[#1a76bb] font-bold text-sm">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {fulfillmentType && (
                <Button
                  onClick={() => setShowFullMenu(true)}
                  className="w-full bg-[#1a76bb] hover:bg-[#155a94] text-white rounded-xl h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  View Full Menu
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
                <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0 transition-all duration-200 active:scale-95"
                  >
                    <Search className="w-4 h-4 text-gray-600" />
                  </button>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedCategory}</h2>
                  <p className="text-gray-600">
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
                      <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                        <div className="flex gap-4 p-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">{item.name}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-[#1a76bb] font-bold text-lg">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-3">
                            <div className="w-20 h-20 rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {cartItems.find(ci => ci.id === item.id)?.quantity ? (
                              <div className="flex items-center justify-between gap-2 bg-[#f97316] rounded-lg h-8 px-2">
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="w-5 h-5 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded text-white transition-all duration-200 active:scale-95"
                                >
                                  <Plus className="w-3 h-3 rotate-45" />
                                </button>
                                <span className="text-white font-semibold text-sm min-w-[16px] text-center">
                                  {cartItems.find(ci => ci.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => handleAddToCart(item.id)}
                                  className="w-5 h-5 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded text-white transition-all duration-200 active:scale-95"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleAddToCart(item.id)}
                                className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg h-8 px-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                              >
                                <Plus className="w-3 h-3 mr-1" />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Your cart</p>
            <p className="font-semibold text-gray-900">{totalItems} items</p>
          </div>
          <Button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#1a76bb] hover:bg-[#155a94] text-white rounded-lg px-6 h-10 font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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