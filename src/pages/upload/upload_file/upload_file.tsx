// import React, { useCallback, useMemo, useState } from "react";
// import { Formik, Form, Field } from "formik";
// import { UploadSchema } from "@/helpers/validations";
// import { ALLOWED_TYPES } from "@/constraints";
// import { uploadFileWithProgress, testApolloServer, testUploadMethods } from "@/services/apollo.service";
// import { testUploadFunction } from "@/services/test_upload";
// import { getFileIcon } from "@/services/upload.service";
// import BannerError from "@/components/ui/banner_error";

// type UploadFileValues = {
//     file: File | null;
//     categories: string[];
//     acceptTerms: boolean;
// };

// const initialValues: UploadFileValues = {
//     file: null,
//     categories: [],
//     acceptTerms: false,
// };

// export const UploadFile: React.FC = () => {
//     const [uploadProgress, setUploadProgress] = useState<number>(0);
//     const [isUploading, setIsUploading] = useState<boolean>(false);
//     const [banner, setBanner] = useState<null | { type: "success" | "error"; msg: string }>(null);
//     const stopUpload = useCallback(() => {
//         setIsUploading(false);
//         setUploadProgress(0);
//         // Note: XMLHttpRequest doesn't support easy cancellation in this implementation
//         // For production, you might want to store the xhr instance and call xhr.abort()
//     }, []);

//     const validate = useCallback(async (values: UploadFileValues) => {
//         const res = await UploadSchema.safeParseAsync(values);
//         if (res.success) return {} as Record<string, string>;
//         const formErrors: Record<string, string> = {};
//         res.error.issues.forEach((issue) => {
//             const path = issue.path.join(".");
//             if (path) formErrors[path] = issue.message;
//         });
//         return formErrors;
//     }, []);

//     const handleDrop = useCallback(async (
//         e: React.DragEvent<HTMLLabelElement>,
//         setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void
//     ) => {
//         e.preventDefault();
//         const f = e.dataTransfer.files?.[0];
//         if (!f) return;
//         await setFieldValue("file", f, true);
//     }, []);

//     const handleFileChange = useCallback(async (
//         e: React.ChangeEvent<HTMLInputElement>,
//         setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void
//     ) => {
//         const f = e.target.files?.[0];
//         if (!f) return;
//         await setFieldValue("file", f, true);
//     }, []);

//     const dropHandlers = useMemo(() => ({
//         onDragOver: (e: React.DragEvent) => e.preventDefault(),
//         onDragEnter: (e: React.DragEvent) => e.preventDefault(),
//         onDragLeave: (e: React.DragEvent) => e.preventDefault(),
//     }), []);

//     const formatFileSize = (bytes: number): string => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     };

//     return (
//         <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
//             <div className="max-w-2xl mx-auto p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="text-2xl font-semibold">Upload File</h1>
//                     <div className="flex gap-2">
//                         <button
//                             type="button"
//                             onClick={testApolloServer}
//                             className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
//                         >
//                             Test Server
//                         </button>
//                         <button
//                             type="button"
//                             onClick={testUploadMethods}
//                             className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
//                         >
//                             Test Upload
//                         </button>
//                         <button
//                             type="button"
//                             onClick={testUploadFunction}
//                             className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
//                         >
//                             Test Simple
//                         </button>
//                     </div>
//                 </div>


//                 {banner && (
//                     <BannerError type={banner?.type || "success"} msg={banner?.msg || ""} />
//                 )}

//                 <Formik<UploadFileValues>
//                     initialValues={initialValues}
//                     validateOnBlur
//                     validateOnChange
//                     validateOnMount
//                     enableReinitialize={false}
//                     validate={validate}
//                     onSubmit={async (values, { setSubmitting, resetForm }) => {
//                         if (!values.file) {
//                             setBanner({ type: "error", msg: "Please select a file to upload" });
//                             return;
//                         }

//                         setSubmitting(true);
//                         setBanner(null);
//                         setIsUploading(true);
//                         setUploadProgress(0);

//                         try {
//                             // Upload to GraphQL API with real-time progress
//                             const uploadResult = await uploadFileWithProgress(values.file, (progress) => {
//                                 setUploadProgress(progress);
//                             });

//                             // Upload completed
//                             setIsUploading(false);

//                             setBanner({
//                                 type: "success",
//                                 msg: `File uploaded successfully! File ID: ${uploadResult.id}`
//                             });

//                             resetForm();
//                             setUploadProgress(0);
//                         } catch (error) {
//                             setIsUploading(false);
//                             setUploadProgress(0);
//                             setBanner({
//                                 type: "error",
//                                 msg: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
//                             });
//                         } finally {
//                             setSubmitting(false);
//                         }
//                     }}
//                 >
//                     {({ values, errors, touched, isSubmitting, setFieldValue }) => (
//                         <Form className="space-y-6">
//                             {/* File Info Display */}
//                             {values.file && (
//                                 <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
//                                     <h3 className="text-sm font-medium mb-2">Selected File:</h3>
//                                     <div className="flex items-center gap-3">
//                                         <span className="text-2xl">{getFileIcon(values.file.name)}</span>
//                                         <div className="flex-1">
//                                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                                                 {values.file.name}
//                                             </p>
//                                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                                                 {formatFileSize(values.file.size)} • {values.file.type || 'Unknown type'}
//                                             </p>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={() => setFieldValue("file", null)}
//                                             className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
//                                         >
//                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                             </svg>
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}

//                             <label
//                                 htmlFor="file-input"
//                                 className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700"
//                                 onDrop={(e) => handleDrop(e, setFieldValue)}
//                                 {...dropHandlers}
//                             >
//                                 <div className="flex flex-col items-center justify-center p-6 text-center">
//                                     <div className="text-4xl mb-2">📁</div>
//                                     <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
//                                         <span className="font-medium">Click to select</span> or drag & drop
//                                     </p>
//                                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                                         {values.file ? `Selected: ${values.file.name}` : "Any file type, ≤ 10MB"}
//                                     </p>
//                                 </div>
//                                 <input
//                                     id="file-input"
//                                     name="file"
//                                     type="file"
//                                     accept={ALLOWED_TYPES.join(",")}
//                                     className="hidden"
//                                     onChange={(e) => handleFileChange(e, setFieldValue)}
//                                 />
//                             </label>
//                             {touched.file && errors.file && (
//                                 <div className="text-xs text-red-600" role="alert">{errors.file as string}</div>
//                             )}

//                             {isUploading && (
//                                 <div>
//                                     <div className="w-full bg-gray-200 rounded-full h-3">
//                                         <div
//                                             className="bg-blue-500 h-3 rounded-full transition-all"
//                                             style={{ width: `${Math.floor(uploadProgress)}%` }}
//                                         />
//                                     </div>
//                                     <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
//                                         {Math.floor(uploadProgress)}%
//                                     </div>
//                                     <button
//                                         type="button"
//                                         className="mt-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm"
//                                         onClick={stopUpload}
//                                     >
//                                         Cancel Upload
//                                     </button>
//                                 </div>
//                             )}

//                             <label className="inline-flex items-center gap-2 text-sm">
//                                 <Field type="checkbox" name="acceptTerms" /> I accept the terms *
//                             </label>
//                             {touched.acceptTerms && (errors.acceptTerms as string) && (
//                                 <div className="-mt-1 text-xs text-red-600" role="alert">{errors.acceptTerms as string}</div>
//                             )}

//                             <div className="flex items-center gap-3">
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 rounded-xl text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 disabled:opacity-50"
//                                     disabled={isSubmitting || isUploading}
//                                 >
//                                     {isSubmitting ? "Submitting…" : "Submit"}
//                                 </button>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// };