import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatAmount, formatDate, formatId } from '../../utils/formatter';
import { getTransactions } from '../../api/user';
import { verifyMeter, buyElectricity } from '../../api/vtuApi';
import { useNavigate } from 'react-router-dom';
import generateRequestID from '../../utils/generateRequestID';


const discos = [
  { id: 'ikeja-electric', name: 'Ikeja Electric (IKEDC)' },
  { id: 'eko-electric', name: 'Eko Electric (EKEDC)' },
  { id: 'abuja-electric', name: 'Abuja Electric (AEDC)' },
  { id: 'kano-electric', name: 'Kano Electric (KEDCO)' },
  { id: 'portharcourt-electric', name: 'Port Harcourt Electric (PHED)' },
  { id: 'kaduna-electric', name: 'Kaduna Electric (KAEDCO)' },
  { id: 'enugu-electric', name: 'Enugu Electric (EEDC)' },
  { id: 'ibadan-electric', name: 'Ibadan Electric (IBEDC)' },
  { id: 'jos-electric', name: 'Jos Electric (JED)' },
  { id: 'yola-electric', name: 'Yola Electric (YEDC)' },
  { id: 'benin-electric', name: 'Benin Electric (BEDC)' },
];

const presetAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

const BuyElectricity = () => {
  const navigate = useNavigate();
  const [selectedDisco, setSelectedDisco] = useState('');
  const [meterType, setMeterType] = useState<'prepaid' | 'Postpaid'>('prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { currentUser, accountBalance, setAccountBalance } = useAuth();

  const [amountType, setAmountType] = useState('preset');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tokenGenerated, setTokenGenerated] = useState('');
  const [tokenCopied, setTokenCopied] = useState(false);

  // ── Transaction state ────────────────────────────────────────────────────────
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [txSearch, setTxSearch] = useState('');
  const [txPage, setTxPage] = useState(1);
  const TX_PER_PAGE = 5;

  const activeAmount = amountType === 'custom' ? (customAmount ? Number(customAmount) : 0) : (selectedAmount ?? 0);

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');
  const [wrongBillersCode, setWrongBillersCode] = useState(false);
  const [commissionDetails, setCommissionDetails] = useState({ amount: null, rate: '1.50', rate_type: 'percent', computation_type: 'default' });

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTxns = async () => {
      try {
        const res = await getTransactions();
        setAllTransactions(res?.transactions ?? []);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      }
    };
    fetchTxns();
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    //scroll to top
    const pageRef = useRef<HTMLDivElement>(null);

const scrollToTop = () => {
  pageRef.current?.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  // Derived: electricity-only transactions
  const electricityTransactions = allTransactions.filter(
    (tx) => tx.service?.toLowerCase() === 'electricity bill'
  );

  // Filtered by search
  const filteredElectricityTx = electricityTransactions.filter((tx) => {
    const q = txSearch.toLowerCase();
    return (
      !q ||
      tx._id?.toLowerCase().includes(q) ||
      tx.recipient?.toLowerCase().includes(q) ||
      tx.refNo?.toLowerCase().includes(q)
    );
  });

  const totalTxPages = Math.ceil(filteredElectricityTx.length / TX_PER_PAGE);
  const paginatedElectricityTx = filteredElectricityTx.slice(
    (txPage - 1) * TX_PER_PAGE,
    txPage * TX_PER_PAGE
  );

  // Derived stats
  const todayTransactions = allTransactions.filter((tx) => {
    const paidAt = new Date(tx.paidAt);
    const today = new Date();
    return (
      paidAt.getFullYear() === today.getFullYear() &&
      paidAt.getMonth() === today.getMonth() &&
      paidAt.getDate() === today.getDate()
    );
  });

  const getTodaysTransactionAmount = () =>
    todayTransactions.reduce((total: number, tx: any) => total + tx.amount, 0);

  const getTotalTransactionAmount = () =>
    allTransactions.reduce((total: number, tx: any) => total + tx.amount, 0);
  useEffect(() => {
    const verifyMeterNumber = async () => {
  

      if (meterNumber.trim().length >= 10 && selectedDisco) {
        setIsVerifying(true);
        setIsVerified(false);
        try {
          const response = await verifyMeter({ billersCode: meterNumber, serviceID: selectedDisco, type: meterType });
          console.log(response);
          if (response?.success) {
            setIsVerified(true);
            setIsVerifying(false);
            setErrorMessage(null);
            setCustomerName(response.response.Vtu.content?.Customer_Name)
            setAddress(response.response.Vtu.content?.Address)
          } else {
            setIsVerified(false);
            setIsVerifying(false);
            setErrorMessage(response?.error || response?.response.message || 'Meter number could not be verified. Please check and try again.');
            setSuccess(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (err: any) {
          console.log(err);
          setIsVerified(false);
          setIsVerifying(false);
          setErrorMessage(err?.message || 'Failed to verify meter. Please check your connection and try again.');
          setSuccess(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // User is still typing or cleared the field — reset silently
        setIsVerified(false);
        setIsVerifying(false);
        setErrorMessage(null);
      }
    };
    verifyMeterNumber();
  }, [meterNumber, selectedDisco]);

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setSuccess(false);
    scrollToTop()
  };

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccess(false);
  };

  const handleReset = () => {
    setSelectedDisco('');
    setMeterType('');
    setMeterNumber('');
    setAmountType('preset');
    setSelectedAmount(null);
    setCustomAmount('');
    setIsVerified(false);
    setIsVerifying(false);
    setSuccess(false);
    setErrorMessage(null);
    setTokenGenerated('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!selectedDisco) {
      triggerError('Please select a distribution company (DisCo).');
      return;
    }
    if (!meterNumber || meterNumber.trim().length < 10) {
      triggerError('Please enter a valid meter number (at least 10 digits).');
      return;
    }
    if (!isVerified) {
      triggerError('Meter number could not be verified. Please check and try again.');
      return;
    }
    if (activeAmount <= 0) {
      triggerError('Please select or enter a valid payment amount.');
      return;
    }
    // ── Balance check ───────────────────────────────────────────────────────────
    if (accountBalance !== null && accountBalance < activeAmount) {
      triggerError(
        `Insufficient wallet balance. Your balance is ₦${(accountBalance ?? 0).toLocaleString()} but the transaction requires ₦${activeAmount.toLocaleString()}. Please fund your wallet and try again.`
      );
      return;
    }

    try {
      setLoading(true);
      const res = await buyElectricity({
        serviceID: selectedDisco,
        variation_code: meterType,
        billersCode: meterNumber,
        amount: activeAmount,
        phone: '09033149582',
        request_id: generateRequestID()
      });
      console.log(res);
      if (res?.success) {
        window.scrollTo({
  top: 0,
  behavior: "smooth",
});
        setLoading(false);
        setSuccess(true);
        setErrorMessage(null);
       const token = res?.response?.Vtu?.purchased_code
          console.log(res)
          setAccountBalance(Math.max(0, accountBalance - activeAmount));
      //  if (token) return 
      // const rawToken = "Toke-n : -2636-2054-4059-8275-7802";
      scrollToTop();
if(token) {
  const formattedToken = token
  .replace("Token : ", "")
  .replace(/-/g, "")
  .match(/.{1,4}/g)
  ?.join("-");
  console.log(formattedToken);
   setTokenGenerated(formattedToken)
}



// 2636 2054 4059 8275 7802
// const formattedToken = token.match(/.{1,4}/g).slice(0, 8).join("-");
// console.log(formattedToken)
    
       
      } else {
        setLoading(false);
        triggerError(res?.error || res?.message || 'Transaction failed. Please try again.');
      }
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      triggerError(err?.message || 'Transaction failed. Please check your connection and try again.');
    }
  };

  const selectedDiscoName = discos.find(d => d.id === selectedDisco)?.name || 'Choose distribution company';

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      {/* ── Main Content ── */}
      <main className="flex-1 p-6 space-y-5 max-w-6xl mx-auto w-full">
        {/* Page Header Checkmarks */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-text-muted">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Instant Token Delivery
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Secure Payments
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            All DisCos Supported
          </span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk']">Pay Electricity Bill</h2>
            <p className="text-xs text-text-muted mt-0.5">Complete your payment in a few secure steps.</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Checkout
          </span>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div ref={pageRef} className="flex items-start justify-between gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-4 shadow-lg shadow-rose-500/5 animate-[fadeIn_.3s_ease]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-rose-400">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-rose-400">Transaction Error</div>
                <div className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">{errorMessage}</div>
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

        {/* Success Banner */}
        {success && (
          <div className="flex flex-col gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 animate-[fadeIn_.3s_ease]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-400">Bill Payment Successful!</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    ₦{activeAmount.toLocaleString()} has been charged for meter {meterNumber}.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-emerald-400/60 hover:text-emerald-300 transition-colors p-1 shrink-0"
                aria-label="Dismiss success"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {tokenGenerated && (
              <div ref={pageRef} className="mt-1 p-3 bg-bg-dark-secondary border border-border rounded-xl flex flex-col gap-2 items-center justify-center">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Electricity Token</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold tracking-widest text-emerald-400 select-all">{tokenGenerated}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(tokenGenerated);
                      setTokenCopied(true);
                      setTimeout(() => setTokenCopied(false), 2000);
                    }}
                    className="p-1.5 rounded-lg border border-border bg-bg-dark hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200 shrink-0"
                    title="Copy token"
                    aria-label="Copy electricity token"
                  >
                    {tokenCopied ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-text-muted">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
                <span className="text-[10px] text-text-muted">
                  {tokenCopied ? (
                    <span className="text-emerald-400 font-medium">Token copied!</span>
                  ) : (
                    'Enter this token on your meter keyboard.'
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form and Package Selection */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-5">
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Quick Electricity Payment</h3>

                {/* Select Provider */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-text-gray">Select Provider</label>
                  <div className="relative">
                    <select
                      value={selectedDisco}
                      onChange={(e) => {
                        setSelectedDisco(e.target.value);
                        setIsVerified(false);
                      }}
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-text-muted">Choose distribution company</option>
                      {discos.map((d) => (
                        <option key={d.id} value={d.id} className="bg-bg-dark text-text-white">
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Meter Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-text-gray">Meter Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMeterType('prepaid')}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${meterType === 'prepaid'
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30 text-text-white'
                          : 'border-border bg-bg-dark-secondary text-text-gray hover:border-border-hover'
                        }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-colors ${meterType === 'prepaid' ? 'text-primary' : 'text-text-muted'}`}>
                        <circle cx="12" cy="12" r="10" />
                        {meterType === 'prepaid' && <circle cx="12" cy="12" r="6" fill="currentColor" />}
                      </svg>
                      Prepaid
                    </button>

                    <button
                      type="button"
                      onClick={() => setMeterType('Postpaid')}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${meterType === 'Postpaid'
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30 text-text-white'
                          : 'border-border bg-bg-dark-secondary text-text-gray hover:border-border-hover'
                        }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-colors ${meterType === 'Postpaid' ? 'text-primary' : 'text-text-muted'}`}>
                        <circle cx="12" cy="12" r="10" />
                        {meterType === 'Postpaid' && <circle cx="12" cy="12" r="6" fill="currentColor" />}
                      </svg>
                      Postpaid
                    </button>
                  </div>
                </div>

                {/* Meter Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-gray">Meter Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter meter number"
                      value={meterNumber}
                      onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                      {isVerifying ? (
                        <svg className="animate-spin w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                        </svg>
                      ) : isVerified ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-text-muted">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Verification Box */}
                {isVerified ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 space-y-3 animate-[fadeIn_.2s_ease]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">Customer Verification</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-text-muted">Customer Name</span>
                        <span className="text-text-white font-semibold">{customerName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-text-muted">Address</span>
                        <span className="text-text-white font-medium">{address}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-text-muted">DisCo</span>
                        <span className="text-text-white font-medium">{selectedDiscoName}</span>
                      </div>
                    </div>
                  </div>
                ) : isVerified === null ? (
                   <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 space-y-3 animate-[fadeIn_.2s_ease]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-red-400">Customer Verification</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Not Verified
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-text-muted">Customer Name</span>
                        <span className="text-text-white font-semibold">{customerName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-text-muted">Address</span>
                        <span className="text-text-white font-medium">{address}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-text-muted">DisCo</span>
                        <span className="text-text-white font-medium">{selectedDiscoName}</span>
                      </div>
                    </div>
                  </div>
                ): null}

                {/* Select Amount (Dropdown) */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-text-gray">Select Amount</label>
                    <div className="relative">
                      <select
                        value={amountType === 'custom' ? 'custom' : (selectedAmount ?? '')}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setAmountType('custom');
                            setSelectedAmount(null);
                          } else {
                            setAmountType('preset');
                            setSelectedAmount(Number(e.target.value));
                          }
                        }}
                        className="w-full pl-4 pr-10 py-3 appearance-none rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                      >
                        <option value="" disabled>Choose amount</option>
                        {presetAmounts.map((amt) => (
                          <option key={amt} value={amt} className="bg-bg-dark text-text-white">
                            ₦{amt.toLocaleString()}
                          </option>
                        ))}
                        <option value="custom" className="bg-bg-dark text-text-white">Custom Amount</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {amountType === 'custom' && (
                    <div className="space-y-1.5 animate-[fadeIn_.2s_ease]">
                      <label className="block text-xs font-medium text-text-gray">Custom Amount</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted select-none">₦</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          min={500}
                          max={100000}
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              {activeAmount > 0 && (
                <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
                  <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Payment Summary</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Amount</span>
                      <span className="text-text-white font-medium">₦{activeAmount.toLocaleString()}.00</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between bg-primary/5 -mx-5 px-5 py-3 rounded-b-2xl">
                    <div>
                      <div className="text-xs text-text-muted mb-0.5">Total Debit</div>
                      <div className="text-xl font-bold text-primary-light font-['Space_Grotesk']">₦{activeAmount.toLocaleString()}.00</div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Secure Payment
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pb-2">
                <button
                  type="submit"
                  disabled={loading || !selectedDisco || !meterNumber || activeAmount <= 0 || !isVerified}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Pay Electricity Bill
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-bg-card text-text-white text-sm font-semibold hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Recent Electricity Payments */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Recent Electricity Payments</h3>
                  <p className="text-xs text-text-muted mt-0.5">Track all electricity bill transactions in one place.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="px-3 py-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-white text-xs font-semibold hover:bg-bg-card-hover flex items-center gap-1.5 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-text-muted">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    Filters
                  </button>
                  <button type="button" className="px-3 py-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-white text-xs font-semibold hover:bg-bg-card-hover flex items-center gap-1.5 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-text-muted">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              {/* Search and Filter Pills */}
              <div className="space-y-3">
                <div className="relative">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by ID, meter or ref..."
                    value={txSearch}
                    onChange={(e) => { setTxSearch(e.target.value); setTxPage(1); }}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-bg-dark-secondary border border-border text-xs text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Payments Table */}
              <div className="overflow-x-auto border border-border rounded-xl">
                {paginatedElectricityTx.length > 0 ? (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-bg-dark-secondary border-b border-border text-text-gray font-medium">
                        <th className="p-3">Transaction ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Meter / Recipient</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-text-white">
                      {paginatedElectricityTx.map((tx: any) => {
                        const s = tx.status?.toLowerCase() === 'delivered' ? 'success' : tx.status?.toLowerCase();
                        const statusClass =
                          s === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : s === 'pending'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : s === 'failed'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-bg-dark border-border text-text-muted';
                        return (
                          <tr key={tx._id} className="hover:bg-bg-dark-secondary/40 transition-colors">
                            <td className="p-3 font-semibold text-text-white font-mono">{formatId(tx._id)}</td>
                            <td className="p-3 text-text-gray">{currentUser?.firstName ?? ''} {currentUser?.lastName ?? ''}</td>
                            <td className="p-3 font-mono text-text-muted">{tx.recipient ?? 'N/A'}</td>
                            <td className="p-3 font-semibold">₦{tx.amount?.toLocaleString()}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}`}>
                                {tx.status === 'delivered' ? 'success' : tx.status}
                              </span>
                            </td>
                            <td className="p-3 text-text-muted">{formatDate(tx.paidAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-10 text-center text-xs text-text-muted">
                    {txSearch ? 'No transactions match your search.' : 'No electricity transactions yet.'}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalTxPages > 1 && (
                <div className="flex items-center justify-between text-xs text-text-muted pt-2">
                  <span>
                    Showing {(txPage - 1) * TX_PER_PAGE + 1}–{Math.min(txPage * TX_PER_PAGE, filteredElectricityTx.length)} of {filteredElectricityTx.length} payments
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={txPage === 1}
                      onClick={() => setTxPage((p) => Math.max(p - 1, 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-white hover:bg-bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalTxPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setTxPage(i + 1)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold transition-all ${
                          txPage === i + 1 ? 'bg-primary text-white' : 'bg-bg-card border border-border text-text-gray hover:bg-bg-card-hover'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={txPage === totalTxPages}
                      onClick={() => setTxPage((p) => Math.min(p + 1, totalTxPages))}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-white hover:bg-bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Dashboard Information Cards */}
          <div className="space-y-4">
            {/* Wallet Card */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Wallet Card</h3>

              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-5 text-white space-y-4 shadow-lg">
                <div>
                  <span className="text-xs opacity-80 block">Available Balance</span>
                  <span className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] mt-1 block">{formatAmount(accountBalance, true)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[10px] opacity-75 uppercase tracking-wider block">Today's Spending</span>
                    <span className="text-sm font-semibold block mt-0.5">{formatAmount(getTodaysTransactionAmount() || 0, true)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-75 uppercase tracking-wider block">Total Payments</span>
                    <span className="text-sm font-semibold block mt-0.5">{formatAmount(allTransactions.length || 0, false)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M16 8h.01M22 10H2" />
                </svg>
                Fund Wallet
              </button>
            </div>

            {/* Saved Meters */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Saved Meters</h3>
              </div>

              <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 space-y-3 relative group">
                <span className="absolute top-4 right-4 text-[9px] font-bold text-text-gray bg-bg-dark border border-border px-2 py-0.5 rounded-full">
                  Primary
                </span>
                <div>
                  <div className="text-sm font-semibold text-text-white">Michael Home</div>
                  <div className="text-xs text-text-muted mt-1 space-y-0.5">
                    <div>Meter: 12345678901</div>
                    <div>DisCo: Ikeja Electric</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMeterNumber('');
                    setSelectedDisco('ikeja-electric');
                    setMeterType('prepaid');
                  }}
                  className="py-1.5 px-4 rounded-lg bg-bg-dark border border-border text-xs text-text-white hover:bg-bg-card-hover font-semibold transition-all duration-200 w-full"
                >
                  Use Meter
                </button>
              </div>
            </div>

            {/* Recent Token Purchase */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Recent Token Purchase</h3>

              <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 space-y-3">
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Token</span>
                  <span className="text-sm sm:text-base font-mono font-bold tracking-widest text-text-white block">
                    1234 5678 9012 3456
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs border-t border-border pt-3">
                  <div>
                    <span className="text-[10px] text-text-muted block">Amount</span>
                    <span className="font-semibold text-text-white mt-0.5 block">₦5,000</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Date</span>
                    <span className="font-semibold text-text-white mt-0.5 block">Today</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Status</span>
                    <span className="font-semibold text-emerald-400 mt-0.5 block">Success</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('1234567890123456');
                }}
                className="w-full py-2.5 rounded-xl border border-border bg-bg-dark text-text-white text-xs font-semibold hover:bg-bg-card-hover flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy Token
              </button>
            </div>

            {/* Token History */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Token History</h3>
                <p className="text-xs text-text-muted mt-0.5">Quick reference for previous tokens.</p>
              </div>

              <div className="space-y-3">
                {/* Token Card 1 */}
                <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex flex-col gap-2 relative group">
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block">Token Number</span>
                    <span className="text-sm font-mono font-bold tracking-widest text-text-white block">1234 5678 9012 3456</span>
                    <div className="grid grid-cols-2 gap-x-2 text-[10px] text-text-muted pt-1">
                      <div>Meter: <span className="text-text-white">12345678901</span></div>
                      <div>Amt: <span className="text-text-white">₦5k</span></div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText('1234567890123456')}
                    className="w-full py-1.5 rounded-lg border border-border flex items-center justify-center hover:bg-bg-card-hover hover:border-border-hover text-xs text-text-muted hover:text-text-white transition-all gap-1.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </button>
                </div>

                {/* Token Card 2 */}
                <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex flex-col gap-2 relative group">
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block">Token Number</span>
                    <span className="text-sm font-mono font-bold tracking-widest text-text-white block">9876 5432 1098 7654</span>
                    <div className="grid grid-cols-2 gap-x-2 text-[10px] text-text-muted pt-1">
                      <div>Meter: <span className="text-text-white">10987654321</span></div>
                      <div>Amt: <span className="text-text-white">₦10k</span></div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText('9876543210987654')}
                    className="w-full py-1.5 rounded-lg border border-border flex items-center justify-center hover:bg-bg-card-hover hover:border-border-hover text-xs text-text-muted hover:text-text-white transition-all gap-1.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Electricity Payment Tips */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Payment Tips</h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 bg-bg-dark-secondary border border-border/60 rounded-xl p-3 text-text-gray">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span className="leading-snug">Double-check meter number before payment.</span>
                </div>

                <div className="flex items-start gap-2 bg-bg-dark-secondary border border-border/60 rounded-xl p-3 text-text-gray">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="leading-snug">Tokens are delivered instantly after successful payment.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyElectricity;
