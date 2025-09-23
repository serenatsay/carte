"use client";
import { useMemo, useState } from "react";
import { useCarteStore } from "@/lib/store";
import { formatMoney } from "@/lib/currency";
import { getTranslations } from "@/lib/translations";

export default function OrderSummary({ onClose, uiLanguage }: { onClose: () => void; uiLanguage?: string }) {
  const menu = useCarteStore((s) => s.menu);
  const cart = useCarteStore((s) => s.cart);
  const preferredLanguage = useCarteStore((s) => s.preferredLanguage);
  const [fullScreen, setFullScreen] = useState(false);
  const t = getTranslations(uiLanguage || preferredLanguage);

  const selections = useMemo(() => {
    if (!menu) return [] as Array<{ id: string; name: string; original: string; qty: number; price?: { amount?: number; currency?: string; raw?: string }; isWildcard?: boolean; wildcardReason?: string; sectionId: string; sectionTitle?: string }>;
    const byId: Record<string, { sectionId: string; item: any; sectionTitle: string }> = {};
    for (const sec of menu.sections) {
      for (const it of sec.items) {
        byId[it.id] = {
          sectionId: sec.id,
          item: it,
          sectionTitle: sec.originalTitle || sec.translatedTitle || ''
        };
      }
    }
    return Object.values(cart).map(({ itemId, quantity, isWildcard, wildcardReason }) => {
      const info = byId[itemId];
      const item = info?.item;
      return {
        id: itemId,
        name: fullScreen ? (item?.originalName ?? item?.translatedName ?? itemId) : (item?.translatedName ?? itemId),
        original: fullScreen ? (item?.translatedName ?? "") : (item?.originalName ?? ""),
        qty: quantity,
        price: item?.price,
        isWildcard,
        wildcardReason,
        sectionId: info?.sectionId || '',
        sectionTitle: info?.sectionTitle,
      };
    });
  }, [menu, cart, fullScreen]);

  const groupedSelections = useMemo(() => {
    if (!fullScreen) return null;
    const groups: Record<string, Array<typeof selections[0]>> = {};
    for (const selection of selections) {
      const sectionId = selection.sectionId;
      if (!groups[sectionId]) groups[sectionId] = [];
      groups[sectionId].push(selection);
    }
    return groups;
  }, [selections, fullScreen]);

  const total = useMemo(() => {
    let sum = 0;
    let currency: string | undefined;
    for (const s of selections) {
      if (s.price?.amount !== undefined) {
        sum += (s.price.amount || 0) * s.qty;
        currency = s.price.currency || currency;
      }
    }
    return { sum, currency };
  }, [selections]);

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center ${fullScreen ? "bg-white" : ""}`}>
      <div className={`w-full sm:max-w-md bg-white sm:rounded-2xl sm:overflow-hidden ${fullScreen ? "h-full" : "max-h-[80vh] flex flex-col shadow-2xl"}`}>
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold">{t.orderSummary}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setFullScreen((v) => !v)} className="px-4 py-2 rounded-full border-2 border-black bg-white hover:bg-gray-50 text-black font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md">
              {fullScreen ? t.exitFullScreen : t.showToWaiter}
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-full bg-black hover:bg-gray-900 text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md">{t.close}</button>
          </div>
        </div>
        <div className={`p-4 ${fullScreen ? "text-xl" : "overflow-y-auto flex-1"}`}>
          {selections.length === 0 ? (
            <div className="text-gray-600">{t.noItemsSelected}</div>
          ) : fullScreen && groupedSelections ? (
            <div className="space-y-6">
              {Object.entries(groupedSelections).map(([sectionId, sectionItems]) => (
                <div key={sectionId}>
                  {sectionItems[0]?.sectionTitle && (
                    <h4 className="font-semibold text-lg mb-3 border-b pb-1">
                      {sectionItems[0].sectionTitle}
                    </h4>
                  )}
                  <div className="space-y-2">
                    {sectionItems.map((s) => (
                      <div key={s.id} className="flex items-center justify-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-lg">{s.qty}x</div>
                            <div className="font-medium">{s.name}</div>
                          </div>
                          <div className="text-gray-500 text-sm ml-8">{s.original}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {selections.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-gray-500 text-sm">{s.original}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {s.isWildcard && s.wildcardReason && (
                        <div className="text-xs text-purple-600 italic">
                          {s.wildcardReason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">x{s.qty}</div>
                    <div className="text-sm text-gray-700">
                      {s.price?.amount !== undefined ? formatMoney(s.price.amount * s.qty, s.price.currency) : s.price?.raw ?? ""}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t flex items-center justify-between font-semibold">
                <div>{t.total}</div>
                <div>{total.sum ? formatMoney(total.sum, total.currency) : "—"}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


