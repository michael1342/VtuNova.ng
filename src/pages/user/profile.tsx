import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/themeContext';
import { useAuth } from '../../context/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CameraIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  KeyIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  BellIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  IdentificationIcon,
  MapPinIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'danger';
}

interface ActivityEvent {
  id: string;
  type: 'profile' | 'security' | 'wallet' | 'transaction' | 'referral';
  description: string;
  time: string;
}

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  // --- States ---
  const [formData, setFormData] = useState({
    fullName: 'Michael Anazodo',
    email: 'michael@example.com',
    phone: '+234 803 123 4567',
    dob: '1998-05-15',
    gender: 'Male',
  });
  const [originalFormData, setOriginalFormData] = useState({ ...formData });
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Security Toggles
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [show2FaModal, setShow2FaModal] = useState(false);
  const [securityScore, setSecurityScore] = useState(85);

  // Password fields
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Photo
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Preferences Toggles
  const [preferences, setPreferences] = useState({
    emailNotif: true,
    smsNotif: true,
    pushNotif: false,
    language: 'English',
  });

  // Danger Zone Modals
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

  // Toast Alerts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [_, setCopiedCode] = useState(false);
  const [__, setCopiedLink] = useState(false);

  // Developer Control Switcher
  const [isEmptyActivity, setIsEmptyActivity] = useState(false);

  // Mock Variables
  const referralCode = 'SWT-MICHAEL-248';
  const referralLink = `https://swifttopup.com/ref/${referralCode}`;
  
  const [activities, setActivities] = useState<ActivityEvent[]>([
    { id: 'act-1', type: 'profile', description: 'Profile information updated successfully.', time: '10 mins ago' },
    { id: 'act-2', type: 'security', description: 'Password changed successfully.', time: '2 hours ago' },
    { id: 'act-3', type: 'wallet', description: 'Wallet funded: ₦20,000 via Bank Transfer.', time: 'Today, 8:14 AM' },
    { id: 'act-4', type: 'transaction', description: 'Purchased ₦1,000 MTN Airtime.', time: 'Today, 10:24 AM' },
    { id: 'act-5', type: 'referral', description: 'Michael A. registered using your referral code.', time: 'Yesterday' },
  ]);

  // --- Functions ---
  const triggerToast = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const handleCopy = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      triggerToast('Referral code copied to clipboard!', 'success');
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      triggerToast('Referral link copied to clipboard!', 'success');
    }
  };

  const handleInfoSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      triggerToast('Please fill out all required fields.', 'danger');
      return;
    }
    setOriginalFormData({ ...formData });
    setIsEditingInfo(false);
    
    // Add new activity log
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'profile',
      description: 'Profile information updated successfully.',
      time: 'Just now',
    };
    setActivities(prev => [newAct, ...prev]);
    triggerToast('Personal details updated successfully!', 'success');
  };

  const handleInfoCancel = () => {
    setFormData({ ...originalFormData });
    setIsEditingInfo(false);
    triggerToast('Edits cancelled.', 'info');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      triggerToast('All password fields are required.', 'danger');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      triggerToast('New password confirmation does not match.', 'danger');
      return;
    }
    if (passwords.new.length < 6) {
      triggerToast('New password must be at least 6 characters.', 'danger');
      return;
    }
    
    // Clear state
    setPasswords({ current: '', new: '', confirm: '' });
    
    // Log activity
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'security',
      description: 'Account security password changed.',
      time: 'Just now',
    };
    setActivities(prev => [newAct, ...prev]);
    triggerToast('Password updated successfully!', 'success');
  };

  const handle2FaToggle = () => {
    if (!twoFactorAuth) {
      setShow2FaModal(true);
    } else {
      setTwoFactorAuth(false);
      setSecurityScore(prev => prev - 15);
      triggerToast('Two-Factor Authentication has been disabled.', 'danger');
    }
  };

  const handleConfirm2Fa = () => {
    setTwoFactorAuth(true);
    setShow2FaModal(false);
    setSecurityScore(prev => prev + 15);
    triggerToast('Two-Factor Authentication configured successfully!', 'success');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePhoto(event.target.result as string);
          triggerToast('Profile photo updated successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary text-text-gray font-sans transition-colors duration-200">
      
      {/* ── Developer controls panel ── */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 px-6 flex items-center justify-between text-xs text-blue-500">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 animate-pulse" />
          <span><strong>Developer Demo Controls:</strong> Switch states to preview design features.</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEmptyActivity(!isEmptyActivity)}
            className="bg-blue-500 text-white font-semibold rounded-md px-3 py-1 hover:bg-blue-600 transition-colors text-[11px]"
          >
            Toggle Empty Activity Timeline ({isEmptyActivity ? 'Populated' : 'EmptyState'})
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-white font-['Space_Grotesk'] leading-tight">
              My Profile
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Manage your personal information, account details, security settings, and preferences.
            </p>
          </div>
          {/* Header badges */}
          <div className="grid grid-cols-2 sm:flex items-center gap-x-4 gap-y-2 text-xs font-semibold text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Secure Account</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Verified Identity</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Protected Escrows</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Privacy Controls</span>
            </div>
          </div>
        </div>

        {/* ── Profile Cover Banner Card ── */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          
          {/* Card Top Cover Banner: Premium Gradient with abstract overlay */}
          <div className="h-32 md:h-40 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 relative overflow-hidden">
            {/* Ambient visual overlay decoration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="90" cy="10" r="30" fill="white" />
                <circle cx="10" cy="90" r="20" fill="white" />
                <path d="M-20,50 Q40,0 80,70 T120,50" fill="none" stroke="white" strokeWidth="4" />
              </svg>
            </div>
            {/* Badge indicating Account level in cover banner */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Level 2 Gold Member
            </div>
          </div>

          {/* Card Body: Relative layout allowing the avatar to overlap the banner */}
          <div className="p-6 pt-0 relative flex flex-col lg:flex-row gap-6 justify-between items-stretch">
            
            {/* Avatar Uploader (overlapping cover image) and User Profile Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 -mt-12 md:-mt-16 relative z-10">
              
              {/* Photo Upload Container */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 border-4 border-bg-card overflow-hidden flex items-center justify-center text-white text-3xl font-extrabold font-['Space_Grotesk'] shadow-lg">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>MA</span>
                  )}
                </div>
                <label className="absolute inset-1 bg-black/60 opacity-0 group-hover:opacity-100 rounded-xl flex flex-col items-center justify-center text-[10px] text-white font-bold cursor-pointer transition-opacity">
                  <CameraIcon className="w-5 h-5 mb-1" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>

              {/* User Bio Details */}
              <div className="text-center md:text-left space-y-2 pt-1 md:pt-14 mt-10">
                <div>
                  <h3 className="text-xl font-extrabold text-text-white font-['Space_Grotesk'] leading-none">
                    {formData.fullName}
                  </h3>
                  <p className="text-xs text-text-muted mt-1.5 flex items-center justify-center md:justify-start gap-1">
                    <EnvelopeIcon className="w-3.5 h-3.5" />
                    <span>{formData.email}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                    <CheckIcon className="w-3 h-3" />
                    <span>Email Verified</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                    <CheckIcon className="w-3 h-3" />
                    <span>Phone Verified</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
                    <ExclamationTriangleIcon className="w-3 h-3 text-amber-500" />
                    <span>ID Pending</span>
                  </span>
                </div>
                
                <div className="text-[11px] text-text-muted pt-0.5">
                  Member since: <span className="font-semibold text-text-gray">January 2026</span>
                </div>
              </div>
            </div>

            {/* Premium Stat cards inside profile card, styled beautifully with glow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center shrink-0 w-full lg:w-auto pt-6 lg:pt-8 border-t lg:border-t-0 border-border lg:mt-0 mt-4">
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3.5 flex flex-col justify-between h-20 min-w-[105px] flex-1 hover:border-blue-500/35 transition-colors">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Transactions</span>
                <span className="text-lg font-bold text-text-white font-['Space_Grotesk']">148</span>
              </div>
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3.5 flex flex-col justify-between h-20 min-w-[115px] flex-1 hover:border-emerald-500/35 transition-colors">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Wallet Bal</span>
                <span className="text-lg font-extrabold text-emerald-400 font-['Space_Grotesk']">₦150,000</span>
              </div>
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3.5 flex flex-col justify-between h-20 min-w-[105px] flex-1 hover:border-purple-500/35 transition-colors">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Referrals</span>
                <span className="text-lg font-bold text-text-white font-['Space_Grotesk']">7</span>
              </div>
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3.5 flex flex-col justify-between h-20 min-w-[105px] flex-1 hover:border-cyan-500/35 transition-colors">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Tier Level</span>
                <span className="text-lg font-bold text-blue-500 font-['Space_Grotesk']">Level 2</span>
              </div>
            </div>

          </div>

        </div>

        {/* ── Personal Info & Read-Only Stats Split ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Personal Information editable Card */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Personal Information</h3>
                  <p className="text-xs text-text-muted mt-0.5">Edit and save your personal contact details</p>
                </div>
                {!isEditingInfo && (
                  <button
                    onClick={() => setIsEditingInfo(true)}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-600 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/5 transition-colors"
                  >
                    Edit Info
                  </button>
                )}
              </div>

              <form onSubmit={handleInfoSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      disabled={!isEditingInfo}
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="bg-bg-dark-secondary disabled:opacity-75 border border-border text-xs text-text-white rounded-xl pl-9 pr-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                      <EnvelopeIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      disabled={!isEditingInfo}
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-bg-dark-secondary disabled:opacity-75 border border-border text-xs text-text-white rounded-xl pl-9 pr-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone number */}
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                      <PhoneIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      disabled={!isEditingInfo}
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-bg-dark-secondary disabled:opacity-75 border border-border text-xs text-text-white rounded-xl pl-9 pr-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Date of Birth</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                      <CalendarIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="date"
                      disabled={!isEditingInfo}
                      value={formData.dob}
                      onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                      className="bg-bg-dark-secondary disabled:opacity-75 border border-border text-xs text-text-white rounded-xl pl-9 pr-4 py-2 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Gender</label>
                  <select
                    disabled={!isEditingInfo}
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="bg-bg-dark-secondary disabled:opacity-75 border border-border text-xs text-text-white rounded-xl px-3 py-2.5 w-full focus:outline-none focus:border-blue-500/50"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                {isEditingInfo && (
                  <div className="md:col-span-2 flex items-center justify-end gap-2 pt-4 border-t border-border mt-2">
                    <button
                      type="button"
                      onClick={handleInfoCancel}
                      className="bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-bold rounded-xl px-4 py-2 text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl px-4 py-2 text-xs transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Account Information Card (Read-only) */}
          <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Account Details</h3>
                <p className="text-xs text-text-muted mt-0.5">Read-only identification identifiers</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-text-muted">Customer ID:</span>
                  <span className="font-semibold text-text-white font-mono">SWT-USR-49210</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-text-muted">Username:</span>
                  <span className="font-semibold text-text-white">michael_anazodo</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-text-muted">Joined Date:</span>
                  <span className="font-semibold text-text-white">12 January 2026</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-text-muted">Last Logged:</span>
                  <span className="font-semibold text-text-white">Today, 9:32 PM</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-text-muted">Status:</span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Account
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-text-muted">Referral Code:</span>
                  <div className="flex items-center gap-1 bg-bg-dark-secondary px-2 py-1 rounded-lg border border-border font-mono text-text-white">
                    <span>{referralCode}</span>
                    <button
                      onClick={() => handleCopy(referralCode, 'code')}
                      className="text-blue-500 hover:text-blue-600 ml-1.5"
                    >
                      <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Security & Verification Centers ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Security Center Password / 2FA / Session Logs */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Security Settings</h3>
              <p className="text-xs text-text-muted mt-0.5">Manage authentication, login sessions, and 2FA</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password update form */}
              <form onSubmit={handlePasswordUpdate} className="space-y-3.5">
                <h4 className="text-xs font-bold text-text-white border-b border-border/50 pb-1.5 flex items-center gap-1.5">
                  <KeyIcon className="w-4 h-4 text-blue-500" />
                  <span>Update Password</span>
                </h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-text-gray font-semibold">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-4 py-2 w-full focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-text-gray font-semibold">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-4 py-2 w-full focus:outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-text-gray font-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-4 py-2 w-full focus:outline-none"
                    placeholder="Match new password"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl px-4 py-2 text-xs transition-colors"
                >
                  Update Password
                </button>
              </form>

              {/* Two-Factor & Login Activity */}
              <div className="space-y-5">
                
                {/* 2FA section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text-white border-b border-border/50 pb-1.5 flex items-center gap-1.5">
                    <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                    <span>Two-Factor Authentication (2FA)</span>
                  </h4>
                  <div className="flex items-center justify-between bg-bg-dark-secondary border border-border rounded-xl p-3 text-xs">
                    <div>
                      <div className="font-semibold text-text-white">Status: {twoFactorAuth ? 'Enabled' : 'Disabled'}</div>
                      <p className="text-[10px] text-text-muted mt-0.5">Secure logins with OTP verification code</p>
                    </div>
                    
                    <button
                      onClick={handle2FaToggle}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        twoFactorAuth ? 'bg-blue-500' : 'bg-zinc-600'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        twoFactorAuth ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (!twoFactorAuth) handle2FaToggle();
                      else triggerToast("2FA is already configured.", "info");
                    }}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-600"
                  >
                    Configure 2FA Setup
                  </button>
                </div>

                {/* Login activity logs */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-text-white border-b border-border/50 pb-1.5 flex items-center gap-1.5">
                    <DevicePhoneMobileIcon className="w-4 h-4 text-blue-500" />
                    <span>Login Activity Logs</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-bg-dark-secondary border border-border">
                      <div className="flex gap-2">
                        <MapPinIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-text-white">Chrome, Windows • IP 102.89.34.110</div>
                          <div className="text-[10px] text-text-muted">Lagos, Nigeria (Active Now)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 rounded-lg bg-bg-dark-secondary border border-border opacity-70">
                      <div className="flex gap-2">
                        <MapPinIcon className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-text-white">Safari, iPhone • IP 192.168.1.4</div>
                          <div className="text-[10px] text-text-muted">Abuja, Nigeria (3 days ago)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      triggerToast("Displaying all 10 active login sessions", "info");
                    }}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-600"
                  >
                    View Full Active Sessions Activity
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Account Verification Center */}
          <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Verification Center</h3>
                <p className="text-xs text-text-muted mt-0.5">Track and complete identity verifications</p>
              </div>

              {/* Progress Tracker */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-text-white">
                    <span>Email Verification</span>
                    <span className="text-emerald-400 font-bold">100% Verified</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-dark-secondary rounded-full overflow-hidden border border-border">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-text-white">
                    <span>Phone Verification</span>
                    <span className="text-emerald-400 font-bold">100% Verified</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-dark-secondary rounded-full overflow-hidden border border-border">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-text-white">
                    <span>Identity Verification (BVN/NIN)</span>
                    <span className="text-amber-500 font-bold">60% Pending</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-dark-secondary rounded-full overflow-hidden border border-border">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-text-white">
                    <span>Address Verification</span>
                    <span className="text-text-muted font-bold">0% Unverified</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-dark-secondary rounded-full overflow-hidden border border-border">
                    <div className="bg-zinc-600 h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <button
                onClick={() => triggerToast("Opening BVN/NIN Verification Portal", "info")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-2 px-4 text-xs transition-colors"
              >
                Verify Identity Details
              </button>
              <button
                onClick={() => triggerToast("Upload utilities receipt documents window opened", "info")}
                className="w-full bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-semibold rounded-xl py-2 px-4 text-xs transition-colors"
              >
                Upload Address Proof Documents
              </button>
            </div>
          </div>

        </div>

        {/* ── Wallet, Referral, and Security Score Widgets ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Wallet Information Card */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs text-text-white font-bold font-['Space_Grotesk']">Wallet Overview</span>
                <CreditCardIcon className="w-5 h-5 text-emerald-500" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">Balance:</span>
                  <span className="font-extrabold text-text-white font-mono">₦150,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Funding:</span>
                  <span className="font-semibold text-text-white font-mono">₦450,200.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Spent:</span>
                  <span className="font-semibold text-text-white font-mono">₦300,200.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Success Rate:</span>
                  <span className="font-bold text-emerald-400 font-mono">99.2% (147/148)</span>
                </div>
              </div>
            </div>

            <Link
              to="/user/transactions"
              className="mt-6 w-full text-center bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-semibold rounded-xl py-2 px-4 text-xs transition-all flex items-center justify-center gap-1"
            >
              <ClockIcon className="w-4 h-4 text-blue-500" />
              <span>View Wallet Transaction History</span>
            </Link>
          </div>

          {/* Referral Information Card */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs text-text-white font-bold font-['Space_Grotesk']">Referral Network</span>
                <TrophyIcon className="w-5 h-5 text-purple-500" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">Code:</span>
                  <span className="font-bold font-mono text-text-white">{referralCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Network Size:</span>
                  <span className="font-semibold text-text-white">7 Active Invites</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Referrals Earnings:</span>
                  <span className="font-extrabold text-emerald-400 font-mono">₦85,000.00</span>
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-text-muted block">Sharing URL link:</span>
                  <span className="text-xs font-mono text-blue-500 truncate block mt-0.5">{referralLink}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                onClick={() => handleCopy(referralLink, 'link')}
                className="bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-bold rounded-xl py-2 text-xs transition-all"
              >
                Copy Link
              </button>
              <Link
                to="/user/referrals"
                className="bg-blue-500 hover:bg-blue-600 text-white text-center font-bold rounded-xl py-2 text-xs transition-colors"
              >
                Go to Referrals
              </Link>
            </div>
          </div>

          {/* Account Security Score (Visual Gauge) */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs text-text-white font-bold font-['Space_Grotesk']">Security Score</span>
                <span className="text-[11px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">Strong</span>
              </div>

              <div className="flex items-center gap-4 py-1">
                {/* Circular indicator gauge */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-border)" strokeWidth="5" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="5" 
                      strokeDasharray={176} 
                      strokeDashoffset={176 - (176 * securityScore) / 100}
                      strokeLinecap="round" 
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-text-white font-['Space_Grotesk']">{securityScore}%</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-text-white">Security Checklist</div>
                  <p className="text-[10px] text-text-muted">Follow guides to reach 100% protection</p>
                </div>
              </div>

              <ul className="space-y-1.5 text-[10px] text-text-muted leading-relaxed pl-3 list-disc">
                <li className="text-emerald-400 font-semibold list-none">✓ Verified email address</li>
                <li className={twoFactorAuth ? "text-emerald-400 font-semibold list-none" : "list-none"}>
                  {twoFactorAuth ? "✓ Enable 2FA passcode log" : "• Add Two-Factor Auths (+15%)"}
                </li>
                <li>Verify your identity documents (+20%)</li>
              </ul>
            </div>
            
            <button
              onClick={() => {
                if (!twoFactorAuth) handle2FaToggle();
                else triggerToast("Identity Verification Pending reviewer confirmation", "info");
              }}
              className="mt-4 w-full bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-semibold rounded-xl py-2 px-4 text-xs transition-colors"
            >
              Improve Security Score
            </button>
          </div>

        </div>

        {/* ── Preferences Section & Timeline Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* User Preferences Toggles Card */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Preferences Settings</h3>
              <p className="text-xs text-text-muted mt-0.5">Set notification channels and account appearance preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Notifications Setting toggles */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-text-white border-b border-border/50 pb-1.5 flex items-center gap-1.5">
                  <BellIcon className="w-4 h-4 text-blue-500" />
                  <span>Notification Settings</span>
                </h4>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-white">Email Alerts</div>
                    <div className="text-[10px] text-text-muted font-normal">Receive reports, funding history, debit records</div>
                  </div>
                  <button
                    onClick={() => {
                      setPreferences(prev => ({ ...prev, emailNotif: !prev.emailNotif }));
                      triggerToast("Email notifications preference updated", "success");
                    }}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                      preferences.emailNotif ? 'bg-blue-500' : 'bg-zinc-600'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      preferences.emailNotif ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-white">SMS Alerts</div>
                    <div className="text-[10px] text-text-muted font-normal font-sans">Get transaction token generation and code updates</div>
                  </div>
                  <button
                    onClick={() => {
                      setPreferences(prev => ({ ...prev, smsNotif: !prev.smsNotif }));
                      triggerToast("SMS notifications preference updated", "success");
                    }}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                      preferences.smsNotif ? 'bg-blue-500' : 'bg-zinc-600'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      preferences.smsNotif ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-white">Push Notifications</div>
                    <div className="text-[10px] text-text-muted font-normal font-sans">Instant web banner warnings when logged</div>
                  </div>
                  <button
                    onClick={() => {
                      setPreferences(prev => ({ ...prev, pushNotif: !prev.pushNotif }));
                      triggerToast("Push notifications preference updated", "success");
                    }}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                      preferences.pushNotif ? 'bg-blue-500' : 'bg-zinc-600'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      preferences.pushNotif ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Layout styling and language details */}
              <div className="space-y-4">
                {/* Theme mode selection */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-text-white border-b border-border/50 pb-1.5 flex items-center gap-1.5">
                    <SparklesIcon className="w-4 h-4 text-blue-500" />
                    <span>Theme Customization</span>
                  </h4>
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-text-white">Light Mode / Dark Mode</div>
                      <div className="text-[10px] text-text-muted">Dynamic application rendering toggles</div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="bg-bg-dark-secondary border border-border rounded-xl px-3 py-1.5 hover:bg-bg-card-hover font-semibold text-text-white transition-colors"
                    >
                      {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    </button>
                  </div>
                </div>

                {/* Language selection dropdown */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-text-white border-b border-border/50 pb-1.5 flex items-center gap-1.5">
                    <GlobeAltIcon className="w-4 h-4 text-blue-500" />
                    <span>Default Language</span>
                  </h4>
                  <select
                    value={preferences.language}
                    onChange={(e) => {
                      setPreferences(prev => ({ ...prev, language: e.target.value }));
                      triggerToast(`Language changed to ${e.target.value}`, "success");
                    }}
                    className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-3 py-2 w-full focus:outline-none"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Arabic</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Account Activity Timeline Card */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-text-white font-bold text-xs font-['Space_Grotesk']">Recent Account Activities</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Timeline logs for security audit checks</p>
            </div>

            <div className="relative border-l border-border pl-4 ml-2.5 space-y-4">
              {isEmptyActivity ? (
                <div className="py-10 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-2">
                  <InformationCircleIcon className="w-8 h-8 text-text-muted" />
                  <p className="font-semibold text-text-white">No recent account activity.</p>
                </div>
              ) : (
                activities.map((item) => (
                  <div key={item.id} className="relative">
                    {/* timeline node dot */}
                    <span className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border border-bg-card ${
                      item.type === 'profile' ? 'bg-blue-500' :
                      item.type === 'security' ? 'bg-amber-500' :
                      item.type === 'wallet' ? 'bg-emerald-500' :
                      item.type === 'transaction' ? 'bg-purple-500' : 'bg-cyan-500'
                    }`} />
                    <div className="text-[11px] leading-snug">
                      <div className="font-semibold text-text-white">{item.description}</div>
                      <span className="text-[9px] text-text-muted font-mono">{item.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ── Danger Zone Card ── */}
        <div className="bg-bg-card border border-red-500/20 rounded-2xl p-6 shadow-sm space-y-4 bg-red-500/[0.01]">
          <div>
            <h3 className="text-red-500 font-bold text-sm font-['Space_Grotesk']">Account Management (Danger Zone)</h3>
            <p className="text-xs text-text-muted mt-0.5">Destructive actions concerning account persistence. Proceed with extreme caution.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={() => setShowLogoutAllModal(true)}
              className="bg-bg-dark-secondary hover:bg-bg-card-hover border border-border hover:border-red-500/30 text-text-white hover:text-red-400 font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
            >
              Log Out Everywhere
            </button>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="bg-bg-dark-secondary hover:bg-amber-500/10 border border-border hover:border-amber-500/30 text-text-white hover:text-amber-500 font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
            >
              Deactivate My Account
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-600 text-red-500 hover:text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
            >
              Delete Account Permanently
            </button>
          </div>
        </div>

      </div>

      {/* ── 2FA CONFIGURATION MODAL ── */}
      {show2FaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center space-y-4">
            
            <button 
              onClick={() => setShow2FaModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white hover:bg-bg-dark-secondary p-1 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="relative mx-auto w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
              <LockClosedIcon className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Configure 2FA</h3>
              <p className="text-xs text-text-muted">Scan the barcode using your Google Authenticator app</p>
            </div>

            {/* Mock QR box */}
            <div className="mx-auto bg-white p-3 rounded-lg inline-block border border-border shadow-inner">
              <svg className="w-32 h-32 text-slate-800" viewBox="0 0 100 100">
                <rect x="5" y="5" width="20" height="20" fill="currentColor" />
                <rect x="75" y="5" width="20" height="20" fill="currentColor" />
                <rect x="5" y="75" width="20" height="20" fill="currentColor" />
                <rect x="35" y="15" width="30" height="10" fill="currentColor" />
                <rect x="15" y="45" width="40" height="20" fill="currentColor" />
                <rect x="65" y="65" width="25" height="15" fill="currentColor" />
                <rect x="35" y="80" width="15" height="15" fill="currentColor" />
              </svg>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter 6-digit OTP code"
                maxLength={6}
                className="bg-bg-dark-secondary border border-border text-center text-sm font-bold tracking-widest text-text-white rounded-xl px-4 py-2.5 w-full focus:outline-none"
              />
            </div>

            <button
              onClick={handleConfirm2Fa}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-2 px-4 text-xs transition-colors"
            >
              Confirm & Enable 2FA
            </button>
          </div>
        </div>
      )}

      {/* ── LOG OUT EVERYWHERE MODAL ── */}
      {showLogoutAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Log Out Everywhere</h3>
              <p className="text-xs text-text-muted">Are you sure you want to terminate all active login sessions across all browsers and devices?</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutAllModal(false)}
                className="flex-1 bg-bg-dark-secondary border border-border hover:bg-bg-card-hover text-text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                No, Keep
              </button>
              <button
                onClick={() => {
                  setShowLogoutAllModal(false);
                  triggerToast("Logged out of all other devices.", "success");
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DEACTIVATE ACCOUNT MODAL ── */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Deactivate Account</h3>
              <p className="text-xs text-text-muted">This will temporarily freeze your transactions and wallet access. You can reactivate at any time by logging back in.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 bg-bg-dark-secondary border border-border hover:bg-bg-card-hover text-text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  triggerToast("Account deactivated successfully.", "danger");
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE ACCOUNT MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-red-500/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center animate-bounce">
              <TrashIcon className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-red-500 font-bold text-base font-['Space_Grotesk']">Delete Account Permanently</h3>
              <p className="text-xs text-text-muted">This action is irreversible. All wallet funds, transactions histories, and referral progress records will be erased forever.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-bg-dark-secondary border border-border hover:bg-bg-card-hover text-text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  triggerToast("Account deleted successfully.", "danger");
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST SYSTEM ── */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs text-white font-semibold min-w-[200px] animate-slide-in pointer-events-auto ${
              toast.type === 'success'
                ? 'bg-emerald-500 border-emerald-500/20 shadow-emerald-500/10'
                : toast.type === 'info'
                ? 'bg-blue-500 border-blue-500/20 shadow-blue-500/10'
                : 'bg-red-500 border-red-500/20 shadow-red-500/10'
            }`}
          >
            <CheckCircleIcon className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
