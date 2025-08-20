import { Field } from "formik";
import { CustomTextarea } from "./custom_textarea";
import { CustomInput } from "../../../components/form/custom_input";
import { calcAge } from "@/services/form.services";
import { InlineError } from "@/components/form";
import { CustomRadioGroup } from "./custom_radio";
import { MultiSelect } from "./multiselect";

type PropsInfo = {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  aboutLen: number;
  aboutNearLimit: boolean;
};

export function BasicInfoSection({ values, setFieldValue, aboutLen, aboutNearLimit }: PropsInfo) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="md:col-span-2 text-lg font-semibold">Profile</h2>

      {/* Name */}
      <Field
        name="name"
        label="Name *"
        placeholder="John Doe"
        component={CustomInput}
      />

      {/* Email */}
      <Field
        name="email"
        type="email"
        label="Email *"
        placeholder="you@example.com"
        component={CustomInput}
      />

      {/* About Me */}
      <Field
        name="aboutMe"
        label="About me (max 300)"
        component={CustomTextarea}
        rows={6}
        placeholder="I build clean UIs."
      />
      <div
        className={`text-xs mt-1 ${aboutNearLimit
          ? "text-red-600"
          : "text-gray-500 dark:text-gray-400"
          } md:col-span-2`}
      >
        {aboutLen}/300
      </div>

      {/* Birthday */}
      <div>
        <Field
          name="birthday"
          type="date"
          label="Birthday *"
          component={CustomInput}
        />
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Age: {values.birthday ? calcAge(values.birthday) : "-"}
        </div>
      </div>

      {/* Gender */}
      <CustomRadioGroup
        name="gender"
        label="Gender *"
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]}
      />

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
      <Field
        name="website"
        type="url"
        label="Website (optional)"
        placeholder="https://example.com"
        component={CustomInput}
        className="md:col-span-2"    
      />

      {/* Terms */}
      <div className="md:col-span-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <Field type="checkbox" name="acceptTerms" /> I accept the terms and
          conditions *
        </label>
        <InlineError name="acceptTerms" />
      </div>
    </section>
  );
}
