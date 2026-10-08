type Figure = { value: string; label: string; prefix?: string };

const sizes = {
  large: "text-[4rem] md:text-[5.2rem] text-earth-soft",
  medium: "text-[3rem] md:text-[3.4rem] text-cream",
};

// Published figures on a dark surface. The label carries the whole sentence
// (prefix and value included) for assistive technology; the large drawn
// figure is hidden from it and moved above its label with CSS order, so every
// figure in a row sits on the same line regardless of label length.
export function FigureList({ items, size, className = "" }: { items: Figure[]; size: keyof typeof sizes; className?: string }) {
  return (
    <dl className={`grid grid-cols-1 border-t border-cream/20 ${className}`}>
      {items.map((f) => (
        <div
          key={f.value}
          className="flex flex-col border-b border-cream/20 py-7 max-md:text-center sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
        >
          <dt className="center-mobile mt-3 max-w-[30ch] text-[0.95rem] text-cream/75">
            <span className="sr-only">{[f.prefix, f.value].filter(Boolean).join(" ")} </span>
            {f.label}
          </dt>
          <dd aria-hidden className={`display order-first leading-none ${sizes[size]}`}>
            {f.prefix ? <span className="mr-2 align-baseline font-sans text-[1rem] font-semibold">{f.prefix}</span> : null}
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
