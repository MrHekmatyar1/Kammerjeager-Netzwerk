import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';
    const role = searchParams.get('role');

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );
        const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Если передан role и у юзера еще нет роли, сохраним ее
            if (role && sessionData.user && !sessionData.user.user_metadata?.role) {
                await supabase.auth.updateUser({
                    data: { role: role === 'kunden' ? 'kunden' : 'partner' }
                });
            }
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // В случае ошибки возвращаем на главную или на страницу с ошибкой
    return NextResponse.redirect(`${origin}/?error=auth`);
}
