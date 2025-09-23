"use client";
import { useMemo } from "react";
import { useCarteStore } from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { getTranslations } from "@/lib/translations";

export default function StickyBar({ onShowOrder, onWildcard, uiLanguage }: { onShowOrder: () => void; onWildcard: () => void; uiLanguage?: string; }) {
  const cart = useCarteStore((s) => s.cart);
  const menu = useCarteStore((s) => s.menu);
  const preferredLanguage = useCarteStore((s) => s.preferredLanguage);
  const t = getTranslations(uiLanguage || preferredLanguage);
  const totalCount = useMemo(() => Object.values(cart).reduce((n, i) => n + i.quantity, 0), [cart]);
  const hasItems = totalCount > 0;
  const totalPrice = useMemo(() => {
    if (!menu) return "";
    const byId: Record<string, any> = {};
    for (const sec of menu.sections) {
      for (const it of sec.items) byId[it.id] = it;
    }
    let sum = 0;
    let currency: string | undefined;
    for (const ci of Object.values(cart)) {
      const it = byId[ci.itemId];
      if (it?.price?.amount !== undefined) {
        sum += (it.price.amount || 0) * ci.quantity;
        currency = it.price.currency || currency;
      }
    }
    if (!sum) return "";
    return formatMoney(sum, currency);
  }, [cart, menu]);

  // Dynamic button rendering based on cart state
  const primaryButton = hasItems ? (
    <button
      onClick={onShowOrder}
      className="w-full py-3 px-6 rounded-full bg-black hover:bg-gray-900 text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span>{t.cart}</span>
        {totalPrice && <span className="text-white/90">· {totalPrice}</span>}
        {totalCount > 0 && (
          <span className="bg-white/25 text-white rounded-full px-2.5 py-0.5 text-sm font-bold ml-1">
            {totalCount}
          </span>
        )}
      </div>
    </button>
  ) : (
    <button
      onClick={onWildcard}
      className="w-full py-3 px-6 rounded-full bg-black hover:bg-gray-900 text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.091z" />
        </svg>
        <span>{t.recommendForMe}</span>
      </div>
    </button>
  );

  const secondaryButton = hasItems ? (
    <button
      onClick={onWildcard}
      className="w-full py-3 px-6 rounded-full border-2 border-black bg-white hover:bg-gray-50 text-black font-bold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>{t.recommendMoreItems}</span>
      </div>
    </button>
  ) : (
    <button
      onClick={onShowOrder}
      disabled={!hasItems}
      className="w-full py-3 px-6 rounded-full border-2 border-gray-200 bg-gray-50 text-gray-400 font-bold text-lg transition-colors cursor-not-allowed opacity-60"
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span>{t.cartEmpty}</span>
      </div>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 space-y-2">
      {primaryButton}
      {secondaryButton}
    </div>
  );
}


