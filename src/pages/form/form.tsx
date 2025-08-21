import { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { handleProfileSubmit, loadDraft } from "@/services/form.service";
import type { ProfileFormValues } from "@/types/form.types";
import { ThemeProvider } from "@/contexts/theme";
import { DarkModeToggle } from "@/components/ui";
import { SubmitButton } from "@/components/form";
import { ExperiencesSection } from "./experience/experience_section";
import { ProfileSchema } from "@/helpers/validations/form.schema";
import { BasicInfoSection, FormDebug, AutosaveDraft } from "./profile";

interface BannerType {
  type: "success" | "error";
  msg: string;
}

export default function ProfileForm() {
  const [banner, setBanner] = useState<null | BannerType>(null);
  const [initialValues] = useState<ProfileFormValues>(() => loadDraft());
  const savingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Frontend Dev Test — Profile Form
            </h1>
            <DarkModeToggle />
          </header>

          {/* Banner */}
          {banner && (
            <div
              role="status"
              className={`mb-4 rounded-xl px-4 py-3 text-sm ${banner.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100"
                : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
            >
              {banner.msg}
            </div>
          )}
          
          {/* Formik */}
          <Formik<ProfileFormValues>
            initialValues={initialValues}
            validateOnBlur
            validateOnChange
            validateOnMount
            enableReinitialize={false}
            validate={(values) => {
              const res = ProfileSchema.safeParse(values);
              if (res.success) return {};
              const formErrors: Record<string, string> = {};
              res.error.issues.forEach((issue) => {
                const path = issue.path.join(".");
                if (path) formErrors[path] = issue.message;
              });
              return formErrors;
            }}
            onSubmit={(values, actions) =>
              handleProfileSubmit(values, { ...actions, setBanner })
            }
          >
            {({
              values,
              errors,
              touched,
              isValid,
              isSubmitting,
              setFieldValue,
            }) => {
              const aboutLen = values.aboutMe?.length || 0;
              const aboutNearLimit = aboutLen >= 280;

              return (
                <Form className="space-y-8">
                  <AutosaveDraft values={values} savingRef={savingRef} />

                  {/* Basic Info */}
                  <BasicInfoSection values={values} aboutLen={aboutLen} aboutNearLimit={aboutNearLimit} setFieldValue={setFieldValue} />

                  {/* Experiences */}
                  <ExperiencesSection values={values} setFieldValue={setFieldValue} />

                  {/* Submit */}
                  <SubmitButton isValid={isValid} isSubmitting={isSubmitting} />

                  {/* Debug */}
                  <FormDebug values={values} errors={errors} touched={touched} />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </ThemeProvider>
  );
}