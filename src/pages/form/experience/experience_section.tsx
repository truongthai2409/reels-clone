import { FieldArray } from 'formik';
import { InlineError } from '@/components/form';
import { todayISO } from '@/configs';
import { ExperienceWrapper } from './experience_wrapper';

interface ExperiencesSectionProps {
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export const ExperiencesSection = ({
  values,
  setFieldValue,
}: ExperiencesSectionProps) => {
  return (
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
                  id: Date.now().toString(),
                  company: '',
                  role: '',
                  startDate: todayISO(),
                  endDate: '',
                  highlights: [''],
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
        {({ move }) => (
          <ExperienceWrapper
            experiences={values.experiences}
            move={move}
            setFieldValue={setFieldValue}
            values={values}
          />
        )}
      </FieldArray>
    </section>
  );
};
