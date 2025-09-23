"use client";
import { useState, useEffect, useRef } from "react";
import CameraCapture from "@/components/CameraCapture";
import MenuDisplay from "@/components/MenuDisplay";
import StickyBar from "@/components/StickyBar";
import OrderSummary from "@/components/OrderSummary";
import WildcardModal from "@/components/WildcardModal";
import CustomDropdown from "@/components/CustomDropdown";
import { useCarteStore } from "@/lib/store";
import { ParseMenuResponseBody } from "@/lib/types";
import { getTranslations } from "@/lib/translations";
import { LANGUAGE_OPTIONS } from "@/lib/constants";

export default function Home() {
  const menu = useCarteStore((s) => s.menu);
  const setMenu = useCarteStore((s) => s.setMenu);
  const preferredLanguage = useCarteStore((s) => s.preferredLanguage);
  const setPreferredLanguage = useCarteStore((s) => s.setPreferredLanguage);
  const addWildcardSelections = useCarteStore((s) => s.addWildcardSelections);
  const clearCart = useCarteStore((s) => s.clear);
  const cart = useCarteStore((s) => s.cart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showPickForMe, setShowPickForMe] = useState(false);
  const [lastImageData, setLastImageData] = useState<string | null>(null);
  const [uiLanguage, setUiLanguage] = useState(preferredLanguage);
  const currentTranslationRequestRef = useRef<string | null>(null);

  const t = getTranslations(uiLanguage);

  // Handle URL language parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    if (langParam) {
      // Map common language codes to full language names
      const langMap: Record<string, string> = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'ja': 'Japanese',
        'zh-cn': 'Chinese Simplified',
        'zh-tw': 'Chinese Traditional',
        'ko': 'Korean',
        'pt': 'Portuguese',
        'ru': 'Russian'
      };

      // Check if it's a short code or full language name
      const targetLanguage = langMap[langParam.toLowerCase()] ||
                            LANGUAGE_OPTIONS.find(opt => opt.value.toLowerCase() === langParam.toLowerCase())?.value;

      if (targetLanguage && targetLanguage !== preferredLanguage) {
        setPreferredLanguage(targetLanguage);
      }
    }
  }, [preferredLanguage, setPreferredLanguage]);

  // Sync UI language with preferred language when there's no menu (initial state)
  useEffect(() => {
    if (!menu) {
      setUiLanguage(preferredLanguage);
    }
  }, [preferredLanguage, menu]);

  async function handleCapture(dataUrl: string) {
    setLastImageData(dataUrl);
    await processImage(dataUrl);
  }

  async function handleBatchCapture(dataUrls: string[]) {
    await processBatchImages(dataUrls);
  }

  async function processBatchImages(dataUrls: string[]) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/parse-batch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ images: dataUrls, preferredLanguage }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setMenu(data.menu);
    } catch (e: any) {
      setError(e?.message || t.failedToParseMenu);
    } finally {
      setLoading(false);
    }
  }

  async function processImage(dataUrl: string, targetLanguage?: string) {
    const language = targetLanguage || preferredLanguage;
    const requestId = `${Date.now()}-${language}`;

    currentTranslationRequestRef.current = requestId;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64: dataUrl, preferredLanguage: language }),
      });
      const data = (await res.json()) as ParseMenuResponseBody;

      // Only update the menu if this is still the current request
      if (currentTranslationRequestRef.current === requestId) {
        if (!data.ok) throw new Error(data.error);
        setMenu(data.menu);
        // Update UI language only after successful translation
        setUiLanguage(language);
      }
    } catch (e: any) {
      // Only show error if this is still the current request
      if (currentTranslationRequestRef.current === requestId) {
        setError(e?.message || t.failedToParseMenu);
      }
    } finally {
      // Only clear loading if this is still the current request
      if (currentTranslationRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }

  function handleRetake() {
    setMenu(null);
    setLastImageData(null);
  }

  async function handleRetryTranslation() {
    if (lastImageData) {
      await processImage(lastImageData);
    }
  }

  function handlePickForMeOrder(selections: any[], clearExisting: boolean) {
    if (clearExisting) {
      clearCart();
    }
    addWildcardSelections(selections);
    setShowSummary(true);
  }

  console.log("Render state:", { menu: !!menu, loading, error });

  return (
    <main className="min-h-dvh bg-gray-50 pb-36">
      <div className="max-w-md mx-auto p-4">
        {menu && (
          <div className="bg-green-600 text-white py-4 px-4 -mx-4 -mt-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetake}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold">Carte</h1>
              </div>
              <button
                onClick={handleRetryTranslation}
                disabled={loading}
                className="text-sm text-white/90 underline hover:no-underline disabled:opacity-50"
              >
                {loading ? t.retrying : t.retry}
              </button>
            </div>
          </div>
        )}

        {!menu && (
          <CameraCapture
            onCapture={handleCapture}
            onBatchCapture={handleBatchCapture}
            preferredLanguage={preferredLanguage}
            onLanguageChange={setPreferredLanguage}
            loading={loading}
          />
        )}

        {error && (
          <div className="mt-4 text-red-600 text-sm">{error}</div>
        )}

        {menu && (
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <span>{t.translatedTo}</span>
              <CustomDropdown
                value={uiLanguage}
                onChange={(value) => {
                  setPreferredLanguage(value);
                  if (lastImageData) {
                    processImage(lastImageData, value);
                  }
                }}
                options={LANGUAGE_OPTIONS}
                disabled={loading}
                className="min-w-32"
              />
            </div>
            <MenuDisplay sections={menu.sections} />
          </div>
        )}
      </div>
      {menu && (
        <StickyBar
          onShowOrder={() => setShowSummary(true)}
          onWildcard={() => setShowPickForMe(true)}
          uiLanguage={uiLanguage}
        />
      )}
      {showSummary && <OrderSummary onClose={() => setShowSummary(false)} uiLanguage={uiLanguage} />}
      {showPickForMe && menu && (
        <WildcardModal
          onClose={() => setShowPickForMe(false)}
          onWildcardOrder={handlePickForMeOrder}
          menu={menu}
          preferredLanguage={preferredLanguage}
          currentCart={cart}
          uiLanguage={uiLanguage}
        />
      )}

      {/* Full-screen Loading Overlay */}
      {loading && menu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-lg">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-900 text-lg font-medium">{t.analyzingMenu}</div>
            <div className="text-gray-500 text-sm mt-1">{t.thisWillTakeAMoment}</div>
          </div>
        </div>
      )}
    </main>
  );
}


