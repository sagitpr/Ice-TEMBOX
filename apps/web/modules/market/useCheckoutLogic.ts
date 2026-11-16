import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MARKET_PRODUCTS } from './market.data';
import type { ProductItem, CartItem, ShippingAddress, PaymentMethodType, OrderResult } from './market.types';
import { calculateShipping, createDokuOrder } from './market.service';

interface AuthSessionUser {
  userId: string;
  name: string;
  email: string;
  token?: string;
}

export function useCheckoutLogic(initialProductId: string = 'pro') {
  const router = useRouter();

  // Find selected product
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId);
  const [quantity, setQuantity] = useState<number>(1);

  // Address State: ALL fields start completely empty
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    province: '',
    postalCode: '',
    streetAddress: '',
    harborOrTpi: '',
  });

  // Shipping Cost State
  const [shippingCost, setShippingCost] = useState<number>(25000);
  const [calculatingShipping, setCalculatingShipping] = useState<boolean>(false);

  // Payment Method State - DOKU Checkout
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('doku');
  const [notes, setNotes] = useState<string>('');

  // Processing State
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string>('');
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  // Auth Guard State: Defaults to false; requires real active session
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);

  // Strict Auth Guard on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedAuth = localStorage.getItem('tembox_auth_session');
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth) as AuthSessionUser;
          if (parsed && (parsed.userId || parsed.email || parsed.token)) {
            setIsLoggedIn(true);
            setCurrentUser(parsed);
            setAuthChecking(false);
            return;
          }
        }

        // If no active session found, redirect to login immediately
        setIsLoggedIn(false);
        setCurrentUser(null);
        setAuthChecking(false);
        const redirectUrl = `/checkout?product=${encodeURIComponent(selectedProductId)}`;
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      } catch {
        setIsLoggedIn(false);
        setAuthChecking(false);
        const redirectUrl = `/checkout?product=${encodeURIComponent(selectedProductId)}`;
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
    }
  }, [router, selectedProductId]);

  // Update selected product
  const product: ProductItem = useMemo(() => {
    return (
      MARKET_PRODUCTS.find((p) => p.id === selectedProductId) ||
      MARKET_PRODUCTS[1] // Pro as default fallback
    );
  }, [selectedProductId]);

  // Recalculate shipping cost whenever city changes
  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!shippingAddress.city.trim()) {
        setShippingCost(25000);
        return;
      }
      setCalculatingShipping(true);
      try {
        const cost = await calculateShipping(shippingAddress.city);
        if (active) setShippingCost(cost);
      } catch {
        if (active) setShippingCost(35000);
      } finally {
        if (active) setCalculatingShipping(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [shippingAddress.city]);

  // Totals
  const subtotal = useMemo(() => {
    return product.price * quantity;
  }, [product.price, quantity]);

  const totalAmount = useMemo(() => {
    return subtotal + shippingCost;
  }, [subtotal, shippingCost]);

  // Form Field Updater
  const updateAddressField = useCallback((field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Submit Order and Redirect to DOKU Checkout
  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOrderError('');

    // Strict Auth Guard on submit
    if (!isLoggedIn || !currentUser) {
      const redirectUrl = `/checkout?product=${encodeURIComponent(selectedProductId)}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    if (!shippingAddress.fullName.trim()) {
      setOrderError('Nama penerima / pemilik armada wajib diisi.');
      return;
    }
    if (!shippingAddress.phone.trim()) {
      setOrderError('Nomor WhatsApp wajib diisi.');
      return;
    }
    if (!shippingAddress.city.trim()) {
      setOrderError('Kota / Pelabuhan wajib diisi.');
      return;
    }
    if (!shippingAddress.streetAddress.trim()) {
      setOrderError('Alamat lengkap dermaga / pengiriman wajib diisi.');
      return;
    }

    setSubmittingOrder(true);
    try {
      const items: CartItem[] = [{ product, quantity }];
      const { paymentUrl, orderResult: result } = await createDokuOrder({
        items,
        shippingAddress: {
          ...shippingAddress,
          email: shippingAddress.email || currentUser.email,
        },
        shippingCost,
        subtotal,
        totalAmount,
        paymentMethod: 'doku',
        notes,
        userId: currentUser.userId,
        token: currentUser.token,
      });

      setOrderResult(result);

      // Redirect user to DOKU hosted checkout page
      if (typeof window !== 'undefined' && paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : 'Terjadi kendala saat menghubungkan ke gateway pembayaran DOKU.');
      setSubmittingOrder(false);
    }
  };

  return {
    product,
    selectedProductId,
    setSelectedProductId,
    quantity,
    setQuantity,
    shippingAddress,
    updateAddressField,
    shippingCost,
    calculatingShipping,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    subtotal,
    totalAmount,
    submittingOrder,
    orderError,
    orderResult,
    authChecking,
    isLoggedIn,
    currentUser,
    handlePlaceOrder,
  };
}
