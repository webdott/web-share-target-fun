"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export const InstallHeader = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const installButtonRef = useRef<HTMLButtonElement>(null);

  const promptEventHandler = useCallback(
    (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);

      if (installButtonRef.current) {
        installButtonRef.current.style.display = "block";
      }
    },
    [installButtonRef],
  );

  const downloadPWA = useCallback(async () => {
    console.log("downloadPWA", deferredPrompt);
    if (deferredPrompt) {
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  }, [deferredPrompt]);

  useEffect(() => {
    window.addEventListener(
      "beforeinstallprompt",
      promptEventHandler as EventListener,
    );

    const installButton = installButtonRef.current;

    if (installButton) {
      installButton.addEventListener("click", downloadPWA as EventListener);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        promptEventHandler as EventListener,
      );
      installButton?.removeEventListener("click", downloadPWA as EventListener);
    };
  }, [downloadPWA, promptEventHandler]);

  return (
    <>
      <button
        ref={installButtonRef}
        className="sticky left-0 top-0 flex w-full flex-col items-center justify-center bg-purple-500 py-2 text-white"
        style={{ display: "none" }}
      >
        <p className="text-md font-bold">Install 🚀</p>
      </button>

      <div className="flex w-full items-center justify-center bg-purple-50">
        <p className="py-4 text-2xl font-bold italic">WebShareTargetFun</p>
      </div>
    </>
  );
};
