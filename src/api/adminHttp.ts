import http from './http';

export type AdminQuery = Record<string, string | number | boolean | undefined>;

export const adminGet = async <T>(path: string, params?: AdminQuery): Promise<T> =>
    (await http.get<T>(`/admin${path}`, { params })) as unknown as T;

export interface AdminPagination { page: number; limit: number; hasMore: boolean; nextPage: number | null; }
export type AdminList<T> = T[] & { pagination?: AdminPagination };
export interface AdminPage<T> { items: T[]; pagination: AdminPagination; }

// Keep the existing array consumers and expose metadata for subsequent pages.
export const adminGetPage = async <T>(path: string, collectionKey: string, params?: AdminQuery): Promise<AdminPage<T>> => {
    const response = await adminGet<unknown>(path, params);
    const record = response && typeof response === 'object' ? response as Record<string, unknown> : {};
    const data = record.data;
    const nested = data && typeof data === 'object' ? data as Record<string, unknown> : {};
    const items = [response, record[collectionKey], record.results, data, nested[collectionKey], nested.results].find(Array.isArray) as T[] | undefined;
    const metadata = (record.pagination || nested.pagination) as AdminPagination | undefined;
    return { items: items || [], pagination: metadata || { page: Number(params?.page || 1), limit: Number(params?.limit || 50), hasMore: false, nextPage: null } };
};
export const adminGetList = async <T>(path: string, collectionKey: string, params?: AdminQuery): Promise<AdminList<T>> => {
    const page = await adminGetPage<T>(path, collectionKey, params);
    return Object.assign(page.items, { pagination: page.pagination });
};

export const adminPost = async <T>(path: string, body?: unknown): Promise<T> =>
    (await http.post<T>(`/admin${path}`, body)) as unknown as T;

export const adminPatch = async <T>(path: string, body?: unknown): Promise<T> =>
    (await http.patch<T>(`/admin${path}`, body)) as unknown as T;

export const adminDelete = async <T = void>(path: string): Promise<T> =>
    (await http.delete<T>(`/admin${path}`)) as unknown as T;