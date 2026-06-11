import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    console.log('Создаем аккаунт администратора...');
    
    const { data, error } = await supabase.auth.signUp({
        email: 'asus017447@gmail.com',
        password: 'gg192837465gg',
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('Аккаунт уже существует. Пытаемся обновить пароль (нужен сброс пароля) или вы можете использовать существующий.');
        } else {
            console.error('Ошибка:', error);
        }
    } else {
        console.log('Успешно создано!');
        console.log('Пользователь:', data.user?.email);
    }
}

createAdmin();
