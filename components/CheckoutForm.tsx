'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, User, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  tenantSlug: string;
  total: number;
  onSuccess?: () => void;
  fulfillmentType: 'pickup' | 'delivery';
}

interface CheckoutFormData {
  fullName: string;
  phone: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  address?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function CheckoutForm({
  isOpen,
  onClose,
  tenantSlug,
  total,
  onSuccess,
  fulfillmentType,
}: CheckoutFormProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    address: '',
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState('');

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    handleInputChange('cardNumber', formatted.slice(0, 19));
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    handleInputChange('expiry', formatted.slice(0, 5));
  };

  const handleCvvChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    handleInputChange('cvv', cleaned.slice(0, 3));
  };

  const handleTipChange = (percentage: number) => {
    setTipPercentage(percentage);
    setCustomTip('');
  };

  const handleCustomTipChange = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, '');
    setCustomTip(cleaned);
    setTipPercentage(0);
  };

  const calculateTip = () => {
    if (customTip) {
      return parseFloat(customTip) || 0;
    }
    return (total * tipPercentage) / 100;
  };

  const finalTotal = total + calculateTip();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant': tenantSlug,
        },
        body: JSON.stringify({
          ...formData,
          fulfillment: fulfillmentType,
          total: finalTotal,
          tip: calculateTip(),
          subtotal: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSubmitStatus('idle');
        setFormData({
          fullName: '',
          phone: '',
          cardName: '',
          cardNumber: '',
          expiry: '',
          cvv: '',
          address: '',
        });
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }
  };

  const handleClose = () => {
    if (submitStatus === 'loading') return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold">{t('checkout.title')}</h2>
                <p className="text-sm text-gray-600">
                  {t('checkout.subtitle')}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={submitStatus === 'loading'}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1a76bb]" />
                    {t('checkout.contactInfo')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        {t('checkout.fullName')}
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange('fullName', e.target.value)
                        }
                        placeholder="John Doe"
                        className="mt-1.5 h-11 rounded-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        {t('checkout.phone')}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        placeholder="(555) 123-4567"
                        className="mt-1.5 h-11 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#1a76bb]" />
                    {fulfillmentType === 'pickup' ? t('checkout.pickupOrder') : t('checkout.deliveryOrder')}
                  </h3>
                  <div className="p-4 bg-[#1a76bb]/5 border-2 border-[#1a76bb] rounded-lg">
                    <p className="font-medium text-[#1a76bb]">
                      {fulfillmentType === 'pickup' ? `🏪 ${t('checkout.pickup')}` : `🚚 ${t('checkout.delivery')}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {fulfillmentType === 'pickup'
                        ? t('checkout.pickup.confirm')
                        : t('checkout.delivery.confirm')}
                    </p>
                  </div>

                  {fulfillmentType === 'delivery' && (
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        {t('checkout.deliveryAddressField')}
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        required={fulfillmentType === 'delivery'}
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        placeholder={t('checkout.deliveryAddressPlaceholder')}
                        className="mt-1.5 h-11 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#1a76bb]" />
                    {t('checkout.paymentInfo')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardName" className="text-sm font-medium">
                        {t('checkout.cardholderName')}
                      </Label>
                      <Input
                        id="cardName"
                        type="text"
                        required
                        value={formData.cardName}
                        onChange={(e) =>
                          handleInputChange('cardName', e.target.value)
                        }
                        placeholder="John Doe"
                        className="mt-1.5 h-11 rounded-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-medium">
                        {t('checkout.cardNumber')}
                      </Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        required
                        value={formData.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1.5 h-11 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry" className="text-sm font-medium">
                          {t('checkout.expiryDate')}
                        </Label>
                        <Input
                          id="expiry"
                          type="text"
                          required
                          value={formData.expiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="MM/YY"
                          className="mt-1.5 h-11 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium">
                          {t('checkout.cvv')}
                        </Label>
                        <Input
                          id="cvv"
                          type="text"
                          required
                          value={formData.cvv}
                          onChange={(e) => handleCvvChange(e.target.value)}
                          placeholder="123"
                          className="mt-1.5 h-11 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('checkout.addTip')}</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 20, 25].map((percentage) => (
                      <button
                        key={percentage}
                        type="button"
                        onClick={() => handleTipChange(percentage)}
                        className={`py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                          tipPercentage === percentage && !customTip
                            ? 'border-[#1a76bb] bg-[#1a76bb]/5 text-[#1a76bb]'
                            : 'border-gray-200 hover:border-[#1a76bb]/50'
                        }`}
                      >
                        {percentage}%
                      </button>
                    ))}
                  </div>
                  <div>
                    <Label htmlFor="customTip" className="text-sm font-medium">
                      {t('checkout.customTip')}
                    </Label>
                    <Input
                      id="customTip"
                      type="text"
                      value={customTip}
                      onChange={(e) => handleCustomTipChange(e.target.value)}
                      placeholder="0.00"
                      className="mt-1.5 h-11 rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{t('checkout.subtotal')}</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{t('checkout.tip')}</span>
                    <span className="font-medium">${calculateTip().toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{t('checkout.total')}</span>
                      <span className="font-bold text-2xl text-[#1a76bb]">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                <Button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="w-full h-12 rounded-xl bg-[#1a76bb] hover:bg-[#155a8a] text-white font-semibold text-lg disabled:opacity-50"
                >
                  {submitStatus === 'loading' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('checkout.processing')}
                    </div>
                  ) : (
                    t('checkout.pay', { amount: finalTotal.toFixed(2) })
                  )}
                </Button>
              </div>
            </form>

            <AnimatePresence>
              {(submitStatus === 'success' || submitStatus === 'error') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white flex items-center justify-center z-20"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="text-center"
                  >
                    {submitStatus === 'success' ? (
                      <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          {t('checkout.orderPlaced')}
                        </h3>
                        <p className="text-gray-600">
                          {t('checkout.thankYou')}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          {t('checkout.orderFailed')}
                        </h3>
                        <p className="text-gray-600 px-6">
                          {errorMessage || t('checkout.pleaseTryAgain')}
                        </p>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
