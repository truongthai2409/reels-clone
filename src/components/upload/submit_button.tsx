import { useFormikContext } from 'formik'
import React from 'react'

interface SubmitButtonProps {
    isUpLoading: boolean,
    uploadMode?: 'normal' | 'chunked'
}

export const SubmitButton: React.FC<SubmitButtonProps> = (SubmitButtonProps) => {
    const { isUpLoading, uploadMode } = SubmitButtonProps
    const { isValid, dirty, isSubmitting } = useFormikContext()
    
    return (
        <>
            {
                uploadMode ?
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-xl text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 disabled:opacity-50 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        disabled={!isValid || !dirty || isSubmitting || isUpLoading}
                    >
                        {isUpLoading ? "Uploading…" : `Upload Video (${uploadMode === 'normal' ? 'Normal' : 'Chunked'})`}
                    </button> : <button
                        type="submit"
                        disabled={!isValid || !dirty || isSubmitting || isUpLoading}
                        className={`w-full px-4 py-2 rounded font-medium transition-colors ${isSubmitting || isUpLoading || isSubmitting || isUpLoading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
            }
        </>
    )
}
