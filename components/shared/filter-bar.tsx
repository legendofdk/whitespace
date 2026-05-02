type FilterBarProps = {
  placeholder: string;
  filters: string[];
};

export function FilterBar({ placeholder, filters }: FilterBarProps) {
  return (
    <div className="glass-card p-5">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_repeat(3,1fr)_auto]">
        <input
          type="text"
          placeholder={placeholder}
          className="h-12 rounded-full border border-line px-5 text-sm outline-none transition focus:border-navy"
        />
        {filters.map((label) => (
          <select
            key={label}
            className="h-12 rounded-full border border-line bg-white px-5 text-sm outline-none transition focus:border-navy"
            defaultValue={label}
          >
            <option>{label}</option>
          </select>
        ))}
        <button className="h-12 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-navy">
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
