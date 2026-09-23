import React, { useMemo, useState, useEffect } from 'react';
import { getBenficiary, editBenficiary, deleteBeneficiary, saveBenficiary } from '../../api/user';
import paginate from '../../utils/pagination';
import { buyData as apiBuyData, getDataPlans } from '../../api/vtuApi';
import { useAuth } from '../../context/AuthContext';
import { formatAmount } from '../../utils/formatter';
import NetworkIcon from '../../components/NetworkIcon';
import type { BackendVariation, Beneficiary, FormattedPlan } from '../../interface/user-page.interface';

const networks = [
  { id: 'mtn', serviceId: 'mtn-data', name: 'MTN', color: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-400', desc: 'Everywhere you go' },
  { id: 'airtel', serviceId: 'airtel-data', name: 'Airtel', color: '#ef4444', bg: 'bg-red-500/15', text: 'text-red-400', desc: 'The smartphone network' },
  { id: 'glo', serviceId: 'glo-data', name: 'Glo', color: '#10b981', bg: 'bg-emerald-500/15', text: 'text-emerald-400', desc: 'Grandmasters of data' },
  { id: '9mobile', serviceId: '9mobile-data', name: '9mobile', color: '#3b82f6', bg: 'bg-blue-500/15', text: 'text-blue-400', desc: 'Here for you' },
];

export const parsePlanVariation = (plan: BackendVariation): FormattedPlan => {
  const amount = typeof plan.variation_amount === 'number'
    ? plan.variation_amount
    : parseFloat(plan.variation_amount) || 0;

  const rawName = plan.name || '';

  // Extract data volume (e.g. "100MB", "1.5GB", "10GB")
  const sizeMatch = rawName.match(/(\d+(?:\.\d+)?\s*(?:MB|GB|TB))/i);
  let dataSize = sizeMatch ? sizeMatch[1].toUpperCase().replace(/\s+/g, '') : '';
  if (!dataSize && plan.variation_code) {
    const codeMatch = plan.variation_code.match(/(\d+(?:\.\d+)?\s*(?:mb|gb|tb))/i);
    if (codeMatch) dataSize = codeMatch[1].toUpperCase();
  }
  if (!dataSize) dataSize = rawName;

  // Extract duration / validity (e.g. "24 hrs", "2 days", "30 days", "1 Week")
  let validity = '';
  const hyphenSplit = rawName.split('-');
  if (hyphenSplit.length > 1) {
    validity = hyphenSplit[hyphenSplit.length - 1].trim();
  } else {
    const durationMatch = rawName.match(/(\d+\s*(?:hrs?|hours?|days?|weeks?|months?)|1\s*Week|1\s*Month)/i);
    if (durationMatch) validity = durationMatch[1].trim();
  }
  if (!validity) validity = 'Standard';

  // Categorize plan into daily, weekly, monthly
  const valLower = validity.toLowerCase();
  const nameLower = rawName.toLowerCase();
  let category: 'daily' | 'weekly' | 'monthly' = 'monthly';

  if (
    valLower.includes('hr') ||
    valLower.includes('hour') ||
    valLower.includes('24') ||
    valLower.includes('1 day') ||
    valLower.includes('2 day') ||
    valLower.includes('3 day') ||
    valLower.includes('4 day') ||
    valLower.includes('5 day') ||
    valLower.includes('6 day') ||
    nameLower.includes('24 hrs')
  ) {
    category = 'daily';
  } else if (
    valLower.includes('week') ||
    valLower.includes('7 day') ||
    valLower.includes('14 day')
  ) {
    category = 'weekly';
  } else {
    category = 'monthly';
  }

  return {
    variation_code: plan.variation_code,
    rawName,
    name: `${dataSize} - ${validity}`,
    amount,
    fixedPrice: plan.fixedPrice || 'Yes',
    dataSize,
    validity,
    category,
  };
};

const BuyData: React.FC = () => {
  const { accountBalance } = useAuth();

  // Selection states
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [selectedPlanCode, setSelectedPlanCode] = useState('mtn-10mb-100');
  const [phone, setPhone] = useState('');

  // Plans state
  const [rawPlans, setRawPlans] = useState<BackendVariation[]>([]);
  const [isPlansLoading, setIsPlansLoading] = useState(false);

  // Phone verification state using Nigerian phone number regex
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(false);

  // Status & modal states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);

  // Beneficiary States
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoadingBeneficiaries, setIsLoadingBeneficiaries] = useState(false);
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [editingBen, setEditingBen] = useState<Beneficiary | null>(null);
  const [benName, setBenName] = useState('');
  const [benPhone, setBenPhone] = useState('');
  const [benNetwork, setBenNetwork] = useState('mtn');
  const [benActionLoading, setBenActionLoading] = useState(false);
  const [benSuccessMessage, setBenSuccessMessage] = useState<string | null>(null);
  const [benErrorMessage, setBenErrorMessage] = useState<string | null>(null);
  const [deletingBenId, setDeletingBenId] = useState<string | null>(null);

  // Beneficiary Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const totalPages = useMemo(() => Math.ceil(beneficiaries.length / pageSize), [beneficiaries.length, pageSize]);
  const paginatedBeneficiaries = useMemo(
    () => paginate(beneficiaries, currentPage, pageSize) as unknown as Beneficiary[],
    [beneficiaries, currentPage, pageSize]
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [beneficiaries.length, totalPages, currentPage]);

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setSuccess(false);
  };

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccess(false);
  };

  const clearBenMessages = () => {
    setBenSuccessMessage(null);
    setBenErrorMessage(null);
  };

  // Fetch data plans from backend when network changes
  useEffect(() => {
    if (!selectedNetwork) return;
    const fetchPlans = async () => {
      setIsPlansLoading(true);
      try {
        const netObj = networks.find((n) => n.id === selectedNetwork);
        const serviceID = netObj?.serviceId || `${selectedNetwork}-data`;
        const res = await getDataPlans({ serviceID });
        console.log(res)

        let variations: BackendVariation[] = [];
        if (res?.success && res.response) {
          variations =
            res.response?.Vtu?.content?.variations ||
            res.response?.content?.variations ||
            res.response?.variations ||
            res.response?.data ||
            [];
        }

        setRawPlans(variations);
      } catch (err) {
        console.error('Failed to fetch data plans:', err);
        setRawPlans([]);
      } finally {
        setIsPlansLoading(false);
      }
    };

    fetchPlans();
  }, [selectedNetwork]);

  // Parse variations using backend schema parser
  const parsedPlans = useMemo(() => {
    return rawPlans.map(parsePlanVariation);
  }, [rawPlans]);

  // Filter plans by selected category tab
  const filteredPlans = useMemo(() => {
    if (selectedCategory === 'all') return parsedPlans;
    return parsedPlans.filter((plan) => plan.category === selectedCategory);
  }, [parsedPlans, selectedCategory]);

  // Selected plan object
  const selectedPlan = useMemo(() => {
    return parsedPlans.find((plan) => plan.variation_code === selectedPlanCode) || parsedPlans[0];
  }, [parsedPlans, selectedPlanCode]);

  // Automatically update selected plan when parsed plans change
  useEffect(() => {
    if (parsedPlans.length > 0) {
      const exists = parsedPlans.some((p) => p.variation_code === selectedPlanCode);
      if (!exists) {
        setSelectedPlanCode(parsedPlans[0].variation_code);
      }
    }
  }, [parsedPlans]);

  // Phone number verification simulation using Nigerian phone regex
  useEffect(() => {
    const isValidPhone = /^0(70|80|81|90|91)\d{8}$/.test(phone);

    if (isValidPhone) {
      setIsVerifying(true);
      setIsVerified(false);

      const timer = setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
      }, 800);

      return () => clearTimeout(timer);
    }

    if (phone === '') {
      setIsVerified(null);
    } else {
      setIsVerified(false);
    }
    setIsVerifying(false);
  }, [phone]);

  // Fetch Beneficiaries from Backend
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setIsLoadingBeneficiaries(true);
      setBenErrorMessage(null);
      try {
        const res = await getBenficiary();
        if (res?.success === false) {
          setBenErrorMessage(res?.error || 'Failed to load beneficiaries');
          setBeneficiaries([]);
          return;
        }

        let list: any[] = [];
        if (res?.success) {
          list = res.data?.beneficiary || res.data?.data?.beneficiary || [];
        }
        if (list && list.length > 0) {
          const normalized: Beneficiary[] = list.map((item: any, idx: number) => ({
            _id: item._id || item.id || `ben-${idx}`,
            name: item.name || 'Beneficiary',
            number: item.phone || item.number || '',
            network: (item.network || item.service || 'mtn').toLowerCase(),
          }));
          setBeneficiaries(normalized);
        } else {
          setBeneficiaries([]);
        }
      } catch (err: any) {
        console.error('Failed to load beneficiaries:', err);
        setBenErrorMessage(err?.message || 'Failed to load beneficiaries.');
      } finally {
        setIsLoadingBeneficiaries(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
    clearMessages();
  };

  const handleReset = () => {
    setSelectedNetwork('mtn');
    setPhone('');
    setSelectedCategory('all');
    setIsVerified(null);
    clearMessages();
  };

  // Form submit handler -> Opens Pay Confirmation Modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!selectedNetwork) {
      triggerError('Please select a mobile network provider.');
      return;
    }

    const isValidNigerianPhone = /^0(70|80|81|90|91)\d{8}$/.test(phone);
    if (!phone || !isValidNigerianPhone) {
      triggerError('Please enter a valid 11-digit Nigerian phone number (starting with 070, 080, 081, 090, or 091).');
      return;
    }

    if (!selectedPlan) {
      triggerError('Please select a data bundle package.');
      return;
    }

    if (accountBalance !== null && accountBalance < selectedPlan.amount) {
      triggerError(`Insufficient wallet balance. You need ${formatAmount(selectedPlan.amount, true)} but have ${formatAmount(accountBalance, true)}.`);
      return;
    }

    setShowPayModal(true);
  };

  // Pay Action -> Sends required payload (BillersCode, amount, serviceID, variation_code, phone) to apiBuyData
  const handlePay = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    setSuccess(false);

    try {
      const netObj = networks.find((n) => n.id === selectedNetwork);
      const serviceID = netObj?.serviceId || `${selectedNetwork}-data`;

      const payload = {
        BillersCode: phone,
        amount: selectedPlan.amount,
        serviceID: serviceID,
        variation_code: selectedPlan.variation_code,
        phone: phone,
      };

      const res = await apiBuyData(payload as any);
      console.log('apiBuyData response:', res);

      if (res?.success) {
        setLoading(false);
        setShowPayModal(false);
        setSuccess(true);
        setErrorMessage(null);
      } else {
        setLoading(false);
        setShowPayModal(false);
        triggerError(res?.error || 'Data purchase transaction failed. Please try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setShowPayModal(false);
      triggerError(err?.message || 'Transaction failed. Please try again.');
    }
  };

  // Beneficiary Handlers
  const handleOpenAddBenModal = () => {
    clearBenMessages();
    setEditingBen(null);
    setBenName('');
    setBenPhone(phone || '');
    setBenNetwork(selectedNetwork || 'mtn');
    setShowAddBenModal(true);
  };

  const handleOpenEditBenModal = (b: Beneficiary) => {
    clearBenMessages();
    setEditingBen(b);
    setBenName(b.name);
    setBenPhone(b.number || b.phone || '');
    setBenNetwork(b.network || 'mtn');
    setShowAddBenModal(true);
  };

  const handleSaveBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!benName || !benPhone) return;

    setBenActionLoading(true);
    clearBenMessages();

    const payload = {
      _id: editingBen?._id,
      name: benName,
      phone: benPhone,
      service: benNetwork,
    };

    try {
      if (editingBen) {
        const res = await editBenficiary({ data: payload } as any);
        if (res?.success === false) {
          setBenErrorMessage(res?.error || 'Failed to update beneficiary.');
        } else {
          setBeneficiaries((prev) =>
            prev.map((item) =>
              item._id === editingBen._id
                ? { ...item, name: benName, number: benPhone, network: benNetwork }
                : item
            )
          );
          setBenSuccessMessage(`Beneficiary "${benName}" updated successfully!`);
          setShowAddBenModal(false);
          setBenName('');
          setBenPhone('');
        }
      } else {
        const res = await saveBenficiary({ data: payload } as any);
        if (res?.success === false) {
          setBenErrorMessage(res?.error || 'Failed to save beneficiary.');
        } else {
          const newId = res?.data?._id || res?._id || `ben-${Date.now()}`;
          const newBen: Beneficiary = {
            _id: newId,
            name: benName,
            number: benPhone,
            network: benNetwork,
          };
          setBeneficiaries((prev) => [newBen, ...prev]);
          setBenSuccessMessage(`Beneficiary "${benName}" added successfully!`);
          setShowAddBenModal(false);
          setBenName('');
          setBenPhone('');
        }
      }
    } catch (err: any) {
      console.error('Failed to save beneficiary:', err);
      setBenErrorMessage(err?.message || 'Failed to save beneficiary. Please try again.');
    } finally {
      setBenActionLoading(false);
    }
  };

  const handleDeleteBeneficiary = async (b: Beneficiary) => {
    if (!b._id) return;
    setDeletingBenId(b._id);
    clearBenMessages();

    try {
      const res = await deleteBeneficiary(b._id);
      if (res?.success === false) {
        setBenErrorMessage(res?.error || `Failed to delete beneficiary "${b.name}".`);
      } else {
        setBeneficiaries((prev) => prev.filter((item) => item._id !== b._id));
        setBenSuccessMessage(`Beneficiary "${b.name}" deleted successfully!`);
      }
    } catch (err: any) {
      console.error('Failed to delete beneficiary:', err);
      setBenErrorMessage(err?.message || `Failed to delete beneficiary "${b.name}".`);
    } finally {
      setDeletingBenId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      {/* ── Main Content ── */}
      <main className="flex-1 p-4 sm:p-6 space-y-5 max-w-6xl mx-auto w-full">
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
            All Networks Supported
          </span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk']">Buy Data</h2>
            <p className="text-xs text-text-muted mt-0.5">Subscribe to affordable data bundles with instant activation.</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Checkout
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
                <div className="text-sm font-semibold text-rose-400">Transaction Error</div>
                <div className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
                  {errorMessage}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400/60 hover:text-rose-300 p-1 transition-colors"
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
        {success && selectedPlan && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3.5 shadow-lg shadow-emerald-500/5 animate-[fadeIn_.3s_ease]">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-5 h-5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-emerald-400">Data Purchased Successfully!</div>
              <div className="text-xs text-text-muted mt-0.5">
                <span className="font-semibold text-text-white">{selectedPlan.dataSize} Data Bundle</span> ({formatAmount(selectedPlan.amount, true)}) has been activated on line <span className="font-mono text-emerald-300 font-semibold">{phone}</span>.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form and Package Selection */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-5">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Quick Data Purchase</h3>

              {/* Select Network */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-text-gray">Select Network</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {networks.map((net) => (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => handleNetworkSelect(net.id)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all duration-200 cursor-pointer group relative ${
                        selectedNetwork === net.id
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/30 shadow-[0_4px_16px_rgba(59,130,246,0.25)] scale-[1.02]'
                          : 'border-border bg-bg-dark-secondary hover:border-border-hover hover:bg-bg-card-hover'
                      }`}
                    >
                      <div className="relative mb-2 transition-transform duration-200 group-hover:scale-110">
                        <NetworkIcon networkId={net.id} size="lg" showBorder />
                        {selectedNetwork === net.id && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-bg-dark flex items-center justify-center shadow-sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-2.5 h-2.5 text-white">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-text-white font-['Space_Grotesk']">{net.name}</span>
                      <span className="text-[10px] text-text-muted mt-0.5 text-center line-clamp-1">{net.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number with Regex Validator */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-gray">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.37a16 16 0 006.72 6.72l1.74-1.74a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    placeholder="e.g. 08012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').substring(0, 11))}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-bg-dark-secondary border text-sm text-text-white placeholder:text-text-muted focus:outline-none transition-all duration-200 font-mono ${
                      isVerified === false && phone.length > 0
                        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                        : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/30'
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                    {isVerifying && (
                      <svg className="animate-spin w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                    )}
                    {isVerified === true && !isVerifying && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {isVerified === false && phone.length > 0 && !isVerifying && (
                      <span className="text-rose-400 text-xs font-bold" title="Invalid Nigerian phone number">✕</span>
                    )}
                  </div>
                </div>
                {isVerified === false && phone.length > 0 && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    Please enter a valid 11-digit Nigerian phone number (070, 080, 081, 090, 091).
                  </p>
                )}
              </div>

              {/* Customer Verification Box */}
              {isVerified === true && (
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 space-y-3 animate-[fadeIn_.2s_ease]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block">Phone Number</span>
                      <span className="text-sm font-semibold font-mono text-text-white block mt-0.5">{phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted text-right block">Network Status</span>
                      <span className="text-xs font-bold text-emerald-400 block mt-0.5 text-right">Verified Active</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 w-fit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Ready for Data Bundle Top-up
                  </div>
                </div>
              )}

              {/* Plan Category and Select Data Bundle */}
              <div className="space-y-4">
                {/* Category Tab Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-text-gray">Plan Category</label>
                    <span className="text-[11px] text-text-muted">
                      Showing {filteredPlans.length} plan{filteredPlans.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-bg-dark-secondary border border-border p-1">
                    {[
                      { id: 'all', label: 'All Plans' },
                      { id: 'daily', label: 'Daily' },
                      { id: 'weekly', label: 'Weekly' },
                      { id: 'monthly', label: 'Monthly' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-primary text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                            : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan Selection Visual Cards */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-text-gray">Select Data Package</label>
                  {isPlansLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-bg-dark-secondary border border-border/60 rounded-xl p-3.5 space-y-2 animate-pulse">
                          <div className="h-4 bg-border/60 rounded w-16"></div>
                          <div className="h-3 bg-border/40 rounded w-12"></div>
                          <div className="h-5 bg-border/60 rounded w-20 pt-1"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredPlans.length === 0 ? (
                    <div className="text-center py-6 bg-bg-dark-secondary rounded-xl border border-border text-xs text-text-muted">
                      No data plans available for this category.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {filteredPlans.map((plan) => {
                        const isSelected = selectedPlanCode === plan.variation_code;
                        return (
                          <button
                            key={plan.variation_code}
                            type="button"
                            onClick={() => setSelectedPlanCode(plan.variation_code)}
                            className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-primary bg-primary/10 ring-1 ring-primary/40 shadow-[0_4px_20px_rgba(59,130,246,0.25)]'
                                : 'border-border bg-bg-dark-secondary hover:border-border-hover hover:bg-bg-card-hover'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}

                            <div>
                              <div className="text-sm font-bold text-text-white font-['Space_Grotesk'] tracking-tight">
                                {plan.dataSize}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-text-muted">
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>{plan.validity}</span>
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-400 font-mono">
                                {formatAmount(plan.amount, true)}
                              </span>
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold text-text-muted bg-bg-card">
                                {plan.fixedPrice === 'Yes' ? 'Fixed' : 'Flex'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Dropdown Menu (Alternative Option Selector) */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-medium text-text-muted">Or Choose From Dropdown List</label>
                  <div className="relative">
                    <select
                      value={selectedPlanCode}
                      onChange={(e) => setSelectedPlanCode(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 appearance-none rounded-xl bg-bg-dark-secondary border border-border text-xs text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 cursor-pointer"
                    >
                      {parsedPlans.map((plan) => (
                        <option key={plan.variation_code} value={plan.variation_code} className="bg-bg-dark text-text-white">
                          {plan.dataSize} - {formatAmount(plan.amount, true)} ({plan.validity}) [plan: {plan.variation_code}]
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            {selectedPlan && (
              <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Order Summary</h3>
                  <span className="text-[10px] font-mono font-medium text-text-muted bg-bg-dark-secondary px-2 py-0.5 rounded border border-border">
                    {selectedPlan.variation_code}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Network</span>
                    <div className="flex items-center gap-1.5">
                      <NetworkIcon networkId={selectedNetwork} size="sm" />
                      <span className="text-text-white font-semibold uppercase">{selectedNetwork}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Data Volume</span>
                    <span className="text-text-white font-bold font-['Space_Grotesk']">{selectedPlan.dataSize}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Validity Period</span>
                    <span className="text-text-white font-medium">{selectedPlan.validity}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Fixed Price</span>
                    <span className="text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {selectedPlan.fixedPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-text-white font-medium">Total Amount</span>
                    <span className="text-text-white font-bold text-base text-emerald-400 font-mono">
                      {formatAmount(selectedPlan.amount, true)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pb-2">
              <button
                type="submit"
                disabled={!selectedNetwork || !phone || !selectedPlan || !isVerified}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
                  <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0M12 20h.01" />
                </svg>
                Buy Data
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-bg-card text-text-white text-sm font-semibold hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Right Column: Beneficiaries List with Add, Edit, Delete & Pagination */}
          <div className="space-y-4">
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Saved Beneficiaries</h3>
                <button
                  type="button"
                  onClick={handleOpenAddBenModal}
                  className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary-light text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add New
                </button>
              </div>

              {/* BENEFICIARY SUCCESS BANNER */}
              {benSuccessMessage && (
                <div className="flex items-start justify-between gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs animate-[fadeIn_.2s_ease]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-emerald-400">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="font-medium">{benSuccessMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBenSuccessMessage(null)}
                    className="text-emerald-400/60 hover:text-emerald-300 p-0.5 transition-colors"
                    aria-label="Dismiss success message"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              {/* BENEFICIARY ERROR BANNER */}
              {benErrorMessage && (
                <div className="flex items-start justify-between gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-xs animate-[fadeIn_.2s_ease]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-rose-400">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <span className="font-medium leading-tight">{benErrorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBenErrorMessage(null)}
                    className="text-rose-400/60 hover:text-rose-300 p-0.5 transition-colors"
                    aria-label="Dismiss error message"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              {isLoadingBeneficiaries ? (
                <div className="space-y-3 py-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-bg-dark-secondary border border-border/60 rounded-xl p-3.5 space-y-3 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3.5 bg-border/60 rounded w-28"></div>
                          <div className="h-2.5 bg-border/40 rounded w-36"></div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-border/60"></div>
                      </div>
                      <div className="h-7 bg-border/40 rounded-lg w-full"></div>
                    </div>
                  ))}
                </div>
              ) : beneficiaries.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary-light">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <p className="text-xs text-text-muted">No saved beneficiaries yet.</p>
                  <button
                    type="button"
                    onClick={handleOpenAddBenModal}
                    className="text-xs text-primary-light font-semibold hover:underline"
                  >
                    Add your first beneficiary
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 pr-1">
                    {paginatedBeneficiaries.map((b) => (
                      <div key={b._id} className="bg-bg-dark-secondary border border-border rounded-xl p-3.5 space-y-3 hover:border-border-hover transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-text-white">{b.name}</div>
                            <div className="text-[11px] text-text-muted font-mono capitalize">
                              {b.network} • {b.number || b.phone}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <NetworkIcon networkId={b.network || 'mtn'} size="sm" />
                            <button
                              type="button"
                              onClick={() => handleOpenEditBenModal(b)}
                              disabled={deletingBenId === b._id}
                              className="p-1 text-text-muted hover:text-text-white transition-colors disabled:opacity-40"
                              title="Edit beneficiary"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBeneficiary(b)}
                              disabled={deletingBenId === b._id}
                              className="p-1 text-text-muted hover:text-rose-400 transition-colors disabled:opacity-40"
                              title="Delete beneficiary"
                            >
                              {deletingBenId === b._id ? (
                                <svg className="animate-spin w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPhone((b.number || b.phone || '').replace(/\D/g, ''));
                            setSelectedNetwork(b.network || 'mtn');
                          }}
                          className="py-1.5 px-3 rounded-lg bg-bg-dark border border-border text-[11px] text-text-white hover:bg-bg-card-hover font-semibold transition-colors w-full text-center cursor-pointer"
                        >
                          Use Beneficiary
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* PAGINATION CONTROLS */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-border select-none">
                      <span className="text-[11px] text-text-muted">
                        Page {currentPage} of {totalPages} ({beneficiaries.length} total)
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="w-7 h-7 rounded-lg bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:bg-bg-card-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          aria-label="Previous Page"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                              currentPage === page
                                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                                : 'bg-bg-dark-secondary border border-border text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages || totalPages === 0}
                          className="w-7 h-7 rounded-lg bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:bg-bg-card-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          aria-label="Next Page"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── PAY CONFIRMATION MODAL ── */}
        {showPayModal && selectedPlan && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_.2s_ease]">
            <div className="bg-bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative animate-[scaleUp_.2s_ease]">

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0M12 20h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Confirm Data Purchase</h3>
                    <p className="text-[11px] text-text-muted">Review order details before payment</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="text-text-muted hover:text-text-white p-1 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Order Details */}
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Mobile Network:</span>
                  <span className="text-text-white font-semibold uppercase">{selectedNetwork}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Recipient (BillersCode):</span>
                  <span className="text-text-white font-mono font-semibold">{phone}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Data Package:</span>
                  <span className="text-text-white font-semibold">{selectedPlan.dataSize} ({selectedPlan.validity})</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Variation Code:</span>
                  <span className="text-text-muted font-mono">{selectedPlan.variation_code}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="text-xs font-medium text-text-gray">Total Amount:</span>
                  <span className="text-xl font-bold font-['Space_Grotesk'] text-emerald-400">
                    {formatAmount(selectedPlan.amount, true)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="w-1/3 py-3 rounded-xl border border-border hover:bg-bg-card-hover text-text-gray hover:text-text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={loading}
                  className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-xs shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatAmount(selectedPlan.amount, true)}`
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── ADD / EDIT BENEFICIARY MODAL ── */}
        {showAddBenModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_.2s_ease]">
            <div className="bg-bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative animate-[scaleUp_.2s_ease]">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">
                  {editingBen ? 'Edit Beneficiary' : 'Add New Beneficiary'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddBenModal(false)}
                  className="text-text-muted hover:text-text-white p-1 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveBeneficiary} className="space-y-4">
                {benErrorMessage && (
                  <div className="flex items-center justify-between gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-rose-400 shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{benErrorMessage}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-gray">Beneficiary Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mum, John D."
                    value={benName}
                    onChange={(e) => setBenName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-gray">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="08012345678"
                    value={benPhone}
                    onChange={(e) => setBenPhone(e.target.value.replace(/\D/g, '').substring(0, 11))}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-gray">Network Provider</label>
                  <select
                    value={benNetwork}
                    onChange={(e) => setBenNetwork(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
                  >
                    {networks.map((net) => (
                      <option key={net.id} value={net.id} className="bg-bg-dark">
                        {net.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddBenModal(false)}
                    className="w-1/3 py-3 rounded-xl border border-border hover:bg-bg-card-hover text-text-gray hover:text-text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={benActionLoading}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-xs shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {benActionLoading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>{editingBen ? 'Updating...' : 'Saving...'}</span>
                      </>
                    ) : (
                      editingBen ? 'Save Changes' : 'Add Beneficiary'
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyData;
