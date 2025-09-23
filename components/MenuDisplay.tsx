"use client";
import { formatMoney } from "@/lib/currency";
import { useCarteStore } from "@/lib/store";
import { MenuItem, MenuSection } from "@/lib/types";

function Badge({ label }: { label: string }) {
  return <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mr-1">{label}</span>;
}

function ItemRow({ sectionId, item }: { sectionId: string; item: MenuItem }) {
  const inc = useCarteStore((s) => s.increment);
  const dec = useCarteStore((s) => s.decrement);
  const cart = useCarteStore((s) => s.cart);
  const qty = cart[item.id]?.quantity ?? 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-lg">
            {item.translatedName}
          </h4>
          <div className="text-sm text-gray-600 mt-1">
            {item.originalName}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.badges?.map((b) => <Badge key={b} label={b} />)}
            {item.spiceLevel !== undefined && (
              <span className="text-xs text-red-600">🌶️ {item.spiceLevel}</span>
            )}
            {item.dietaryCategories?.map((d) => (
              <span key={d} className="text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {d}
              </span>
            ))}
            {item.allergens?.filter((a) => a !== "none").map((a) => (
              <span key={a} className="text-xs text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                {a}
              </span>
            ))}
          </div>
          {item.translatedDescription && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{item.translatedDescription}</p>
          )}
          {item.culturalNotes && (
            <p className="text-xs text-gray-500 mt-2 italic">{item.culturalNotes}</p>
          )}
          <div className="text-lg font-semibold text-gray-900 mt-3">
            {item.price?.amount !== undefined ? formatMoney(item.price.amount, item.price.currency) : item.price?.raw ?? ""}
          </div>
        </div>
        <div className="flex flex-col items-center">
          {qty === 0 ? (
            <button
              onClick={() => inc(sectionId, item.id)}
              className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center text-xl font-medium transition-colors"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => dec(item.id)} className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center">-</button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => inc(sectionId, item.id)} className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuDisplay({ sections }: { sections: MenuSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((s) => (
        <section key={s.id}>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">
            {s.translatedTitle || s.originalTitle || "Section"}
          </h2>
          <div className="space-y-4">
            {s.items.map((item) => (
              <ItemRow key={item.id} sectionId={s.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}


