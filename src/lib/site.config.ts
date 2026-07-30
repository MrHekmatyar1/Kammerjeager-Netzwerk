// site.config.ts — single source of truth for brand & domain constants
// Единый источник брендовых и доменных констант для всего проекта
//
// Чтобы изменить домен/email/название — меняйте только этот файл.

export const SITE = {
    /** Продакшн-домен без trailing slash */
    url: 'https://kammerjaeger-structon.de',

    /** Отображаемое название бренда */
    name: 'Kammerjäger Structon',

    /** Краткое название для футеров писем */
    nameShort: 'Kammerjäger Structon',

    /** Главный контактный email (Impressum, Datenschutz) */
    emailContact: 'kontakt@kammerjaeger-structon.de',

    /** Email для обратной связи / идей */
    emailFeedback: 'ideen@kammerjaeger-structon.de',

    /** Email администратора (внутренние уведомления) */
    emailAdmin: 'edorkalchuk@gmail.com',

    /** Основной телефонный номер */
    phone: '0160 92376320',
    phoneTel: 'tel:016092376320',
} as const;
