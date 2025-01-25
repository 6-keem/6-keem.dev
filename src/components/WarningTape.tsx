"use client";

import { useEffect, useState } from "react";

interface TapeProps {
    angle: number;
    top: string;
    zIndex: number;
    texts: string[];
}

const Tape: React.FC<TapeProps> = ({ angle, top, zIndex, texts }) => {
    return (
        <div
            style={{
                position: "relative",
                top,
                left: "-10%",
                width: "300%",
                height: "60px",
                transform: `rotate(${angle}deg)`,
                transformOrigin: "0 50%",
                zIndex,
                display: "flex",
                alignItems: "stretch",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                background: "#FFD900",
                overflow: "hidden",
            }}
        >
            {/* Top stripes */}
            <div
                style={{
                    position: "absolute",
                    top: 2,
                    left: 0,
                    right: 0,
                    height: "8px",
                    background: `repeating-linear-gradient(
            135deg,
            #FFD900,
            #FFD900 8px,
            #000 8px,
            #000 16px
          )`,
                }}
            />

            {/* Bottom stripes */}
            <div
                style={{
                    position: "absolute",
                    bottom: 2,
                    left: 0,
                    right: 0,
                    height: "14px",
                    background: "#000",
                    display: "flex",
                    alignItems: "center",
                    gap: "120px", // 문구 간 간격
                    padding: "0 10px", // 좌우 패딩
                    overflowX: "hidden",
                }}
            >
                {Array(10)
                    .fill("팔로워 외 출입금지")
                    .map((text, idx) => (
                        <span
                            key={idx}
                            style={{
                                color: "#FFD900", // 노란색
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                                fontWeight: "900",
                            }}
                        >
                            {text}
                        </span>
                    ))}
            </div>

            {/* Center text section */}
            <div
                style={{
                    width: "100%",
                    position: "relative",
                    bottom: 1,
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "28px",
                    padding: "0 20px",
                    overflowX: "hidden",
                }}
            >
                {texts.map((text, i) => (
                    <span
                        key={i}
                        style={{
                            color: "#000",
                            fontSize: "24px",
                            fontWeight: text === "출입금지" || text === "立入禁止" ? "900" : "bold",
                            textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
                    >
                        {text === "立入禁止" && (
                            <img
                                style={{ position: "relative", bottom: 2, right: 14, display: "inline" }}
                                src="/caution.png"
                                height={24}
                                width={24}
                            />
                        )}
                        {text === "WARNING" && (
                            <img
                                src="/caution.svg"
                                style={{ display: "inline-block", position: "relative", bottom: 1, right: 14 }}
                            />
                        )}
                        {text === "출입금지" && (
                            <img
                                style={{ position: "relative", bottom: 2, right: 14, display: "inline" }}
                                src="/no-men.png"
                                height={24}
                                width={24}
                            />
                        )}
                        {text === "KEEP OUT" && (
                            <span
                                style={{
                                    display: "inline-block",
                                    position: "relative",
                                    bottom: 2,
                                    lineHeight: 1,
                                    right: 14,
                                    margin: 0,
                                    padding: "0 2px",
                                    background: "#000",
                                    color: "#FFD900",
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    border: "1px solid #FFD900",
                                    boxShadow: "0 0 0 1px #000",
                                }}
                            >
                                CAUTION
                            </span>
                        )}
                        {text}
                    </span>
                ))}
            </div>
        </div>
    );
};

const warningMessages = [
    "WARNING",
    "KEEP OUT",
    "출입금지",
    "立入禁止",
    "WARNING",
    "KEEP OUT",
    "출입금지",
    "立入禁止",
    "WARNING",
    "KEEP OUT",
    "출입금지",
    "立入禁止",
];

interface TapeState {
    angle: number;
    top: string;
    texts: string[];
}

export default function WarningTape() {
    const [tapes, setTapes] = useState<Array<{ angle: number; top: string; texts: string[] }>>([]);

    useEffect(() => {
        const generateTapes = () => {
            const numberOfTapes = 4;
            const newTapes: TapeState[] = [];

            for (let i = 0; i < numberOfTapes; i++) {
                // Generate random position and angle
                const angle = Math.random() * 90 - 45; // -45 to 45 degrees
                const top = `${Math.random() * 100}%`;
                const texts = warningMessages;

                newTapes.push({ angle, top, texts });
            }

            setTapes(newTapes);
        };

        generateTapes();
    }, []);

    return (
        <>
            {tapes.map((tape, index) => (
                <Tape key={index} angle={tape.angle} top={tape.top} zIndex={index + 1} texts={tape.texts} />
            ))}
        </>
    );
}
