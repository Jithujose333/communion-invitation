import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../services/api';
import { RazorpayModal } from '../components/RazorpayModal';
import { Trash2, Plus, Minus, Ticket, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartSubtotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const discountAmount = discountApplied ? Math.round(cartSubtotal * 0.1) : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'STUDENT10' || discountCode.trim().toUpperCase() === 'COLLABUZ') {
      setDiscountApplied(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid promo code. Try "STUDENT10" or "COLLABUZ"');
    }
  };

  const handleInitiateRazorpay = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setIsCheckoutLoading(true);
    setErrorMessage('');

    try {
      // Create Razorpay Order via backend API endpoint for first event item
      const item = cartItems[0];
      const payload = {
        eventId: item.eventId,
        tickets: cartItems.map(i => ({ name: i.ticketName, price: i.price, qty: i.quantity })),
        totalAmount: finalTotal
      };

      const orderData = await fetchApi('/orders/create-razorpay-order', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setRazorpayOrder(orderData);
      setIsRazorpayModalOpen(true);
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Failed to initiate Razorpay order');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsRazorpayModalOpen(false);
    try {
      const verifyRes = await fetchApi('/orders/verify-payment', {
        method: 'POST',
        body: JSON.stringify({
          orderId: razorpayOrder.orderId,
          razorpayPaymentId: paymentDetails.razorpayPaymentId,
          razorpayOrderId: paymentDetails.razorpayOrderId,
          razorpaySignature: paymentDetails.razorpaySignature
        })
      });

      clearCart();
      navigate(`/ticket-confirmation/${verifyRes.order._id}`);
    } catch (err) {
      setErrorMessage('Payment verification error: ' + err.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto text-indigo-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-slate-400 text-xs max-w-sm mx-auto">
          Explore upcoming college events, hackathons, and cultural nights to book your tickets.
        </p>
        <button
          onClick={() => navigate('/')}
          className="gradient-btn text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20"
        >
          Explore Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <ShoppingBag className="w-6 h-6 text-indigo-400" />
          <span>Shopping Cart ({cartItems.length} Event Items)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-400 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-950/80 border border-red-500/40 text-red-300 text-xs p-4 rounded-2xl">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.eventId}-${item.ticketName}`}
              className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.bannerUrl}
                  alt={item.eventTitle}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.eventTitle}</h3>
                  <div className="text-xs text-indigo-400 font-medium">{item.collegeName}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Tier: <span className="text-slate-200 font-semibold">{item.ticketName}</span> (₹{item.price} each)
                  </div>
                </div>
              </div>

              {/* Quantity Modifier */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.eventId, item.ticketName, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.eventId, item.ticketName, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-white block">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.eventId, item.ticketName)}
                    className="text-[10px] text-slate-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary & Razorpay Trigger */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-5 border border-slate-800">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyDiscount} className="flex space-x-2">
              <input
                type="text"
                placeholder="Promo Code (STUDENT10)"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 uppercase focus:outline-none"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 px-3 py-2 rounded-xl transition-colors"
              >
                Apply
              </button>
            </form>

            {discountApplied && (
              <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5" />
                <span>10% Student Discount Applied!</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200 font-medium">₹{cartSubtotal}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Platform Fee & Tax</span>
                <span className="text-slate-200 font-medium">₹0 (Free)</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-white border-t border-slate-800 pt-3">
                <span>Total Amount</span>
                <span className="text-indigo-300">₹{finalTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleInitiateRazorpay}
              disabled={isCheckoutLoading}
              className="w-full py-4 gradient-btn text-white font-bold rounded-xl shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isCheckoutLoading ? (
                <span>Initializing Razorpay...</span>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>Pay ₹{finalTotal} via Razorpay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Razorpay Gateway & Digital Pass Generation</span>
            </div>

          </div>
        </div>

      </div>

      {/* Razorpay Interactive Modal */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        orderDetails={razorpayOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
};
