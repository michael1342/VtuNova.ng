import React, { useState, useEffect } from 'react';
import type { CablePackage } from '../../interface/user-page.interface';

const packagesData: Record<string, CablePackage[]> = {
  dstv: [
    { id: 'dstv-padi', name: 'DSTV Padi', price: 2500, channels: '40+ Channels' },
    { id: 'dstv-yanga', name: 'DSTV Yanga', price: 3500, channels: '60+ Channels' },
    { id: 'dstv-confam', name: 'DSTV Confam', price: 500, channels: '80+ Channels' },
    { id: 'dstv-compact', name: 'DSTV Compact', price: 7500, channels: '100+ Channels' },
    { id: 'dstv-compact-plus', name: 'DSTV Compact Plus', price: 10000, channels: '120+ Channels' },
    { id: 'dstv-premium', name: 'DSTV Premium', price: 15000, channels: '150+ Channels' },
  ],
  gotv: [
    { id: 'gotv-smallie', name: 'GOtv Smallie', price: 1500, channels: '35+ Channels' },
    { id: 'gotv-jinja', name: 'GOtv Jinja', price: 2800, channels: '45+ Channels' },
    { id: 'gotv-confam', name: 'GOtv Max', price: 4500, channels: '65+ Channels' },
    { id: 'gotv-max', name: 'GOtv Supa', price: 6000, channels: '75+ Channels' },
  ],
  startimes: [
    { id: 'startimes-nova', name: 'Nova', price: 1200, channels: '30+ Channels' },
    { id: 'startimes-basic', name: 'Basic', price: 2600, channels: '40+ Channels' },
    { id: 'startimes-smart', name: 'Smart', price: 3800, channels: '60+ Channels' },
    { id: 'startimes-super', name: 'Super', price: 6500, channels: '80+ Channels' },
  ],
};

const BuyCableSubscription = () => {
  const [provider, setProvider] = useState<'dstv' | 'gotv' | 'startimes'>('dstv');
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const packages = packagesData[provider];
  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);

  // Trigger simulated verification when smart card looks complete (e.g. 10 digits)
  useEffect(() => {
    if (smartCardNumber.trim().length >= 10) {
      setIsVerifying(true);
      setIsVerified(false);
      const timer = setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVerified(false);
      setIsVerifying(false);
    }
  }, [smartCardNumber]);

  const handleProviderSelect = (prov: 'dstv' | 'gotv' | 'startimes') => {
    setProvider(prov);
    setSelectedPackageId('');
    setIsVerified(false);
  };

  const handleReset = () => {
    setProvider('dstv');
    setSmartCardNumber('');
    setSelectedPackageId('');
    setIsVerified(false);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartCardNumber || !selectedPackage || !isVerified) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
  };

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
            Instant Activation
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Secure Transactions
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Multiple Providers Supported
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            24/7 Availability
          </span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk']">Cable TV Subscription</h2>
            <p className="text-xs text-text-muted mt-0.5">Renew your cable TV subscriptions instantly with secure and reliable payments.</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Checkout
          </span>
        </div>

        {/* Success Banner */}
        {success && selectedPackage && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 animate-[fadeIn_.3s_ease]">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-400">Cable TV Subscription Renewed!</div>
              <div className="text-xs text-text-muted mt-0.5">
                {selectedPackage.name} (₦{selectedPackage.price.toLocaleString()}) has been activated successfully on Smart Card {smartCardNumber}.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form and Package Selection */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-5">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Renew Subscription</h3>

              {/* Select Provider */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-text-gray">Select Provider</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleProviderSelect('dstv')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      provider === 'dstv'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border bg-bg-dark-secondary hover:border-border-hover'
                    }`}
                  >
                    <span className="text-sm font-bold text-text-white font-['Space_Grotesk']">DSTV</span>
                    <span className="text-[10px] text-text-muted mt-1 text-center">Premium satellite TV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderSelect('gotv')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      provider === 'gotv'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border bg-bg-dark-secondary hover:border-border-hover'
                    }`}
                  >
                    <span className="text-sm font-bold text-text-white font-['Space_Grotesk']">GOtv</span>
                    <span className="text-[10px] text-text-muted mt-1 text-center">Digital terrestrial TV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderSelect('startimes')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      provider === 'startimes'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border bg-bg-dark-secondary hover:border-border-hover'
                    }`}
                  >
                    <span className="text-sm font-bold text-text-white font-['Space_Grotesk']">Startimes</span>
                    <span className="text-[10px] text-text-muted mt-1 text-center">Affordable TV services</span>
                  </button>
                </div>
              </div>

              {/* Smart Card / IUC Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-gray">Smart Card / IUC Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter Smart Card / IUC Number"
                    value={smartCardNumber}
                    onChange={(e) => setSmartCardNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                    {isVerifying && (
                      <svg className="animate-spin w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                    )}
                    {isVerified && !isVerifying && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Verification Box */}
              {isVerified && (
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 space-y-3 animate-[fadeIn_.2s_ease]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block">Customer Name</span>
                      <span className="text-sm font-semibold text-text-white block mt-0.5">Michael Anazodo</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted text-right block">Account Status</span>
                      <span className="text-xs font-bold text-emerald-400 block mt-0.5 text-right">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-emerald-500/10 pt-2 text-xs">
                    <div>
                      <span className="text-[10px] text-text-muted block">Package</span>
                      <span className="text-text-white font-medium block mt-0.5">DSTV Compact</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted text-right block">Renewal Date</span>
                      <span className="text-text-white font-medium block mt-0.5 text-right">15 July 2026</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 w-fit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified
                  </div>
                </div>
              )}

              {/* Select Package */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-text-gray">Select Package</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 relative ${
                        selectedPackageId === pkg.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                          : 'border-border bg-bg-dark-secondary hover:border-border-hover'
                      }`}
                    >
                      <div className="text-xs font-bold text-text-white truncate">{pkg.name}</div>
                      <div className="text-base font-extrabold text-primary-light mt-1 font-['Space_Grotesk']">
                        ₦{pkg.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-text-muted mt-1">{pkg.channels}</div>
                      <span className="absolute bottom-3 right-3 text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                        HD
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscription Summary */}
            {selectedPackage && (
              <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Subscription Summary</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Selected Package</span>
                    <span className="text-text-white font-semibold">{selectedPackage.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Subscription Amount</span>
                    <span className="text-text-white font-bold text-sm">₦{selectedPackage.price.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pb-2">
              <button
                type="submit"
                disabled={loading || !smartCardNumber || !selectedPackage || !isVerified}
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
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Renew Subscription
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

          {/* Right Column: Dashboard Information Cards */}
          <div className="space-y-4">
            {/* Saved Beneficiaries */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-2 border-b border-border">Saved Beneficiaries</h3>
              
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3.5 space-y-3">
                <div>
                  <div className="text-xs font-bold text-text-white">Living Room DSTV</div>
                  <div className="text-[11px] text-text-muted mt-0.5">DSTV • 1234567890</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSmartCardNumber('1234567890');
                    setProvider('dstv');
                  }}
                  className="py-1.5 px-3 rounded-lg bg-bg-dark border border-border text-[11px] text-text-white hover:bg-bg-card-hover font-semibold transition-colors w-full text-center"
                >
                  Use Beneficiary
                </button>
              </div>
            </div>

            {/* Upcoming Renewals */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-2 border-b border-border">Upcoming Renewals</h3>
              
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3.5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-text-white">DSTV Compact</div>
                    <div className="text-[10px] text-text-muted mt-0.5">Expires in 3 Days</div>
                  </div>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
                    Expiring Soon
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSmartCardNumber('1234567890');
                    setProvider('dstv');
                    setSelectedPackageId('dstv-compact');
                  }}
                  className="py-1.5 px-3 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold text-[11px] transition-colors w-full text-center"
                >
                  Renew Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyCableSubscription;
