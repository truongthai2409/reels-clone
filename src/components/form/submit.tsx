import React from "react";

interface SubmitButtonProps {
    isValid: boolean;
    isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isValid, isSubmitting }) => {
    return (
        <div className="flex items-center gap-3">
            <button
                type="submit"
                className="px-4 py-2 rounded-xl text-white bg-gray-900 
                   dark:bg-gray-100 dark:text-gray-900 
                   disabled:opacity-50"
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
    );
};


