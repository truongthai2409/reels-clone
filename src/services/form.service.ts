import { STORAGE_KEY, todayISO } from "@/configs";
import { ProfileSchema } from "@/helpers/validations/form.schema";
import type { ProfileFormValues } from "@/types/form.types";

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
      id: Date.now().toString(), // Add id for drag & drop
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

export const handleProfileSubmit = async (
  values: any,
  { setSubmitting, setBanner }: any
) => {
  setBanner(null);
  setSubmitting(true);

  try {
    await new Promise((r) => setTimeout(r, 1200)); // Fake API
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    setBanner({
      type: "success",
      msg: "Profile saved successfully!",
    });
  } catch {
    setBanner({
      type: "error",
      msg: "Failed to submit. Please try again.",
    });
  } finally {
    setSubmitting(false);
  }
};