export interface AnalyticsOverview { id: string; label: string; value: string | number; change: string; isPositive: boolean; type: 'money' | 'number' | 'percentage'; sparkline: { x: number; y: number }[]; }
export interface RevenueMetric { name: string; Revenue: number; Profit: number; Expense: number; Growth: number; }
export interface ServiceAnalytics { name: string; revenue: number; transactions: number; profit: number; growth: string; successRate: number; }
export interface GeographicInsight { region: string; revenue: number; users: number; density: string; percentage: number; }
export interface Report { id: string; name: string; createdDate: string; createdBy: string; lastUpdated: string; type: 'Revenue' | 'Transaction' | 'Growth' | 'Service' | 'Custom'; }
export interface ForecastData { name: string; actual: number; projected: number; }
export interface AnalyticsSystemAlert { id: string; title: string; description: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; timestamp: string; }
export interface AnalyticsActivityLog { id: string; event: string; timestamp: string; }
export interface ActivityLog { id: string; event: string; timestamp: string; }

export interface NotificationCampaign { id: string; title: string; message: string; type: 'Announcement' | 'Transaction Alert' | 'Promotion' | 'Security' | 'System Update'; audience: 'All Users' | 'Specific Users' | 'User Segments' | 'Inactive Users' | 'New Users' | 'VIP Users'; channels: ('In-App' | 'Email' | 'Push' | 'SMS')[]; sentCount: number; status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Delivered' | 'Failed'; date: string; time: string; buttonLabel?: string; buttonUrl?: string; timezone?: string; scheduledTime?: string; timeline: { created?: string; scheduled?: string; sending?: string; delivered?: string; completed?: string; }; }
export interface FailedNotification { id: string; title: string; recipientCount: number; failureReason: string; retries: number; }
export interface NotificationTemplate { id: string; name: string; type: NotificationCampaign['type']; subject: string; body: string; channels: NotificationCampaign['channels']; }
export interface NotificationActivityLog { id: string; event: string; adminName: string; timestamp: string; }
export interface AudienceInsight { label: string; value: string | number; change: string; isPositive: boolean; }

export interface GeneralConfig { platformName: string; platformDesc: string; supportEmail: string; supportPhone: string; currency: string; language: string; timezone: string; logoUrl: string; faviconUrl: string; }
export interface ServiceConfig { id: string; name: string; enabled: boolean; maintenanceMessage: string; priority: 'High' | 'Medium' | 'Low'; dailyLimit: number; }
export interface TransactionRules { minAmount: number; maxAmount: number; dailyLimit: number; retryAttempts: number; timeoutSeconds: number; autoReverse: boolean; requirePin: boolean; }
export interface WalletRules { minFunding: number; maxFunding: number; autoRefund: boolean; freezeRules: string; lowBalanceThreshold: number; lockThreshold: number; requireApproval: boolean; }
export interface NotificationSettings { enableInApp: boolean; enableEmail: boolean; enableSMS: boolean; enablePush: boolean; retentionDays: number; campaignLimit: number; defaultTemplate: string; }
export interface SecurityPolicy { passwordRegex: string; sessionTimeoutMinutes: number; deviceLimit: number; allowApiLogins: boolean; allowedIpList: string; require2faAdmin: boolean; auditLevel: 'Verbose' | 'Standard' | 'Minimal'; maxLoginAttempts: number; }
export interface ProviderConfig { id: string; type: 'VTU' | 'Electricity' | 'Cable' | 'Payment Gateway'; name: string; enabled: boolean; priority: number; healthScore: number; apiKeyPlaceholder: string; environment: 'Production' | 'Sandbox'; retryPolicy: string; }
export interface FeeConfig { airtimeFeePercent: number; dataFeePercent: number; electricityFeeFlat: number; cableFeeFlat: number; walletFundingFeeFlat: number; referralRewardPercent: number; taxPercent: number; }
export interface MaintenanceConfig { enabled: boolean; message: string; allowedRoles: string[]; startTime: string; endTime: string; emergencyBanner: string; }
export interface SystemConfig { cacheDurationMinutes: number; loggingLevel: 'Debug' | 'Info' | 'Warning' | 'Error'; fileUploadLimitMb: number; backupFrequencyHours: number; dataRetentionMonths: number; queueConcurrency: number; environmentLabel: 'Production' | 'Staging' | 'Development'; }
export interface HistoryRecord { id: string; adminName: string; section: string; action: string; date: string; status: 'Successful' | 'Rolled Back' | 'Pending'; }
export interface SettingsSystemAlert { id: string; title: string; description: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; timestamp: string; }

export interface SupportCustomer { id: string; name: string; email: string; phone: string; walletBalance: number; verificationLevel: string; previousTickets: number; referrals: number; }
export interface SupportTicket { id: string; customerId: string; customerName: string; customerEmail: string; subject: string; description: string; category: 'Payments' | 'Wallet' | 'Airtime' | 'Data' | 'Electricity' | 'Cable TV' | 'Technical' | 'Account'; priority: 'Low' | 'Medium' | 'High' | 'Critical'; assignedTo: string; status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed'; updatedDate: string; createdDate: string; tags: string[]; }
export interface TicketMessage { id: string; sender: 'Customer' | 'Agent' | 'System'; senderName: string; message: string; timestamp: string; attachments?: string[]; }
export interface SupportAgent { id: string; name: string; role: string; activeTickets: number; }
export interface SLAStatus { label: string; value: string | number; status: 'Healthy' | 'Warning' | 'Critical'; }
export interface KnowledgeBaseArticle { id: string; title: string; category: string; summary: string; content: string; }
export interface EscalatedCase { ticketId: string; reason: string; assignedTeam: string; priority: 'High' | 'Critical'; timeOpen: string; }
export interface AgentPerformance { rank: number; name: string; closed: number; avgResolution: string; rating: number; }
export interface SupportSystemAlert { id: string; title: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; description: string; timestamp: string; }
export interface SupportActivityLog { id: string; event: string; timestamp: string; }

export interface AdminDashboardTransaction { id: string; user: string; email: string; service: 'Airtime' | 'Data' | 'Electricity' | 'Cable TV'; amount: number; status: 'Success' | 'Pending' | 'Failed'; time: string; date: string; }
export interface ServiceData { name: string; volume: number; revenue: number; successRate: number; trend: string; color: string; }
export interface AlertItem { id: string; title: string; desc: string; severity: 'high' | 'warning' | 'info'; time: string; }
export interface AdminTransaction { id: string; reference: string; user: string; email: string; phone: string; service: 'Airtime' | 'Data' | 'Electricity' | 'Cable TV' | 'Wallet Funding'; recipient: string; amount: number; fee: number; status: 'Success' | 'Pending' | 'Failed' | 'Reversed'; date: string; time: string; provider: string; paymentMethod: 'Wallet' | 'Card' | 'Bank Transfer'; walletBefore: number; walletAfter: number; riskScore?: 'Low' | 'Medium' | 'High' | 'Critical'; flaggedReason?: string; timeline: { created: string; processing: string; completed: string; updated: string; }; }
export interface RefundRequest { id: string; txId: string; user: string; amount: number; reason: string; submitted: string; status: 'Pending' | 'Approved' | 'Rejected'; }
export interface FlaggedTx { id: string; txId: string; user: string; riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'; reason: string; assignedAdmin: string; status: 'Reviewed' | 'Under Investigation' | 'Suspended'; }
export interface UserAccount { id: string; firstName: string; lastName: string; email: string; phone: string; walletBalance: number; transactionsCount: number; verificationStatus: 'Verified' | 'Pending' | 'Unverified'; status: 'Active' | 'Suspended'; role: 'User' | 'Agent' | 'Admin'; joinedDate: string; emailVerified: boolean; phoneVerified: boolean; identityVerified: boolean; identityDocUrl?: string; }
export interface UserActivityEvent { id: string; userId: string; type: 'registration' | 'login' | 'funding' | 'purchase' | 'profile_update' | 'admin_action'; text: string; time: string; icon: string; color: string; }
export interface WalletAccount { id: string; user: string; email: string; phone: string; availableBalance: number; reservedBalance: number; totalFunding: number; status: 'Active' | 'Frozen' | 'Restricted'; lastActivity: string; joinedDate: string; avatarInitials: string; fundingCount: number; averageFunding: number; largestFunding: number; totalSpending: number; spendingSuccessRate: number; }
export interface PendingAdjustment { id: string; userId: string; user: string; email: string; actionType: 'Credit' | 'Debit' | 'Refund' | 'Correction'; amount: number; reason: string; reference: string; submitted: string; status: 'Pending' | 'Approved' | 'Rejected'; }
export interface SecurityLog { id: string; type: string; details: string; riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'; timestamp: string; admin: string; }

export interface Referral { id: string; name: string; email: string; phone: string; code: string; invites: number; conversions: number; earnings: number; status: 'Active' | 'Pending' | 'Rewarded' | 'Suspended'; joinedDate: string; tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'; campaign: string; }
export interface Campaign { id: string; name: string; status: 'Active' | 'Paused' | 'Scheduled' | 'Ended'; participants: number; budget: number; spent: number; conversionRate: number; description: string; }
export interface RewardConfig { type: 'Fixed Amount' | 'Percentage'; value: number; currency: string; maxReward: number; activationThreshold: number; expiryDays: number; }
export interface Payout { id: string; userId: string; userName: string; userEmail: string; amount: number; status: 'Pending' | 'Approved' | 'Rejected' | 'Paid'; requestedDate: string; campaign: string; }
export interface LeaderboardUser { rank: number; name: string; email: string; avatar: string; invites: number; conversions: number; earnings: number; }
export interface FraudRecord { id: string; type: 'Duplicate Referrals' | 'Unusual Conversion Activity' | 'Rapid Registrations' | 'Repeated Device Usage'; description: string; riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'; userId: string; userName: string; timestamp: string; status: 'Reviewed' | 'Flagged' | 'Restricted' | 'Pending'; }
export interface ReferralActivityLog { id: string; event: 'Referral Created' | 'Reward Issued' | 'Campaign Activated' | 'Conversion Completed' | 'Referral Suspended'; details: string; adminName: string; timestamp: string; }
