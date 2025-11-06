"use client";

import { useEffect } from "react";

/**
 * Filters out known console errors that don't affect functionality
 * - Base Account SDK COOP warnings
 * - Coinbase metrics fetch errors
 */
export function ErrorFilter() {
  useEffect(() => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;

    // Filter function for errors
    const filterError = (...args: any[]) => {
      const message = args[0]?.toString() || "";
      
      // Filter Base Account SDK COOP warnings
      if (
        message.includes("Base Account SDK requires the Cross-Origin-Opener-Policy") ||
        message.includes("Cross-Origin-Opener-Policy header to not be set to 'same-origin'")
      ) {
        return; // Suppress this error
      }

      // Filter Coinbase metrics errors
      if (
        message.includes("Failed to fetch") ||
        message.includes("Analytics SDK") ||
        message.includes("cca-lite.coinbase.com")
      ) {
        return; // Suppress this error
      }

      // Allow other errors through
      originalError.apply(console, args);
    };

    // Filter function for warnings
    const filterWarn = (...args: any[]) => {
      const message = args[0]?.toString() || "";
      
      // Filter Base Account SDK warnings
      if (
        message.includes("Base Account SDK requires the Cross-Origin-Opener-Policy") ||
        message.includes("Cross-Origin-Opener-Policy header to not be set to 'same-origin'")
      ) {
        return; // Suppress this warning
      }

      // Allow other warnings through
      originalWarn.apply(console, args);
    };

    // Override console methods
    console.error = filterError;
    console.warn = filterWarn;

    // Cleanup on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Also filter network errors via window error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const message = event.message || "";
      
      // Filter known network errors
      if (
        message.includes("Failed to fetch") ||
        message.includes("Analytics SDK") ||
        message.includes("cca-lite.coinbase.com") ||
        message.includes("NotSameOriginAfterDefaultedToSameOriginByCoep")
      ) {
        event.preventDefault(); // Suppress this error
        return false;
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}

