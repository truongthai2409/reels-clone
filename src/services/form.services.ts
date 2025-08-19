import { ProfileSchema } from "../component/page/form/validate";
import { STORAGE_KEY, todayISO } from "../config";
import type { ProfileFormValues } from "../types/form.types";

const DEFAULT_VALUES: ProfileFormValues = {
  name: "",
  email: "",
  aboutMe: "",
  birthday: "",
  gender: "other",
  nationality: [],
  website: "",
  acceptTerms: false,
  experiences: [
    {
      company: "",
      role: "",
      startDate: todayISO(),
      endDate: "",
      highlights: [""],
    },
  ],
};

// đọc nháp giúp tải lại không mất
export function loadDraft(): ProfileFormValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VALUES;
    const parsed = JSON.parse(raw);
    // Use schema to coerce/clean any bad data from storage
    const safe = ProfileSchema.catch(DEFAULT_VALUES).parse(parsed);
    return safe;
  } catch {
    return DEFAULT_VALUES;
  }
}

export function calcAge(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}