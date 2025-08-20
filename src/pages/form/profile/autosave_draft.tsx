import { useEffect } from "react";
import type { ProfileFormValues } from "@/types/form.types";
import { STORAGE_KEY } from "@/configs";

export function AutosaveDraft({
  values,
  savingRef,
}: {
  values: ProfileFormValues;
  savingRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}) {
  useEffect(() => {
    if (savingRef.current) clearTimeout(savingRef.current);
    savingRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {}
    }, 1000);
    return () => {
      if (savingRef.current) clearTimeout(savingRef.current);
    };
  }, [values]);
  return null;
}
