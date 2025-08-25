import React from 'react';
import { Formik, Form } from 'formik';
import { InputField } from '@/components/upload';
import { UploadField } from '@/components/upload/upload_field';
import { validationDemoSchema } from '@/helpers/validations/upload.schema';

interface FormValues {
  email: string;
  phone: string;
  website: string;
  age: string;
  birthDate: string;
  hobbies: string[];
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  hasCompany: boolean;
  companyName: string;
  username: string;
  documents: File | File[] | null;
}

export const UploadFile: React.FC = () => {
  const initialValues: FormValues = {
    email: '',
    phone: '',
    website: '',
    age: '',
    birthDate: '',
    hobbies: [],
    address: {
      street: '',
      city: '',
      zipCode: '',
      country: '',
    },
    hasCompany: false,
    companyName: '',
    username: '',
    documents: null,
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Yup Validation Demo
      </h1>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={validationDemoSchema}
        onSubmit={values => {
          console.log('Form submitted:', values);
          alert('Form submitted successfully! Check console for details.');
        }}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic validations */}
              <div>
                <InputField name="email" label="Email" type="email" />
                <InputField name="phone" label="Phone Number" type="tel" />
                <InputField name="website" label="Website" type="url" />
                <InputField name="age" label="Age" type="number" />
                <InputField name="birthDate" label="Birth Date" type="date" />
              </div>

              <div>
                <InputField name="username" label="Username" type="text" />

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Hobbies
                  </label>
                  <div className="space-y-2">
                    {['Reading', 'Gaming', 'Sports', 'Music', 'Travel'].map(
                      hobby => (
                        <label key={hobby} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={hobby}
                            checked={values.hobbies.includes(hobby)}
                            onChange={e => {
                              if (e.target.checked) {
                                setFieldValue('hobbies', [
                                  ...values.hobbies,
                                  hobby,
                                ]);
                              } else {
                                setFieldValue(
                                  'hobbies',
                                  values.hobbies.filter(h => h !== hobby)
                                );
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{hobby}</span>
                        </label>
                      )
                    )}
                  </div>
                  {touched.hobbies && errors.hobbies && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.hobbies}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasCompany"
                      checked={values.hasCompany}
                      onChange={handleChange}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">I have a company</span>
                  </label>
                </div>

                {values.hasCompany && (
                  <InputField
                    name="companyName"
                    label="Company Name"
                    type="text"
                  />
                )}
              </div>
            </div>

            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="address.street" label="Street" type="text" />
                <InputField name="address.city" label="City" type="text" />
                <InputField
                  name="address.zipCode"
                  label="ZIP Code"
                  type="text"
                />
                <InputField
                  name="address.country"
                  label="Country"
                  type="text"
                />
              </div>
            </div>

            <UploadField
              name="documents"
              label="Documents (PDF, DOC, Images)"
              accept=".pdf,.doc,.docx,image/*"
              multiple={true}
              maxSize={10 * 1024 * 1024} // 10MB
            />
            {/* Button Submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Submit Form
            </button>

            {/* Debug */}
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-600">
                Debug Info
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify({ values, errors, touched }, null, 2)}
              </pre>
            </details>
          </Form>
        )}
      </Formik>
    </div>
  );
};
