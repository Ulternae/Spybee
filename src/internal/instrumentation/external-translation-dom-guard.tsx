import Script from "next/script";

const externalTranslatorDomGuardConfig = `window.__externalTranslatorDomGuard = Object.assign(window.__externalTranslatorDomGuard || {}, {
  policy: "strict",
  sampleRate: 0.01,
  maxWarn: 3,
  maxQueue: 100,
});`;

const ExternalTranslationDomGuard = () => {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script
        id="external-translator-dom-guard-config"
        strategy="beforeInteractive"
      >
        {externalTranslatorDomGuardConfig}
      </Script>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script
        id="external-translator-dom-guard"
        src="/guards/external-translator-dom-guard.js"
        strategy="beforeInteractive"
      />
    </>
  );
};

export { ExternalTranslationDomGuard };
