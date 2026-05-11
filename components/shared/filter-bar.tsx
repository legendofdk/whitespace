type FilterOption = {
  label: string;
  value: string;
};

type FilterField = {
  name: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
};

type FilterBarProps = {
  action: string;
  showSearch?: boolean;
  searchName?: string;
  searchPlaceholder?: string;
  searchDefaultValue?: string;
  filters?: FilterField[];
};

export function FilterBar({
  action,
  showSearch = true,
  searchName = "search",
  searchPlaceholder = "Tìm kiếm",
  searchDefaultValue = "",
  filters = []
}: FilterBarProps) {
  const gridClass = showSearch
    ? filters.length >= 3
      ? "lg:grid-cols-[1.5fr_repeat(3,1fr)_auto]"
      : filters.length === 2
        ? "lg:grid-cols-[1.5fr_repeat(2,1fr)_auto]"
        : filters.length === 1
          ? "lg:grid-cols-[1.5fr_1fr_auto]"
          : "lg:grid-cols-[1.5fr_auto]"
    : filters.length >= 3
      ? "lg:grid-cols-[repeat(3,1fr)_auto]"
      : filters.length === 2
        ? "lg:grid-cols-[repeat(2,1fr)_auto]"
        : filters.length === 1
          ? "lg:grid-cols-[1fr_auto]"
          : "lg:grid-cols-[auto]";

  const fieldClassName =
    "relative flex h-12 items-center rounded-[8px] border border-line/80 bg-white/92 px-3.5 text-sm text-ink shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition focus-within:border-navy/60 focus-within:shadow-[0_14px_30px_rgba(15,23,42,0.08)]";

  return (
    <form action={action} className="glass-card p-4 sm:p-5">
      <div className={`grid gap-3 ${gridClass}`}>
        {showSearch ? (
          <label className="grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">Từ khóa</span>
            <span className={fieldClassName}>
              <span className="mr-3 text-base text-steel" aria-hidden="true">⌕</span>
              <input
                type="text"
                name={searchName}
                defaultValue={searchDefaultValue}
                placeholder={searchPlaceholder}
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-steel/70"
              />
            </span>
          </label>
        ) : null}
        {filters.map((field) => (
          <label key={field.name} className="grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">{field.label}</span>
            <span className={fieldClassName}>
              <select
                name={field.name}
                defaultValue={field.defaultValue ?? field.options[0]?.value ?? ""}
                className="h-full w-full appearance-none bg-transparent pr-2 text-sm outline-none"
                aria-label={field.label}
              >
                {field.options.map((option) => (
                  <option key={`${field.name}-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
          </label>
        ))}
        <button className="h-12 self-end rounded-[8px] bg-[#0066cc] px-5 text-sm font-medium tracking-[-0.224px] text-white transition active:scale-95 hover:bg-[#0071e3]">
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}
