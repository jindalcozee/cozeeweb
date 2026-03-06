import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck, Truck, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { products } from '../data/products';
import { supabase } from '../lib/supabase';

export function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, clearCart } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');

  // Form state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setIsSuccess(true);
      clearCart();
    }
  }, [searchParams, clearCart]);

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)!
  })).filter(item => item.product);

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.product.price.replace(/\D/g, ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  const shipping = 0;
  const codFee = paymentMethod === 'cod' ? 50 : 0;
  const total = subtotal + shipping + codFee;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (paymentMethod === 'cod') {
      try {
        // 1. Send email notification
        await fetch('/api/confirm-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstName,
            lastName,
            phone,
            address,
            city,
            postalCode,
            cartItems,
            total,
            paymentMethod: 'cod'
          })
        });

        // 2. Save to Supabase if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('orders').insert({
            user_id: user.id,
            total_amount: total,
            status: 'pending_cod',
            items: cartItems,
            razorpay_order_id: 'COD'
          });
        }

        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
      } catch (error) {
        console.error("COD Order processing failed:", error);
        alert("Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
      return;
    }

    // 1. Load Razorpay script
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsSubmitting(false);
      return;
    }

    try {
      // 2. Create order on backend
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });
      const orderData = await orderResponse.json();

      if (orderData.error) {
        alert(orderData.error);
        setIsSubmitting(false);
        return;
      }

      // 3. Get Razorpay Key ID from backend
      const keyResponse = await fetch('/api/razorpay-key');
      const keyData = await keyResponse.json();

      // 4. Initialize Razorpay
      const options = {
        key: keyData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Cozee",
        description: "Purchase from Cozee Store",
        order_id: orderData.id,
        handler: async function (response: any) {
          // Payment successful
          try {
            // 1. Send email notification
            await fetch('/api/confirm-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                firstName,
                lastName,
                phone,
                address,
                city,
                postalCode,
                cartItems,
                total,
                paymentMethod: 'prepaid'
              })
            });

            // 2. Save to Supabase if user is logged in
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('orders').insert({
                user_id: user.id,
                total_amount: total,
                status: 'paid',
                items: cartItems,
                razorpay_order_id: response.razorpay_order_id
              });
            }
          } catch (error) {
            console.error("Order processing failed:", error);
          }

          setIsSubmitting(false);
          setIsSuccess(true);
          clearCart();
        },
        prefill: {
          name: `${firstName} ${lastName}`.trim(),
          email: email,
          contact: phone
        },
        theme: {
          color: "#C11B17"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment failed. Please try again.");
        setIsSubmitting(false);
      });
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong during checkout.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-[#C11B17] mb-6"
        >
          <CheckCircle size={80} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-rojo)] mb-4 tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-xl text-[var(--color-rojo)]/70 mb-8 max-w-md">
          Thank you for your order. Your Cozee is getting packed and will be shipped shortly!
        </p>
        <Link
          to="/"
          className="px-8 py-4 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-medium text-lg hover:bg-[var(--color-rojo)]/90 transition-colors"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-[var(--color-rojo)] mb-4">Your Cart is Empty</h1>
        <p className="text-xl text-[var(--color-rojo)]/70 mb-8">Add some Cozees to your cart before checking out.</p>
        <Link to="/" className="px-8 py-3 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-medium hover:bg-[var(--color-rojo)]/90 transition-colors">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <main className="pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-rojo)]/70 hover:text-[var(--color-rojo)] transition-colors mb-8 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-lg">Back to Store</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h1 className="text-4xl font-bold text-[var(--color-rojo)] mb-8 tracking-tight">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Contact Info */}
            <section>
              <h2 className="text-2xl font-medium text-[var(--color-rojo)] mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-rojo)]/70 mb-1">Email Address</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-rojo)]/20 bg-white/50 focus:outline-none focus:border-[var(--color-rojo)] focus:ring-1 focus:ring-[var(--color-rojo)] transition-all" placeholder="you@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-rojo)]/70 mb-1">Phone Number</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-rojo)]/20 bg-white/50 focus:outline-none focus:border-[var(--color-rojo)] focus:ring-1 focus:ring-[var(--color-rojo)] transition-all" placeholder="+91 98765 43210" />
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section>
              <h2 className="text-2xl font-medium text-[var(--color-rojo)] mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-rojo)]/70 mb-1">First Name</label>
                  <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-rojo)]/20 bg-white/50 focus:outline-none focus:border-[var(--color-rojo)] focus:ring-1 focus:ring-[var(--color-rojo)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-rojo)]/70 mb-1">Last Name</label>
                  <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-rojo)]/20 bg-white/50 focus:outline-none focus:border-[var(--color-rojo)] focus:ring-1 focus:ring-[var(--color-rojo)] transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-rojo)]/70 mb-1">Address</label>
                  <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-rojo)]/20 bg-white/50 focus:outline-none focus:border-[var(--color-rojo)] focus:ring-1 focus:ring-[var(--color-rojo)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-rojo)]/70 mb-1">City</label>
                  <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-rojo)]/20 bg-white/50 focus:outline-none focus:border-[var(--color-rojo)] focus:ring-1 focus:ring-[var(--color-rojo)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-rojo)]/70 mb-1">Postal Code</label>
                  <input required type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-rojo)]/20 bg-white/50 focus:outline-none focus:border-[var(--color-rojo)] focus:ring-1 focus:ring-[var(--color-rojo)] transition-all" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-2xl font-medium text-[var(--color-rojo)] mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('prepaid')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${paymentMethod === 'prepaid'
                      ? 'border-[var(--color-rojo)] bg-[var(--color-rojo)]/5'
                      : 'border-[var(--color-rojo)]/10 bg-white/50 hover:border-[var(--color-rojo)]/30'
                    }`}
                >
                  <div className={`p-4 rounded-xl transition-colors ${paymentMethod === 'prepaid' ? 'bg-[var(--color-rojo)] text-[var(--color-crema)]' : 'bg-[var(--color-rojo)]/10 text-[var(--color-rojo)] group-hover:bg-[var(--color-rojo)]/20'}`}>
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-[var(--color-rojo)]">Prepaid</div>
                    <div className="text-sm text-[var(--color-rojo)]/60">Pay online via Razorpay</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${paymentMethod === 'cod'
                      ? 'border-[var(--color-rojo)] bg-[var(--color-rojo)]/5'
                      : 'border-[var(--color-rojo)]/10 bg-white/50 hover:border-[var(--color-rojo)]/30'
                    }`}
                >
                  <div className={`p-4 rounded-xl transition-colors ${paymentMethod === 'cod' ? 'bg-[var(--color-rojo)] text-[var(--color-crema)]' : 'bg-[var(--color-rojo)]/10 text-[var(--color-rojo)] group-hover:bg-[var(--color-rojo)]/20'}`}>
                    <Banknote size={28} />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-[var(--color-rojo)]">Cash on Delivery</div>
                    <div className="text-sm text-[var(--color-rojo)]/60">₹50 handling fee applies</div>
                  </div>
                </button>
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-bold text-xl hover:bg-[var(--color-rojo)]/90 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-xl shadow-[var(--color-rojo)]/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                paymentMethod === 'cod' ? `Confirm Order (${total} INR)` : `Pay ${total} INR`
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-rojo)]/60 mt-4">
              <ShieldCheck size={16} />
              <span>Payments are secure and encrypted.</span>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white/40 rounded-3xl p-6 md:p-8 border border-[var(--color-rojo)]/10 sticky top-8">
            <h2 className="text-2xl font-bold text-[var(--color-rojo)] mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-20 h-20 bg-[#FFF5EB] rounded-xl border border-[#C11B17] overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.title} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--color-rojo)] leading-tight text-sm mb-1">{item.product.title}</h3>
                    <div className="text-[var(--color-rojo)]/60 text-sm mb-1">Qty: {item.quantity}</div>
                    <div className="text-[var(--color-rojo)] font-medium text-sm">{item.product.price}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-rojo)]/10 pt-6 space-y-3">
              <div className="flex justify-between text-[var(--color-rojo)]/80">
                <span>Subtotal</span>
                <span>{subtotal} INR</span>
              </div>
              <div className="flex justify-between text-[var(--color-rojo)]/80">
                <span className="flex items-center gap-2">Shipping <Truck size={14} /></span>
                <span>{shipping === 0 ? 'Free' : `${shipping} INR`}</span>
              </div>
              {paymentMethod === 'cod' && (
                <div className="flex justify-between text-[var(--color-rojo)]/80">
                  <span>COD Handling Fee</span>
                  <span>{codFee} INR</span>
                </div>
              )}
              <div className="border-t border-[var(--color-rojo)]/10 pt-3 mt-3 flex justify-between text-xl font-bold text-[var(--color-rojo)]">
                <span>Total</span>
                <span>{total} INR</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
