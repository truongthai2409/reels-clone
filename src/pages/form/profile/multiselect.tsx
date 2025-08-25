import { useMemo, useState } from 'react';
import { NATIONALITIES } from '@/constraints/form.constraints';

export function MultiSelect({
  value,
  onChange,
  label,
  placeholder = 'Search nationality…',
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      NATIONALITIES.filter(n => n.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  function toggle(val: string) {
    const set = new Set(value);
    set.has(val) ? set.delete(val) : set.add(val);
    onChange(Array.from(set));
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="border rounded-xl p-3">
        <input
          aria-label={label}
          className="w-full border rounded-lg px-3 py-2 mb-2 outline-none"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="max-h-40 overflow-auto space-y-1">
          {filtered.map(n => (
            <label key={n} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value.includes(n)}
                onChange={() => toggle(n)}
              />
              <span>{n}</span>
            </label>
          ))}
          {filtered.length === 0 && (
            <div className="text-xs text-gray-500">No results</div>
          )}
        </div>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.map(n => (
              <span
                key={n}
                className="text-xs dark:text-black bg-gray-100 rounded-lg px-2 py-1"
              >
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
