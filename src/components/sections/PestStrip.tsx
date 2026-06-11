'use client';

import React from 'react';
import Image from 'next/image';

/* Оставляем только насекомых — без голубей, крыс, мышей, мотыльков, andre-файлов */
const INSECTS = [
    '/pests/bettwanzen.png',
    '/pests/ameisen.png',
    '/pests/wespen.png',
    '/pests/schaben.png',
    '/pests/fliegen.png',
    '/pests/flohe.png',
    '/pests/kaefer.png',
];

/* Повороты для каждого слота — вручную задаём "рандомный" паттерн */
const ROTATIONS = [0, 90, 0, 180, 90, 0, 180, 0, 270, 90, 0, 180, 90, 270, 0, 180];

interface Item { src: string; w: number; h: number; rot: number }

function buildRow(picks: number[], sizes: number[]): Item[] {
    return picks.map((idx, i) => {
        const base = sizes[i % sizes.length] as number;
        const rot  = ROTATIONS[i % ROTATIONS.length] as number;
        return { src: INSECTS[idx % INSECTS.length] as string, w: base, h: base, rot };
    });
}

/* Три ряда с разным набором насекомых и разными размерами */
const ROW_TOP = buildRow(
    [0, 2, 1, 5, 3, 6, 4, 0, 2, 5],
    [120, 110, 130, 105, 125, 115, 120, 108, 130, 112],
);
const ROW_MID = buildRow(
    [6, 3, 4, 0, 5, 1, 2, 6, 3, 4],
    [130, 118, 140, 112, 135, 122, 128, 116, 138, 110],
);
const ROW_BOT = buildRow(
    [1, 4, 6, 2, 0, 3, 5, 1, 6, 2],
    [115, 125, 108, 132, 118, 126, 114, 130, 106, 120],
);

function MarqueeRow({
    items,
    duration,
    reverse = false,
}: {
    items: Item[];
    duration: number;
    reverse?: boolean;
}) {
    const track = [...items, ...items, ...items];
    return (
        <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '60px',
                    width: 'max-content',
                    animation: `${reverse ? 'ps-reverse' : 'ps-forward'} ${duration}s linear infinite`,
                    willChange: 'transform',
                }}
            >
                {track.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            flexShrink: 0,
                            width: item.w,
                            height: item.h,
                            position: 'relative',
                            transform: `rotate(${item.rot}deg)`,
                        }}
                    >
                        <Image
                            src={item.src}
                            alt=""
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes={`${item.w}px`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PestStrip() {
    return (
        <section className="pest-strip-section">
            <div className="pest-strip-fade-top" />
            <div className="pest-strip-fade-bottom" />

            <div className="pest-strip-rows">
                <MarqueeRow items={ROW_TOP} duration={42} />
                <MarqueeRow items={ROW_MID} duration={54} reverse />
                <MarqueeRow items={ROW_BOT} duration={46} />
            </div>

            <style>{`
                @keyframes ps-forward {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-33.333%); }
                }
                @keyframes ps-reverse {
                    from { transform: translateX(-33.333%); }
                    to   { transform: translateX(0); }
                }

                .pest-strip-section {
                    position: relative;
                    width: 100%;
                    background: #ffffff;
                    overflow: hidden;
                    padding: 28px 0;
                    border-top: 1px solid #f0f0f0;
                    border-bottom: 1px solid #f0f0f0;
                }

                .pest-strip-rows {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .pest-strip-fade-top,
                .pest-strip-fade-bottom {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 48px;
                    z-index: 2;
                    pointer-events: none;
                }
                .pest-strip-fade-top {
                    top: 0;
                    background: linear-gradient(to bottom, #ffffff, transparent);
                }
                .pest-strip-fade-bottom {
                    bottom: 0;
                    background: linear-gradient(to top, #ffffff, transparent);
                }
            `}</style>
        </section>
    );
}
