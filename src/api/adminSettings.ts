import type {
    FeeConfig,
    GeneralConfig,
    HistoryRecord,
    MaintenanceConfig,
    NotificationSettings,
    ProviderConfig,
    SecurityPolicy,
    ServiceConfig,
    SystemConfig,
    TransactionRules,
    WalletRules,
} from '../interface/admin.interface';
import { adminGet, adminPatch } from './adminHttp';

export const getAdminSettings = () => adminGet<{
    general: GeneralConfig;
    services: ServiceConfig[];
    transactionRules: TransactionRules;
    walletRules: WalletRules;
    notificationSettings: NotificationSettings;
    securityPolicy: SecurityPolicy;
    providers: ProviderConfig[];
    fees: FeeConfig;
    maintenance: MaintenanceConfig;
    system: SystemConfig;
}>('/settings');

export const updateAdminSettings = (settings: {
    general?: GeneralConfig;
    services?: ServiceConfig[];
    transactionRules?: TransactionRules;
    walletRules?: WalletRules;
    notificationSettings?: NotificationSettings;
    securityPolicy?: SecurityPolicy;
    providers?: ProviderConfig[];
    fees?: FeeConfig;
    maintenance?: MaintenanceConfig;
    system?: SystemConfig;
}) => adminPatch('/settings', settings);

export const getAdminAuditHistory = () => adminGet<HistoryRecord[]>('/audit-logs');