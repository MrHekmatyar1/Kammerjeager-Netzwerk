'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { REVIEWS_DATA } from '../../constants/data';

// Генерирую инициалы и цвет аватарки из имени — как у Google Reviews на скрине
const AUTHORS = [
    { name: 'Thomas K.', initials: 'TK', color: '#1a73e8' },
    { name: 'Sandra M.', initials: 'SM', color: '#34a853' },
    { name: 'Markus B.', initials: 'MB', color: '#ea4335' },
    { name: 'Julia W.', initials: 'JW', color: '#fbbc04' },
    { name: 'Peter L.', initials: 'PL', color: '#1a73e8' },
    { name: 'Monika R.', initials: 'MR', color: '#34a853' },
    { name: 'Stefan N.', initials: 'SN', color: '#ea4335' },
    { name: 'Anna F.', initials: 'AF', color: '#9333ea' },
    { name: 'Klaus D.', initials: 'KD', color: '#1a73e8' },
    { name: 'Sabine H.', initials: 'SH', color: '#34a853' },
    { name: 'Frank G.', initials: 'FG', color: '#ea4335' },
    { name: 'Petra J.', initials: 'PJ', color: '#fbbc04' },
];

// Маршруты для таракана — x1/y1 старт, x2/y2 финиш (в % карточки)
// rot = угол поворота чтобы таракан смотрел КУДА БЕЖИТ
// Таракан на фото смотрит вверх по умолчанию (0°), значит:
//   вправо = 90°, вниз = 180°, влево = 270°, вверх = 0°
const ROACH_ROUTES = [
    { x1: 8, y1: 50, x2: 88, y2: 50, rot: 90 },  // горизонталь вправо
    { x1: 8, y1: 20, x2: 82, y2: 72, rot: 130 },   // диагональ ↘
    { x1: 88, y1: 20, x2: 14, y2: 72, rot: 232 },   // диагональ ↙
    { x1: 50, y1: 12, x2: 50, y2: 82, rot: 180 },   // вертикаль вниз
    { x1: 14, y1: 75, x2: 82, y2: 22, rot: 45 },   // диагональ ↗
];

// Google-иконка SVG (маленькая, для значка верификации)
const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

// Компонент тараканчика который пробегает по карточке
// mix-blend-mode: multiply — делает белый фон PNG невидимым на белой карточке
// rot — единый угол, таракан смотрит в направлении движения
function RoachRunner({ route }: { route: typeof ROACH_ROUTES[0] }) {
    return (
        <>
            <style>{`
                @keyframes roach-run {
                    0%   { left: ${route.x1}%; top: ${route.y1}%; opacity: 0; }
                    8%   { opacity: 1; }
                    92%  { opacity: 1; }
                    100% { left: ${route.x2}%; top: ${route.y2}%; opacity: 0; }
                }
                .roach-runner {
                    position: absolute;
                    width: 44px;
                    height: 44px;
                    pointer-events: none;
                    z-index: 10;
                    animation: roach-run 5s ease-in-out forwards;
                    mix-blend-mode: multiply;
                }
                .roach-inner {
                    width: 100%;
                    height: 100%;
                    transform: rotate(${route.rot}deg);
                    transform-origin: center;
                    position: relative;
                }
                /* Hide on mobile — mix-blend-mode unreliable on Android with GPU layers */
                @media (max-width: 639px) {
                    .roach-runner { display: none; }
                }
            `}</style>
            <div className="roach-runner">
                <div className="roach-inner">
                    <Image
                        src="/pests/roach_runner.png"
                        alt=""
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="44px"
                    />
                </div>
            </div>
        </>
    );
}


// Карточка отзыва — я хочу чтобы на каждой 3-й карточке появлялся тараканчик
// Он появляется редко (раз в ~12 секунд) и пробегает по карточке
function ReviewCard({ review, authorIdx, isThird }: {
    review: typeof REVIEWS_DATA[0];
    authorIdx: number;
    isThird: boolean;
}) {
    const author = AUTHORS[authorIdx % AUTHORS.length] ?? AUTHORS[0]!;

    // Фиксирую «vor X Monaten» — вычисляю один раз чтобы не было hydration mismatch
    // Math.random() в рендере в Next.js вызывает ошибку — сервер и клиент дают разные числа
    const monthsAgo = ((authorIdx * 7 + 2) % 4) + 1; // детерминированное «случайное» число 1–4

    // Состояние для тараканчика — показывать или нет, и по какому маршруту бежать
    const [showRoach, setShowRoach] = useState(false);
    const [roachRoute, setRoachRoute] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isThird) return; // Только на каждой 3-й карточке

        // Первый запуск — случайная задержка от 4 до 10 секунд чтобы не все сразу
        const initialDelay = 4000 + Math.random() * 6000;

        const startCycle = () => {
            // Выбираю случайный маршрут
            setRoachRoute(Math.floor(Math.random() * ROACH_ROUTES.length));
            setShowRoach(true);

            // Прячу после 5 секунд (столько длится анимация теперь)
            timerRef.current = setTimeout(() => {
                setShowRoach(false);
                // Следующий прогон — через 10-16 секунд снова
                timerRef.current = setTimeout(startCycle, 10000 + Math.random() * 6000);
            }, 5000);
        };

        timerRef.current = setTimeout(startCycle, initialDelay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isThird]);

    return (
        <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1.5px solid #c8cdd5',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: 'calc(var(--slide-width, 33.333%) - 11px)',
            minWidth: 'calc(var(--slide-width, 33.333%) - 11px)',
            height: '250px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            flexShrink: 0,
        }}>
            {/* Верхняя строка — аватарка + имя + Google иконка */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Цветная аватарка с инициалами */}
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: author.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 700,
                        flexShrink: 0,
                    }}>
                        {author.initials}
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', lineHeight: 1.3 }}>
                            {author.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#80868b' }}>
                            vor {monthsAgo} Monaten
                        </div>
                    </div>
                </div>
                <GoogleIcon />
            </div>

            {/* Звёздочки */}
            <div style={{ display: 'flex', gap: '2px', color: '#fbbc04', fontSize: '14px', lineHeight: 1 }}>
                {[...Array(review.stars)].map((_, i) => <span key={i}>★</span>)}
            </div>

            {/* Текст отзыва */}
            <p style={{
                fontSize: '13px',
                color: '#3c4043',
                lineHeight: '1.6',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                margin: 0,
                flex: 1,
            }}>
                {review.text}
            </p>

            {/* Кнопку "Mehr lesen" убрал — клиент попросил */}

            {/* Тараканчик — появляется только если showRoach=true */}
            {showRoach && ROACH_ROUTES[roachRoute] && <RoachRunner route={ROACH_ROUTES[roachRoute]!} />}
        </div>
    );
}

const extendedReviews = [...REVIEWS_DATA.slice(-3), ...REVIEWS_DATA, ...REVIEWS_DATA.slice(0, 3)];

export default function ReviewSlider() {
    const [currentIndex, setCurrentIndex] = useState(3);
    const [isAnimating, setIsAnimating] = useState(false);
    const [visibleCards, setVisibleCards] = useState(3);

    // Live drag state
    const [dragOffset, setDragOffset] = useState(0); // px offset during drag
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef<number>(0);
    const touchStartTime = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Responsive: 2 cards on mobile, 3 on desktop
    useEffect(() => {
        const update = () => {
            const v = window.innerWidth < 640 ? 1.5 : (window.innerWidth < 1024 ? 2 : 3);
            setVisibleCards(v);
            document.documentElement.style.setProperty('--slide-width', `${100 / v}%`);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const jumpToIndex = (index: number) => {
        setIsAnimating(false);
        setCurrentIndex(index);
    };

    const goTo = (newIndex: number) => {
        setIsAnimating(true);
        setCurrentIndex(newIndex);
        setDragOffset(0);
        setIsDragging(false);
    };

    const nextSlide = () => goTo(currentIndex + 1);
    const prevSlide = () => goTo(currentIndex - 1);

    // Touch handlers — live drag
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]!.clientX;
        touchStartTime.current = Date.now();
        setIsDragging(true);
        setIsAnimating(false);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const dx = e.touches[0]!.clientX - touchStartX.current;
        setDragOffset(dx);
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0]!.clientX - touchStartX.current;
        const dt = Date.now() - touchStartTime.current;
        const velocity = Math.abs(dx) / dt; // px per ms
        const containerWidth = containerRef.current?.offsetWidth ?? 300;
        const cardWidth = containerWidth / visibleCards;

        // Number of cards to skip: based on velocity + distance
        let skip = Math.round(Math.abs(dx) / cardWidth);
        if (velocity > 0.5) skip = Math.max(skip, 1); // fast flick = at least 1
        if (velocity > 1.2) skip = Math.max(skip, 2); // very fast = at least 2
        if (velocity > 2.0) skip = Math.max(skip, 3); // lightning = 3
        skip = Math.max(1, Math.min(skip, 3)); // clamp 1–3

        if (dx < -30) goTo(currentIndex + skip);
        else if (dx > 30) goTo(currentIndex - skip);
        else { setDragOffset(0); setIsDragging(false); }
    };

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                if (currentIndex >= extendedReviews.length - visibleCards) jumpToIndex(3);
                if (currentIndex <= 0) jumpToIndex(extendedReviews.length - visibleCards * 2);
            }, 350);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, isAnimating]);

    return (
        <div className="w-full">
            <div className="w-full bg-white py-20 relative flex justify-center border-b border-gray-100">
                <div className="max-w-[1200px] w-full relative px-4 sm:px-10">

                    {/* Только рейтинг — без заголовка */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <p style={{ fontSize: '15px', color: '#5f6368', letterSpacing: '0.01em' }}>
                            <strong style={{ color: '#202124' }}>4.9</strong>
                            {' ★★★★★ '}
                            <span style={{ color: '#80868b' }}>341 Bewertungen</span>
                        </p>
                    </div>

                    {/* Слайдер */}
                    <div style={{ position: 'relative' }}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        ref={containerRef}
                    >
                        <div style={{ overflow: 'hidden' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    transform: `translateX(calc(-${currentIndex * (100 / visibleCards)}% + ${dragOffset}px))`,
                                    transition: isDragging ? 'none' : 'transform 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                }}
                            >
                                {extendedReviews.map((review, index) => (
                                    <ReviewCard
                                        key={`${review.id}-${index}`}
                                        review={review}
                                        authorIdx={index}
                                        // Каждая 3-я карточка (считая от 0) получает тараканчика
                                        isThird={(index % 3) === 2}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Стрелка влево */}
                        <button
                            onClick={prevSlide}
                            className="flex items-center justify-center"
                            style={{
                                position: 'absolute', left: '-12px', top: '50%',
                                transform: 'translateY(-50%)',
                                width: '40px', height: '40px',
                                background: '#fff', border: '1px solid #e8eaed',
                                borderRadius: '50%', cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                zIndex: 20,
                            }}
                        >
                            <svg width="18" height="18" fill="none" stroke="#5f6368" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Стрелка вправо */}
                        <button
                            onClick={nextSlide}
                            className="flex items-center justify-center"
                            style={{
                                position: 'absolute', right: '-12px', top: '50%',
                                transform: 'translateY(-50%)',
                                width: '40px', height: '40px',
                                background: '#fff', border: '1px solid #e8eaed',
                                borderRadius: '50%', cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                zIndex: 20,
                            }}
                        >
                            <svg width="18" height="18" fill="none" stroke="#5f6368" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
