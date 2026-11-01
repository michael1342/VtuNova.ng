import { useState } from 'react';
import type { AdminList, AdminQuery } from '../api/adminHttp';

export default function AdminLoadMore<T>({ items, load, onLoaded, label = 'Load more records' }: {
    items: T[]; load: (params?: AdminQuery) => Promise<T[]>; onLoaded: (items: T[]) => void; label?: string;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const pagination = (items as AdminList<T>).pagination;
    if (!pagination?.hasMore) return null;
    const more = async () => {
        if (loading || !pagination.nextPage) return;
        setLoading(true); setError('');
        try {
            const next = await load({ page: pagination.nextPage, limit: pagination.limit }) as AdminList<T>;
            const byId = new Map([...items, ...next].map((item, index) => [(item as { id?: string }).id || String(index), item]));
            onLoaded(Object.assign([...byId.values()], { pagination: next.pagination }));
        } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to load the next page.'); }
        finally { setLoading(false); }
    };
    return <div className="px-6 py-3 flex items-center justify-end gap-3 border-b border-border">
        {error && <span role="alert" className="text-xs text-red-400">{error}</span>}
        <button type="button" disabled={loading} onClick={more} className="px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold disabled:opacity-50">
            {loading ? 'Loading...' : label}
        </button>
    </div>;
}
