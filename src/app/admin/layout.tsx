import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
    title: 'CRM - Kammerjaeger-Zentrale',
};

const ADMIN_EMAIL = 'asus017447@gmail.com';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || session.user.email !== ADMIN_EMAIL) {
        // Если не авторизован или не тот email, выкидываем на главную
        redirect('/');
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Super<span className="text-[#C8102E]">Admin</span></h2>
                    <p className="text-xs font-medium text-slate-400 mt-1">{session.user.email}</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-red-50 text-[#C8102E] rounded-xl font-bold text-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Alle Leads
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-400 font-medium text-sm cursor-not-allowed">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Statistik (Bald)
                    </div>
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Abmelden
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 ml-64 p-8 max-w-7xl">
                {children}
            </main>
        </div>
    );
}
