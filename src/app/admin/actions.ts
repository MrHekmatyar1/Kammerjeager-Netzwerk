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

export async function getMasters() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || session.user.email !== ADMIN_EMAIL) {
        throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
        .from('masters')
        .select('id, name, firma, is_active')
        .order('name');

    if (error) {
        console.error('[Admin] Error fetching masters:', error);
        throw new Error('Failed to fetch masters');
    }

    return data;
}

export async function assignLeadManually(
    leadId: number, 
    masterId: number, 
    overrideType: string | null, 
    overrideValue: number | null
) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || session.user.email !== ADMIN_EMAIL) {
        throw new Error('Unauthorized');
    }

    const updates: any = {
        master_id: masterId,
        status: 'neu',
    };

    if (overrideType) {
        updates.billing_override_type = overrideType;
        updates.billing_override_value = overrideValue;
    } else {
        updates.billing_override_type = null;
        updates.billing_override_value = null;
    }

    const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

    if (error) {
        console.error('[Admin] Error assigning lead manually:', error);
        throw new Error('Failed to assign lead');
    }

    // TODO: Send Telegram notification to the master here?
    // We can do it asynchronously.

    revalidatePath('/admin');
    return { success: true };
}
