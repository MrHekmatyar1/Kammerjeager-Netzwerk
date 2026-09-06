import { createClient } from '@/lib/supabase/server';
import LeadsTable from '@/components/admin/LeadsTable';
import { getMasters } from './actions';

export const revalidate = 0; // Всегда свежие данные для админки

export default async function AdminPage() {
    const supabase = await createClient();

    // Получаем все лиды, сортируем по дате создания (новые сверху)
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[Admin] Error fetching leads:', error);
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                Fehler beim Laden der Leads. Bitte versuchen Sie es später erneut.
            </div>
        );
    }

    const masters = await getMasters();

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Leads Übersicht</h1>
                    <p className="text-slate-500 font-medium mt-1">Verwalten Sie hier alle eingehenden Kundenanfragen.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-bold text-slate-700">{leads?.length || 0} Leads gesamt</span>
                </div>
            </header>

            {/* Таблица лидов */}
            <LeadsTable initialLeads={leads || []} masters={masters || []} />
        </div>
    );
}
