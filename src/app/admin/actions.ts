'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const ADMIN_EMAIL = 'edorkalchuk@gmail.com';

export async function updateLeadStatus(id: number, status: string) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || session.user.email !== ADMIN_EMAIL) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('[Admin] Error updating lead:', error);
        throw new Error('Failed to update lead');
    }

    // Refresh the admin page data
    revalidatePath('/admin');
    
    return { success: true };
}
