import { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';
import { RealtimeChannel } from '@supabase/supabase-js';

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

        let channel: RealtimeChannel;
        let isCancelled = false; // Flag para evitar actualizaciones en componentes desmontados

        const init = async () => {
            // Carga inicial
            const { data: rows, error } = await supabase
                .from(table)
                .select(query)
                .order(orderBy, { ascending: true });

            if (!isCancelled) {
                if (error) {
                    console.error("Error carga inicial:", error.message);
                } else {
                    setData(rows as unknown as T[]);
                    setLoading(false);
                }
            }

            // Realtime
            const channelName = `public:${table}:${Math.random()}`;
            channel = supabase
                .channel(channelName)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: table },
                    async (payload) => {
                        if (isCancelled) return;

                        const { eventType, new: newItem, old: oldItem } = payload;

                        if (eventType === 'INSERT') {
                            const { data: enriched } = await supabase
                                .from(table)
                                .select(query)
                                .eq('id', newItem.id)
                                .single();

                            if (enriched && typeof enriched === 'object' && 'id' in enriched) {
                                setData((prev) => {
                                    if (prev.some(item => item.id === (enriched as any).id)) return prev;
                                    return [...prev, enriched as unknown as T];
                                });
                            }
                        }
                        else if (eventType === 'DELETE') {
                            const idToDelete = oldItem.id;
                            setData((prev) => prev.filter((item) => item.id !== idToDelete));
                        }
                    }
                )
                .subscribe();
        };

        init();

        return () => {
            isCancelled = true;
            if (channel) supabase.removeChannel(channel);
        };
    }, [enabled, table, query, orderBy]);

    return { data, setData, loading };
}