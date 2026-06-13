import Script from "next/script";

const ReactScan = () => {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      id="react-scan"
      crossOrigin="anonymous"
      src="https://unpkg.com/react-scan/dist/auto.global.js"
      strategy="beforeInteractive"
    />
  );
};

export { ReactScan };
