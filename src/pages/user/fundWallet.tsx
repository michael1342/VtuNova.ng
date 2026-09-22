import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaymentApi from '../../api/payment';
import ApiError from '../../api/ApiError';
import { useAuth } from '../../context/AuthContext';
import { getTransactions } from '../../api/user';
import { formatAmount, formatDate } from '../../utils/formatter';
import { type Transaction } from '../../interface/user.interface';

const presetAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

const FundWallet: React.FC = () => {
  const [method, setMethod] = useState<'card' | 'bank' | 'ussd'>('card');
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const { accountBalance } = useAuth();

  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // USSD states
  const [selectedBank, setSelectedBank] = useState('');

  // Status & balance states
  const [fundingHistory, setFundingHistory] = useState<Transaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [lastTxId, setLastTxId] = useState<string>('');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);


  const activeAmount = amount ?? (customAmount ? Number(customAmount) : 0);

  // Helper to trigger error banner
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setSuccess(false);
  };

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccess(false);
  };

  const handleMethodChange = (newMethod: 'card' | 'bank' | 'ussd') => {
    setMethod(newMethod);
    clearMessages();
  };

  const handleAmountSelect = (amt: number) => {
    setAmount(amt);
    setCustomAmount('');
    clearMessages();
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(null);
    clearMessages();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Card Brand Detector
  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\s+/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleaned)) return 'Mastercard';
    if (/^(506|507|6500)/.test(cleaned)) return 'Verve';
    return null;
  };

  const cardBrand = getCardBrand(cardNumber);

  const completeSuccessfulPayment = () => {
    const txId = `FW-${Math.floor(10000 + Math.random() * 90000)}`;
    setLastTxId(txId);

    const newTx: Transaction = {
      _id: txId,
      id: txId,
      service: 'Wallet Funding',
      method: method === 'card' ? 'Card Payment' : method === 'bank' ? 'Bank Transfer' : 'USSD Payment',
      paymentMethod: method === 'card' ? 'Card Payment' : method === 'bank' ? 'Bank Transfer' : 'USSD Payment',
      amount: activeAmount,
      status: 'Success',
      paidAt: new Date().toISOString(),
      date: 'Just now',
    };

    setFundingHistory((prev) => [newTx, ...prev]);
    setAllTransactions((prev) => [newTx, ...prev]);
    setLoading(false);
    setSuccess(true);
    setErrorMessage(null);

    // Reset card fields
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  // General Submit Handler: Single Pay Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    // Validations
    if (method !== 'bank' && activeAmount < 100) {
      triggerError('Minimum funding amount is ₦100.');
      return;
    }

    if (method === 'card') {
      const rawCard = cardNumber.replace(/\s+/g, '');
      if (rawCard.length < 16) {
        triggerError('Please enter a valid 16-digit card number.');
        return;
      }
      if (expiry.length < 5 || !expiry.includes('/')) {
        triggerError('Please enter a valid card expiry date (MM/YY).');
        return;
      }
      if (cvv.length < 3) {
        triggerError('Please enter a valid 3-digit CVV security code.');
        return;
      }
    }

    if (method === 'ussd' && !selectedBank) {
      triggerError('Please select a bank to generate USSD code.');
      return;
    }

    setLoading(true);

    try {
      // Initialize Payment
      const initRes = await PaymentApi.initializePayment({ amount: activeAmount });

      if (!initRes.success) {
        triggerError(initRes.error || 'Failed to initialize payment.');
        setLoading(false);
        return;
      }

      // If backend redirects to Paystack authorization page
      const paymentResponse = initRes.response as { data?: { authorization_url?: string }; authorization_url?: string } | undefined;
      const authUrl = paymentResponse?.data?.authorization_url || paymentResponse?.authorization_url;
      if (authUrl) {
        //redirect
        window.location.href = authUrl;
      }

      completeSuccessfulPayment();
    } catch (err: any) {
      if (err instanceof ApiError) {
        triggerError(err.message);
      } else {
        triggerError(err?.message || 'Payment processing failed. Please try again.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingHistory(true);
        const res = await getTransactions();
        if (res?.transactions && Array.isArray(res.transactions)) {
          setAllTransactions(res.transactions);
          const fundingTxns = res.transactions.filter((tx: Transaction) => {
            const s = (tx.service || '').toLowerCase();
            const m = (tx.method || tx.paymentMethod || '').toLowerCase();
            return (
              s.includes('fund') ||
              s.includes('deposit') ||
              s.includes('wallet') ||
              m.includes('card') ||
              m.includes('bank') ||
              m.includes('ussd') ||
              m.includes('transfer')
            );
          });
          setFundingHistory(fundingTxns.length > 0 ? fundingTxns.slice(0, 5) : res.transactions.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchTransactions();
  }, []);


  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      {/* ── Main Content ── */}
      <main className="flex-1 p-4 sm:p-6 space-y-5 max-w-6xl mx-auto w-full">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk']">Fund Wallet</h2>
            <p className="text-xs text-text-muted mt-0.5">Top up your wallet balance instantly using secure payment channels.</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Funding
          </span>
        </div>

        {/* ── ERROR BANNER ── */}
        {errorMessage && (
          <div className="flex items-start justify-between gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-4 shadow-lg shadow-rose-500/5 animate-[fadeIn_.3s_ease]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-rose-400">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-rose-400">Payment Failed</div>
                <div className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
                  {errorMessage}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400/60 hover:text-rose-300 transition-colors p-1"
              aria-label="Dismiss error"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* ── SUCCESS BANNER ── */}
        {success && (
          <div className="flex items-start justify-between gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 shadow-lg shadow-emerald-500/5 animate-[fadeIn_.3s_ease]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-emerald-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-emerald-400">Wallet Funded Successfully!</div>
                <div className="text-xs text-text-muted mt-0.5">
                  ₦{activeAmount.toLocaleString()} has been added to your balance. <span className="font-mono text-emerald-300">[{lastTxId}]</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="text-emerald-400/60 hover:text-emerald-300 transition-colors p-1"
              aria-label="Dismiss success"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Funding form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-5">

              {/* Payment Method Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-text-gray">Select Funding Method</label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-bg-dark-secondary border border-border">
                  <button
                    type="button"
                    onClick={() => handleMethodChange('card')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${method === 'card'
                        ? 'bg-primary text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                        : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                      }`}
                  >
                    Card Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMethodChange('bank')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${method === 'bank'
                        ? 'bg-primary text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                        : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                      }`}
                  >
                    Bank Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMethodChange('ussd')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${method === 'ussd'
                        ? 'bg-primary text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                        : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                      }`}
                  >
                    USSD Code
                  </button>
                </div>
              </div>

              {/* Amount Inputs */}
              {method !== 'bank' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-text-gray">Enter Amount</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted select-none">₦</span>
                      <input
                        type="number"
                        placeholder="Min ₦100"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${amount === amt
                            ? 'bg-primary border-primary text-white shadow-sm'
                            : 'bg-bg-dark-secondary border-border text-text-gray hover:border-border-hover hover:text-text-white'
                          }`}
                      >
                        ₦{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {method === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-medium text-text-gray">Card Number</label>
                        {cardBrand && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary-light border border-primary/30">
                            {cardBrand}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19))}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono tracking-wide"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-text-gray">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                            setExpiry(val.substring(0, 5));
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-text-gray">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || activeAmount <= 0}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing Payment...
                        </>
                      ) : (
                        `Pay ₦${activeAmount > 0 ? activeAmount.toLocaleString() : '0'}`
                      )}
                    </button>
                  </div>
                )}

                {method === 'bank' && (
                  <div className="space-y-4 animate-[fadeIn_.2s_ease]">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                      <span className="text-[11px] font-semibold text-primary block">Virtual Bank Accounts</span>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        Transfer money to any of the virtual bank accounts below to fund your wallet balance automatically.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-text-muted block">Sterling Bank</span>
                          <span className="text-sm font-bold font-mono text-text-white tracking-wider block mt-0.5">8273648190</span>
                          <span className="text-[10px] text-text-gray block mt-0.5">VtuNova - Michael Anazodo</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('8273648190', 'sterling')}
                          className="px-3 py-1.5 rounded-lg border border-border hover:bg-bg-card-hover text-[11px] font-semibold text-text-white transition-colors flex items-center gap-1"
                        >
                          {copiedText === 'sterling' ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Copied!
                            </span>
                          ) : (
                            'Copy'
                          )}
                        </button>
                      </div>

                      <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-text-muted block">Wema Bank</span>
                          <span className="text-sm font-bold font-mono text-text-white tracking-wider block mt-0.5">9928374620</span>
                          <span className="text-[10px] text-text-gray block mt-0.5">VtuNova - Michael Anazodo</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('9928374620', 'wema')}
                          className="px-3 py-1.5 rounded-lg border border-border hover:bg-bg-card-hover text-[11px] font-semibold text-text-white transition-colors flex items-center gap-1"
                        >
                          {copiedText === 'wema' ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Copied!
                            </span>
                          ) : (
                            'Copy'
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoading(true);
                          setTimeout(() => {
                            setLoading(false);
                            triggerError('No recent transfer detected yet. Please ensure you transfer to one of the accounts above.');
                          }, 1500);
                        }}
                        disabled={loading}
                        className="w-full py-3 rounded-xl border border-primary/30 hover:border-primary text-primary-light font-semibold text-xs transition-all flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
                      >
                        {loading ? 'Verifying Transfer...' : 'I Have Made The Transfer'}
                      </button>
                    </div>
                  </div>
                )}

                {method === 'ussd' && (
                  <div className="space-y-4 animate-[fadeIn_.2s_ease]">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-gray">Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => {
                          setSelectedBank(e.target.value);
                          clearMessages();
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
                      >
                        <option value="" disabled>Choose your bank</option>
                        <option value="gtb" className="bg-bg-dark">GTBank (*737#)</option>
                        <option value="access" className="bg-bg-dark">Access Bank (*901#)</option>
                        <option value="zenith" className="bg-bg-dark">Zenith Bank (*966#)</option>
                        <option value="uba" className="bg-bg-dark">UBA (*919#)</option>
                        <option value="firstbank" className="bg-bg-dark">FirstBank (*894#)</option>
                      </select>
                    </div>

                    {selectedBank && activeAmount > 0 && (
                      <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 space-y-3 text-center">
                        <span className="text-[10px] text-text-muted block uppercase tracking-wider">USSD Dial Code</span>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg font-mono font-bold text-primary-light tracking-wide block">
                            {selectedBank === 'gtb' && `*737*50*${activeAmount}#`}
                            {selectedBank === 'access' && `*901*000*${activeAmount}#`}
                            {selectedBank === 'zenith' && `*966*000*${activeAmount}#`}
                            {selectedBank === 'uba' && `*919*000*${activeAmount}#`}
                            {selectedBank === 'firstbank' && `*894*${activeAmount}#`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const code = selectedBank === 'gtb' ? `*737*50*${activeAmount}#` :
                                selectedBank === 'access' ? `*901*000*${activeAmount}#` :
                                  selectedBank === 'zenith' ? `*966*000*${activeAmount}#` :
                                    selectedBank === 'uba' ? `*919*000*${activeAmount}#` : `*894*${activeAmount}#`;
                              copyToClipboard(code, 'ussd');
                            }}
                            className="px-2.5 py-1 rounded bg-bg-card border border-border hover:border-primary text-[10px] text-text-white transition-colors"
                          >
                            {copiedText === 'ussd' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-[10px] text-text-muted">Dial this code from your registered phone number to pay.</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || activeAmount <= 0 || !selectedBank}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Confirming Payment...
                        </>
                      ) : (
                        'Confirm Payment'
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Wallet Info & History */}
          <div className="space-y-4">
            {/* Wallet Overview */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-2 border-b border-border">Wallet Overview</h3>
              <div className="space-y-1">
                <span className="text-[10px] text-text-gray block uppercase tracking-wider">Available Balance</span>
                <span className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-text-white block">
                  {formatAmount(accountBalance, true) || 0}
                </span>
              </div>
            </div>

            {/* Funding History */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Funding History</h3>
                <Link
                  to="/user/transactions"
                  className="text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  View All
                </Link>
              </div>

              {isLoadingHistory ? (
                <div className="space-y-2.5 py-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-bg-dark-secondary/60 border border-border/60 rounded-xl p-3 animate-pulse flex items-center justify-between">
                      <div className="space-y-1.5">
                        <div className="h-3 w-24 bg-white/10 rounded" />
                        <div className="h-2.5 w-16 bg-white/5 rounded" />
                      </div>
                      <div className="space-y-1.5 flex flex-col items-end">
                        <div className="h-3 w-14 bg-white/10 rounded" />
                        <div className="h-2.5 w-10 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : fundingHistory.length > 0 ? (
                <div className="space-y-2.5">
                  {fundingHistory.map((item, idx) => {
                    const statusLower = (item.status || 'success').toLowerCase();
                    const isSuccess = statusLower === 'success';
                    const isPending = statusLower === 'pending';
                    const isFailed = statusLower === 'failed' || statusLower === 'reversed';

                    const statusClass = isSuccess
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : isPending
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : isFailed
                      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      : 'text-text-muted bg-zinc-500/10 border-zinc-500/20';

                    const itemDate = item.paidAt
                      ? formatDate(item.paidAt)
                      : item.createdAt
                      ? formatDate(item.createdAt)
                      : item.date || 'Recent';

                    const itemMethod = item.method || item.paymentMethod || item.service || 'Bank Transfer';

                    return (
                      <div
                        key={item._id || item.id || item.refNo || idx}
                        className="bg-bg-dark-secondary border border-border rounded-xl p-3 flex items-center justify-between gap-3 text-xs hover:border-border-hover transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-text-white flex items-center gap-1.5 truncate">
                            {itemMethod}
                          </div>
                          <div className="text-[10px] text-text-muted mt-0.5">{itemDate}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-text-white font-['Space_Grotesk']">
                            ₦{(item.amount || 0).toLocaleString()}
                          </div>
                          <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize ${statusClass}`}>
                            {item.status || 'Success'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 px-2 bg-bg-dark-secondary/50 border border-border/60 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-text-white">No Funding Records</p>
                  <p className="text-[11px] text-text-muted">Your top-up transaction history will appear here once you fund your wallet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default FundWallet;
