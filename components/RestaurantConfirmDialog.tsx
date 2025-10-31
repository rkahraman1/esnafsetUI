'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, Phone } from 'lucide-react';

interface RestaurantConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fulfillmentType: 'pickup' | 'delivery';
  onFulfillmentTypeChange?: (type: 'pickup' | 'delivery') => void;
}

const RESTAURANT_INFO = {
  name: 'EsnafSet Restaurant',
  address: '123 Main Street, Downtown',
  city: 'New York, NY 10001',
  phone: '+1 (555) 123-4567',
  hours: 'Mon-Sun: 10:00 AM - 10:00 PM',
};

export function RestaurantConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  fulfillmentType,
  onFulfillmentTypeChange,
}: RestaurantConfirmDialogProps) {
  const { t } = useI18n();
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });

  const handleConfirmDelivery = () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zip) {
      return;
    }
    onConfirm();
  };

  const handleClose = () => {
    setDeliveryAddress({
      street: '',
      city: '',
      state: '',
      zip: '',
      notes: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {fulfillmentType === 'pickup' ? t('location.confirmTitle') : t('location.deliveryAddress')}
          </DialogTitle>
        </DialogHeader>

        {onFulfillmentTypeChange && (
          <div className="mb-2 grid grid-cols-2 gap-3">
            <button
              onClick={() => onFulfillmentTypeChange('pickup')}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                fulfillmentType === 'pickup'
                  ? 'border-[#1a76bb] bg-[#1a76bb]/5 shadow-md'
                  : 'border-gray-200 bg-white hover:border-[#1a76bb]/50'
              }`}
            >
              <div className="text-xl mb-1">🏪</div>
              <h3 className="font-semibold text-sm">{t('checkout.pickup')}</h3>
            </button>

            <button
              onClick={() => onFulfillmentTypeChange('delivery')}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                fulfillmentType === 'delivery'
                  ? 'border-[#1a76bb] bg-[#1a76bb]/5 shadow-md'
                  : 'border-gray-200 bg-white hover:border-[#1a76bb]/50'
              }`}
            >
              <div className="text-xl mb-1">🚚</div>
              <h3 className="font-semibold text-sm">{t('checkout.delivery')}</h3>
            </button>
          </div>
        )}

        {fulfillmentType === 'pickup' ? (
          <>
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-lg">{RESTAURANT_INFO.name}</h3>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1a76bb] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-900">{RESTAURANT_INFO.address}</p>
                    <p className="text-gray-600">{RESTAURANT_INFO.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#1a76bb] flex-shrink-0" />
                  <p className="text-sm text-gray-700">{RESTAURANT_INFO.hours}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#1a76bb] flex-shrink-0" />
                  <p className="text-sm text-gray-700">{RESTAURANT_INFO.phone}</p>
                </div>
              </div>

              <div className="bg-[#1a76bb]/5 border border-[#1a76bb]/20 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{t('checkout.pickup')}:</span> {t('checkout.pickup.confirm')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 rounded-xl h-11"
              >
                {t('actions.cancel')}
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-[#1a76bb] hover:bg-[#155a94] text-white rounded-xl h-11 font-semibold"
              >
                {t('actions.confirm')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="street">{t('checkout.streetAddress')}</Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">{t('checkout.city')}</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">{t('checkout.state')}</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">{t('checkout.zip')}</Label>
                <Input
                  id="zip"
                  placeholder="10001"
                  value={deliveryAddress.zip}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zip: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t('checkout.deliveryNotes')}</Label>
                <Input
                  id="notes"
                  placeholder={t('checkout.deliveryNotesPlaceholder')}
                  value={deliveryAddress.notes}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, notes: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 rounded-xl h-11"
              >
                {t('actions.cancel')}
              </Button>
              <Button
                onClick={handleConfirmDelivery}
                disabled={!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zip}
                className="flex-1 bg-[#1a76bb] hover:bg-[#155a94] text-white rounded-xl h-11 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('actions.confirm')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
