import { useRef, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { calcAge, loadDraft } from "../../../services/form.services";
import { ProfileSchema } from "./validate";
import type { ProfileFormValues } from "../../../types/form.types";
import { DarkModeToggle } from "../../ui/dark-mode";
import { ThemeProvider } from "../../../context/theme";
import { STORAGE_KEY, todayISO } from "../../../config";
import { AutosaveDraft } from "../../ui/autosave-draft";
import { InlineError } from "../../ui/inline_erroe";
import { MultiSelect } from "../../ui/multiselect";
import { ExperienceItem } from "../../ui/experience_item";

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
              className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                banner.type === "success"
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
            onSubmit={async (values, { setSubmitting }) => {
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
            }}
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
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h2 className="md:col-span-2 text-lg font-semibold">
                      Profile
                    </h2>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name *
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <InlineError name="name" />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email *
                      </label>
                      <Field
                        name="email"
                        type="email"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <InlineError name="email" />
                    </div>

                    {/* About Me */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        About me (max 300)
                      </label>
                      <Field
                        as="textarea"
                        name="aboutMe"
                        rows={6}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="I build clean UIs."
                      />
                      <div
                        className={`text-xs mt-1 ${
                          aboutNearLimit
                            ? "text-red-600"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {aboutLen}/300
                      </div>
                      <InlineError name="aboutMe" />
                    </div>

                    {/* Birthday */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Birthday *
                      </label>
                      <Field
                        name="birthday"
                        type="date"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                      <InlineError name="birthday" />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Age: {values.birthday ? calcAge(values.birthday) : "-"}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <fieldset>
                        <legend className="block text-sm font-medium mb-1">
                          Gender *
                        </legend>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <Field type="radio" name="gender" value="male" />{" "}
                            Male
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Field type="radio" name="gender" value="female" />{" "}
                            Female
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Field type="radio" name="gender" value="other" />{" "}
                            Other
                          </label>
                        </div>
                        <InlineError name="gender" />
                      </fieldset>
                    </div>

                    {/* Nationality */}
                    <div className="md:col-span-2">
                      <MultiSelect
                        label="Nationality (multi-select)"
                        value={values.nationality || []}
                        onChange={(v) => setFieldValue("nationality", v)}
                      />
                      <InlineError name="nationality" />
                    </div>

                    {/* Website */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Website (optional)
                      </label>
                      <Field
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <InlineError name="website" />
                    </div>

                    {/* Terms */}
                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <Field type="checkbox" name="acceptTerms" /> I accept
                        the terms and conditions *
                      </label>
                      <InlineError name="acceptTerms" />
                    </div>
                  </section>

                  {/* Experiences */}
                  <section className="space-y-4 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Experiences</h2>
                      <FieldArray name="experiences">
                        {({ push }) => (
                          <button
                            type="button"
                            className="px-3 py-2 rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-sm"
                            onClick={() =>
                              push({
                                company: "",
                                role: "",
                                startDate: todayISO(),
                                endDate: "",
                                highlights: [""],
                              })
                            }
                          >
                            + Add Experience
                          </button>
                        )}
                      </FieldArray>
                    </div>
                    <InlineError name="experiences" />

                    <FieldArray name="experiences">
                      {() => (
                        <div className="space-y-6">
                          {values.experiences.map((_, idx) => (
                            <ExperienceItem
                              key={idx}
                              idx={idx}
                              total={values.experiences.length}
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </section>

                  {/* Submit */}
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 disabled:opacity-50"
                      disabled={!isValid || isSubmitting}
                    >
                      {isSubmitting ? "Saving…" : "Submit"}
                    </button>
                    {!isValid && (
                      <span className="text-sm text-red-600">
                        Fix validation errors before submitting.
                      </span>
                    )}
                  </div>

                  {/* Debug */}
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                      Debug values
                    </summary>
                    <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-xl overflow-auto max-h-64">
                      {JSON.stringify({ values, errors, touched }, null, 2)}
                    </pre>
                  </details>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </ThemeProvider>
  );
}
