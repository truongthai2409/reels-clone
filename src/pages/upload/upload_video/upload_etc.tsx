import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "@/components/upload";
import { UploadField } from "@/components/upload/upload_field";
import { validationSchemaImage } from "@/helpers/validations/upload.schema";
import { SubmitButton } from "@/components/upload/submit_button";

interface FormValues {
  file: File | null;
  username: string;
  password: string;
  acceptTerms: boolean;
}

export const UploadEtc: React.FC = () => {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      console.log("Uploaded:", file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    console.log("submit", values)
    try {
      if (values.file) {
        await upload(values.file);
      }
      console.log("Form submitted successfully:", values);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{
        file: null,
        username: "",
        password: "",
        acceptTerms: false,
      }}
      validationSchema={validationSchemaImage}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize={false}
    >
      <Form className="p-4 border rounded max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Video Upload Form</h2>

        <InputField name="username" label="Username" type="text" />
        <InputField name="password" label="Password" type="password" />
        <UploadField name="file" label="Video File" accept="video/*" maxSize={5 * 1024 * 1024} />

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="acceptTerms"
              className="rounded border-gray-300"
            />
            <span className="text-sm">I accept the terms and conditions</span>
          </label>
        </div>

        {uploading && (
          <div className="text-blue-500 text-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Uploading...
          </div>
        )}
        <SubmitButton isUpLoading={uploading}/>
      </Form>
    </Formik>
  );
};