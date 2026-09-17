import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RazorpayModal = ({ isOpen, onClose, orderDetails, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');

  if (!isOpen || !orderDetails) return null;

  const handleSimulatePayment = async () => {
    setProcessing(true);
    
    // Simulate Razorpay Gateway handshake delay
    setTimeout(() => {
      setProcessing(false);
      
      // Fire victory confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onPaymentSuccess({
        razorpayPaymentId: `pay_rzp_live_${Date.now()}`,
        razorpayOrderId: orderDetails.razorpayOrderId || `order_${Date.now()}`,
        razorpaySignature: 'simulated_valid_signature_2026'
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header - Razorpay Branding */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-xs tracking-wider">
              RZP
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center space-x-1">
                <span>Razorpay Gateway</span>
                <span className="bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                  Test Sandbox
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Collabuz Event Services</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Order Summary */}
        <div className="bg-indigo-950/30 p-5 border-b border-slate-800 text-center">
          <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">Total Payable</span>
          <div className="text-3xl font-extrabold text-white mt-1">
            ₹{orderDetails.amount} <span className="text-sm font-normal text-slate-400">INR</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Ticket Ref: <span className="font-mono text-indigo-300">{orderDetails.ticketCode}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 space-y-4">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Select Payment Method
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedMethod('upi')}
              className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                selectedMethod === 'upi'
                  ? 'border-indigo-500 bg-indigo-950/50 text-white'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold">UPI / GPay</div>
                <div className="text-[10px] text-slate-400">Instant Verification</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                selectedMethod === 'card'
                  ? 'border-indigo-500 bg-indigo-950/50 text-white'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-bold">Credit/Debit Card</div>
                <div className="text-[10px] text-slate-400">Visa, Mastercard</div>
              </div>
            </button>
          </div>

          {selectedMethod === 'card' && (
            <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Card Number (Sandbox Auto-fill)</span>
                <input
                  type="text"
                  readOnly
                  value="4111 •••• •••• 1111"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 font-mono"
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  readOnly
                  value="12/28"
                  className="w-1/2 bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 font-mono text-center"
                />
                <input
                  type="text"
                  readOnly
                  value="123"
                  className="w-1/2 bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 font-mono text-center"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-slate-300">
                Auto-simulating GPay / PhonePe / Paytm authorization callback.
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handleSimulatePayment}
            disabled={processing}
            className="w-full py-3.5 px-4 gradient-btn text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Razorpay Handshake...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{orderDetails.amount} via Razorpay</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted Razorpay Gateway</span>
          </div>

        </div>

      </div>

    </div>
  );
};
