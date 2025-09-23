"use client";
import { useState } from "react";
import { HungerLevel, WildcardOrderRequest, WildcardOrderResponse } from "@/lib/types";
import { getTranslations } from "@/lib/translations";

interface WildcardModalProps {
  onClose: () => void;
  onWildcardOrder: (selections: any[], clearExisting: boolean) => void;
  menu: any;
  preferredLanguage: string;
  currentCart: any;
  uiLanguage?: string;
}

export default function WildcardModal({ onClose, onWildcardOrder, menu, preferredLanguage, currentCart, uiLanguage }: WildcardModalProps) {
  const [partySize, setPartySize] = useState(2);
  const [hungerLevel, setHungerLevel] = useState<HungerLevel>("moderate");
  const [adventurous, setAdventurous] = useState(false);
  const [clearExisting, setClearExisting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = getTranslations(uiLanguage || preferredLanguage);

  async function handleGenerate() {
    setError(null);
    setLoading(true);

    try {
      const request: WildcardOrderRequest = {
        menu,
        partySize,
        hungerLevel,
        adventurous,
        preferredLanguage,
        currentCart: clearExisting ? undefined : currentCart,
      };

      const res = await fetch("/api/wildcard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = (await res.json()) as WildcardOrderResponse;

      if (!data.ok) {
        throw new Error(data.error);
      }

      onWildcardOrder(data.selections, clearExisting);
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to generate order");
    } finally {
      setLoading(false);
    }
  }

  const hungerLabels = {
    light: "Light bites",
    moderate: "Moderate meal",
    hungry: "Full meal",
    feast: "Let's feast!"
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Pick for Me</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">✕</button>
        </div>

        <div className="space-y-8 overflow-y-auto flex-1 pr-2">
          {/* Clear Existing */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">{t.startWithEmptyCart}</span>
              <button
                type="button"
                onClick={() => setClearExisting(!clearExisting)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  clearExisting ? 'bg-green-700' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    clearExisting ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t.startWithEmptyCartDescription}</p>
          </div>

          {/* Party Size */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">{t.partySize}</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPartySize(Math.max(1, partySize - 1))}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black hover:shadow-md transition-all duration-200 font-bold text-lg"
              >
                −
              </button>
              <span className="text-xl font-bold w-10 text-center">{partySize}</span>
              <button
                onClick={() => setPartySize(Math.min(12, partySize + 1))}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black hover:shadow-md transition-all duration-200 font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Hunger Level */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">{t.howHungryAreYou}</label>
            <div className="space-y-3">
              {(Object.keys(hungerLabels) as HungerLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setHungerLevel(level)}
                  className={`w-full py-3 px-4 rounded-full text-center transition-all duration-200 font-medium ${
                    hungerLevel === level
                      ? 'bg-green-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {level === 'light' ? t.lightBites : level === 'moderate' ? t.moderateMeal : level === 'hungry' ? t.fullMeal : t.letsFeast}
                </button>
              ))}
            </div>
          </div>

          {/* Adventure Level */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">{t.adventureLevel}</label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setAdventurous(false)}
                className={`w-full py-3 px-4 rounded-full text-center transition-all duration-200 font-medium ${
                  !adventurous
                    ? 'bg-green-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                {t.safeChoices}
              </button>
              <button
                type="button"
                onClick={() => setAdventurous(true)}
                className={`w-full py-3 px-4 rounded-full text-center transition-all duration-200 font-medium ${
                  adventurous
                    ? 'bg-green-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                {t.adventurous}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </div>

        <div className="space-y-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-black hover:bg-gray-900 text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? t.generating : t.generateOrder}
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 px-6 rounded-full border-2 border-black bg-white hover:bg-gray-50 text-black font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}