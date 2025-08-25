import { useEffect, useRef, type RefObject } from 'react';
import type { ProfileFormValues } from '@/types/form.types';
import { STORAGE_KEY } from '@/configs';

export function AutosaveDraft({
  values,
  savingRef,
}: {
  values: ProfileFormValues;
  savingRef: RefObject<ReturnType<typeof setTimeout> | null>;
}) {
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false; // đánh dấu đã qua lần đầu
      return; // thoát không chạy autosave
    }

    if (savingRef.current) clearTimeout(savingRef.current);

    savingRef.current = setTimeout(() => {
      try {
        console.log('Saving draft:', values);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {}
    }, 1000);
  }, [values]);

  return null;
}
