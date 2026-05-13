import { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { CreditCard, Smartphone, Loader2, CheckCircle, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/auth';

interface Invoice {
  id: string;
  period: string;
  amount: number;
  currency: string;
}

interface Props {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
}

type Method = 'MPESA' | 'CARD';

export default function PaymentModal({ invoice, onClose, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [method, setMethod] = useState<Method>('MPESA');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [step, setStep] = useState<'choose' | 'processing' | 'success'>('choose');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Flutterwave config from backend, then open inline modal
  const initiateFW = useMutation({
    mutationFn: () =>
      api.post('/payments/initiate', { invoiceId: invoice.id, method: 'CARD' }).then((r) => r.data),
    onSuccess: (config) => {
      handleFlutterwave(config);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message ?? 'Failed to initiate payment');
    },
  });

  // Flutterwave STK Push (M-Pesa)
  const initiateSTK = useMutation({
    mutationFn: () =>
      api.post('/payments/mpesa-stk', { invoiceId: invoice.id, phone }).then((r) => r.data),
    onSuccess: () => {
      setStep('processing');
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message ?? 'Failed to send STK Push. Check your phone number.');
    },
  });

  // Build FW config hook — we call this lazily after getting config from backend
  function handleFlutterwave(config: any) {
    const fwConfig = {
      public_key: config.publicKey,
      tx_ref: config.txRef,
      amount: config.amount,
      currency: config.currency,
      payment_options: 'card,mpesa,mobilemoney',
      customer: config.customer,
      customizations: {
        title: 'NestKenya Rent Payment',
        description: `Rent for ${invoice.period}`,
        logo: 'https://nestkenya.com/logo.png',
      },
      meta: config.meta,
    };

    // Use Flutterwave via script injection since hook must be called at component top level
    // We load the FW inline script dynamically here
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.onload = () => {
      (window as any).FlutterwaveCheckout({
        ...fwConfig,
        callback: (response: any) => {
          (window as any).FlutterwaveCheckout = undefined;
          document.head.removeChild(script);
          if (response.status === 'successful' || response.status === 'completed') {
            queryClient.invalidateQueries({ queryKey: ['tenant-invoices'] });
            queryClient.invalidateQueries({ queryKey: ['tenant-payments'] });
            setStep('success');
            setTimeout(() => { onSuccess(); onClose(); }, 2000);
          } else {
            setErrorMsg('Payment was not completed. Please try again.');
          }
        },
        onclose: () => {
          document.head.removeChild(script);
        },
      });
    };
    document.head.appendChild(script);
  }

  function handlePay() {
    setErrorMsg('');
    if (method === 'MPESA') {
      initiateSTK.mutate();
    } else {
      initiateFW.mutate();
    }
  }

  const isLoading = initiateFW.isPending || initiateSTK.isPending;
  const currency = invoice.currency ?? 'KES';
  const amount = Number(invoice.amount).toLocaleString('en-KE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#1a2e4a]">Pay Rent</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5">
          {step === 'success' && (
            <div className="flex flex-col items-center py-8 gap-4">
              <CheckCircle className="h-16 w-16 text-[#2ecc71]" />
              <h3 className="text-2xl font-semibold text-[#1a2e4a]">Payment Received!</h3>
              <p className="text-gray-500 text-center">
                Your rent for {invoice.period} has been confirmed.
              </p>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-[#2ecc71]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a2e4a]">Check Your Phone</h3>
              <p className="text-gray-500 text-center">
                An M-Pesa prompt has been sent to <strong>{phone}</strong>. Enter your PIN to
                complete the payment.
              </p>
              <p className="text-sm text-gray-400 text-center">
                Payment confirmation may take a few seconds after you approve.
              </p>
              <button
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['tenant-invoices'] });
                  queryClient.invalidateQueries({ queryKey: ['tenant-payments'] });
                  onClose();
                }}
                className="mt-2 px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm"
              >
                Done — I've entered my PIN
              </button>
            </div>
          )}

          {step === 'choose' && (
            <>
              {/* Invoice summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">Invoice</span>
                  <span className="text-sm text-gray-700">{invoice.period}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="text-xl font-bold text-[#1a2e4a]">
                    {currency} {amount}
                  </span>
                </div>
              </div>

              {/* Method selector */}
              <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setMethod('MPESA')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                    method === 'MPESA'
                      ? 'border-[#2ecc71] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className={`h-6 w-6 ${method === 'MPESA' ? 'text-[#2ecc71]' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium text-[#1a2e4a]">M-Pesa</span>
                  <span className="text-xs text-gray-400">STK Push</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('CARD')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                    method === 'CARD'
                      ? 'border-[#2ecc71] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`h-6 w-6 ${method === 'CARD' ? 'text-[#2ecc71]' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium text-[#1a2e4a]">Card</span>
                  <span className="text-xs text-gray-400">Via Flutterwave</span>
                </button>
              </div>

              {/* Phone input for M-Pesa */}
              {method === 'MPESA' && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254700000000"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm"
                  />
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={isLoading || (method === 'MPESA' && !phone)}
                className="w-full py-3 bg-[#2ecc71] hover:bg-[#27ae60] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading
                  ? 'Processing...'
                  : method === 'MPESA'
                  ? `Pay ${currency} ${amount} via M-Pesa`
                  : `Pay ${currency} ${amount} via Card`}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Secured by Flutterwave · PCI DSS compliant
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
