import { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';

export function useRealtimeTable<T extends { id: number }>(
    table: string,
    enabled: boolean,
    query: string = '*',
    orderBy: string = 'created_at'
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;

        // Carga inicial con JOIN
        const fetchData = async () => {
            const { data: rows, error } = await supabase
                .from(table)
                .select(query)
                .order(orderBy, { ascending: true });

            if (!cancelled) {
                if (error) console.error(`Error fetching ${table}:`, error.message);
                else setData(rows as unknown as T[]);
                setLoading(false);
            }
        };

        fetchData();

        // Suscripción Realtime
        const channel = supabase
            .channel(`realtime:${table}:${Date.now()}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table },
                async (payload) => {
                    if (cancelled) return;

                    const { eventType, new: newItem, old: oldItem } = payload;

                    if (eventType === 'INSERT') {
                        // Re-fetch to get JOIN data that the payload doesn't include
                        const { data: enrichedItem, error } = await supabase
                            .from(table)
                            .select(query)
                            .eq('id', newItem.id)
                            .single();

                        if (!error && enrichedItem && !cancelled) {
                            setData((prev) => [...prev, enrichedItem as unknown as T]);
                        }
                    } else if (eventType === 'UPDATE') {
                        setData((prev) =>
                            prev.map((item) =>
                                item.id === (newItem as T).id ? (newItem as T) : item
                            )
                        );
                    } else if (eventType === 'DELETE') {
                        setData((prev) =>
                            prev.filter((item) => item.id !== (oldItem as T).id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            cancelled = true;
            supabase.removeChannel(channel);
        };
    }, [enabled, table, query, orderBy]);

    return { data, setData, loading };
}