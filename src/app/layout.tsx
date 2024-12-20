import "./globals.css";
import MyThemeProvider from "@/components/provider/ThemeProvider";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/footer/Footer";
import { ScrollProvider } from "@/components/provider/ScrollProvider";
import { GlowBackground } from "@/components/GlowBackground";
import { Metadata } from "next";
import { baseDomain, blogName, blogThumbnailURL } from "@/config/const";

export async function generateMetadata(): Promise<Metadata> {
    const title = blogName;
    const url = baseDomain;
    const thumbnailURL = blogThumbnailURL;

    return {
        title,
        openGraph: {
            title,
            url,
            images: [thumbnailURL],
        },
        twitter: {
            title,
            images: [thumbnailURL],
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className="h-full scroll-my-20 scroll-smooth"
            style={{ overscrollBehavior: "none" }}
            suppressHydrationWarning
        >
            <body
                className={`flex flex-col min-h-screen antialiased`}
                style={{ overscrollBehavior: "none" }}
            >
                <MyThemeProvider>
                    <ScrollProvider>
                        <Header />
                        <main className="flex-1 min-h-screen pt-[64px] pb-[48px] relative overflow-hidden">
                            <GlowBackground />
                            {children}
                        </main>
                        <Footer />
                    </ScrollProvider>
                </MyThemeProvider>
            </body>
        </html>
    );
}
