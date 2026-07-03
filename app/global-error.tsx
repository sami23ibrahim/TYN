"use client";

/**
 * Custom global error boundary. Besides being good practice, defining this avoids
 * a Next 16 + Turbopack dev bug where the builtin global-error module is missing
 * from the React Client Manifest. Renders its own <html>/<body>, so styles are
 * inlined (globals.css from the root layout does not apply here).
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          background: "#fffef7",
          color: "#365229",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 500, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, maxWidth: "32rem", lineHeight: 1.5 }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            border: "1px solid #365229",
            borderRadius: "8px",
            background: "transparent",
            color: "#365229",
            padding: "0.6rem 1.4rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
