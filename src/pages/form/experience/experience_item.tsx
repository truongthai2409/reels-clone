import React, { useCallback } from "react";
import { Field, FieldArray } from "formik";
import type { ProfileFormValues } from "@/types/form.types";
import { InlineError } from "@/components/form/inline_error";

interface ExperienceItemProps {
  idx: number;
  total: number;
  setFieldValue: (field: string, value: unknown) => void;
  values: ProfileFormValues;
}

export const ExperienceItem = React.memo<ExperienceItemProps>(function ExperienceItem({
  idx,
  total,
  setFieldValue,
  values,
}) {
  const confirmRemove = useCallback(() => {
    const ok = window.confirm("Remove this experience?");
    if (ok) {
      const next = [...values.experiences];
      next.splice(idx, 1);
      setFieldValue("experiences", next);
    }
  }, [idx, setFieldValue, values.experiences]);

  const move = useCallback((dir: -1 | 1) => {
    const next = [...values.experiences];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    setFieldValue("experiences", next);
  }, [idx, setFieldValue, values.experiences]);

  return (
    <article className="p-4 border rounded-2xl">
      <header className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Item #{idx + 1}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Move up"
            className="px-2 py-1 rounded-lg border"
            onClick={() => move(-1)}
            disabled={idx === 0}
          >
            ↑
          </button>
          <button
            type="button"
            aria-label="Move down"
            className="px-2 py-1 rounded-lg border"
            onClick={() => move(1)}
            disabled={idx === total - 1}
          >
            ↓
          </button>
          <button
            type="button"
            aria-label="Remove"
            className="px-3 py-1.5 rounded-lg border text-red-600"
            onClick={confirmRemove}
          >
            Remove
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company *</label>
          <Field name={`experiences[${idx}].company`} className="w-full border rounded-xl px-3 py-2" />
          <InlineError name={`experiences[${idx}].company`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role *</label>
          <Field name={`experiences[${idx}].role`} className="w-full border rounded-xl px-3 py-2" />
          <InlineError name={`experiences[${idx}].role`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start date *</label>
          <Field
            name={`experiences[${idx}].startDate`}
            type="date"
            className="w-full border rounded-xl px-3 py-2"
          />
          <InlineError name={`experiences[${idx}].startDate`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End date (optional)</label>
          <Field
            name={`experiences[${idx}].endDate`}
            type="date"
            className="w-full border rounded-xl px-3 py-2"
          />
          <InlineError name={`experiences[${idx}].endDate`} />
        </div>
      </div>

      {/* Highlights */}
      <FieldArray name={`experiences[${idx}].highlights`}>
        {({ push, remove }) => (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Highlights (optional)</label>
              <button
                type="button"
                className="px-2 py-1 rounded-lg border text-sm"
                onClick={() => push("")}
              >
                + Add highlight
              </button>
            </div>
            {(values.experiences[idx].highlights || []).map((_, hIdx) => (
              <div key={hIdx} className="flex items-start gap-2 mb-2">
                <Field
                  name={`experiences[${idx}].highlights[${hIdx}]`}
                  placeholder="Led migration to React 18"
                  className="flex-1 border rounded-xl px-3 py-2"
                />
                <button
                  type="button"
                  aria-label="Remove highlight"
                  className="px-2 py-2 rounded-lg border"
                  onClick={() => remove(hIdx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </FieldArray>
    </article>
  );
});