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

  return (
    <form action={action} className="glass-card p-5">
      <div className={`grid gap-4 ${gridClass}`}>
        {showSearch ? (
          <input
            type="text"
            name={searchName}
            defaultValue={searchDefaultValue}
            placeholder={searchPlaceholder}
            className="h-12 rounded-full border border-line px-5 text-sm outline-none transition focus:border-navy"
          />
        ) : null}
        {filters.map((field) => (
          <select
            key={field.name}
            name={field.name}
            defaultValue={field.defaultValue ?? field.options[0]?.value ?? ""}
            className="h-12 rounded-full border border-line bg-white px-5 text-sm outline-none transition focus:border-navy"
            aria-label={field.label}
          >
            {field.options.map((option) => (
              <option key={`${field.name}-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
        <button className="h-12 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-navy">
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}
