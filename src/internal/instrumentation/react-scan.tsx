"use client";

const ReactScan = () => {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      crossOrigin="anonymous"
      src="https://unpkg.com/react-scan/dist/auto.global.js"
    />
  );
};

export { ReactScan };
