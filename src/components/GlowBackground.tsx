"use client";
import { motion } from "framer-motion";

export const GlowBackground = () => {
    return (
        <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute inset-0"
                style={{ top: 0, left: 0 }}
                animate={{
                    background: [
                        "radial-gradient(circle at 0% 0%, rgba(49, 61, 147, 0.1), transparent 50%)",
                        "radial-gradient(circle at 0% 0%, rgba(5, 5, 92, 0.1), transparent 50%)",
                    ],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute inset-0"
                style={{ bottom: 0, right: 0 }}
                animate={{
                    background: [
                        "radial-gradient(circle at 100% 100%, rgba(255, 0, 100, 0.05), transparent 40%)",
                        "radial-gradient(circle at 100% 100%, rgba(128, 0, 128, 0.05), transparent 40%)",
                    ],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};
