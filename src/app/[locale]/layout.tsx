import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "../globals.scss";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { LOCALES } from "@/i18n/routing";
import { ExternalTranslationDomGuard } from "@/internal/instrumentation/external-translation-dom-guard";
import { ReactScan } from "@/internal/instrumentation/react-scan";
import { ZodLocaleSync } from "@/components/controllers/ZodLocaleSync";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/store/theme/theme.provider";
import { ThemeClassSync } from "@/store/theme/theme-class.sync";
import { ThemeInitializationScript } from "@/store/theme/theme-initialization-script";
import { TooltipProvider } from "@/components/ui/tooltip";

export const generateStaticParams = () => {
  return LOCALES.map((locale) => ({ locale }));
}

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "Spybee",
  description: "Project and map-based incident management.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout = async ({ children, params }: Readonly<RootLayoutProps>) => {

  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={montserratAlternates.variable} suppressHydrationWarning>
      <body>
        <ThemeInitializationScript />
        <ReactScan />
        <ExternalTranslationDomGuard />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ZodLocaleSync locale={locale} />
          <Toaster />
          <ThemeProvider>
            <ThemeClassSync />
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
