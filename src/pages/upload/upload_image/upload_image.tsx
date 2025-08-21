import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { testApolloServer, testUploadMethods } from "@/services/apollo.service";
// import { testUploadFunction } from "@/services/test_upload";
import BannerError from "@/components/ui/banner_error";
import { validateUpload } from "@/helpers/validations";
import type { UploadImageValues } from "@/types/form.types";
import { uploadFileWithProgress } from "@/services/upload.service";

const initialValues: UploadImageValues = {
    file: null,
    acceptTerms: false,
};

export const UploadImage: React.FC = () => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [banner, setBanner] = useState<null | { type: "success" | "error"; msg: string }>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const stopUpload = useCallback(() => {
        setIsUploading(false);
        setUploadProgress(0);
        // Note: XMLHttpRequest doesn't support easy cancellation in this implementation
        // For production, you might want to store the xhr instance and call xhr.abort()
    }, []);

    const handleDrop = useCallback(async (
        e: React.DragEvent<HTMLLabelElement>,
        setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void
    ) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (!f) return;

        // Create preview URL for image
        if (f.type.startsWith('image/')) {
            const url = URL.createObjectURL(f);
            setPreviewUrl(url);
        }

        await setFieldValue("file", f, true);
    }, []);

    const handleFileChange = useCallback(async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void
    ) => {
        const f = e.target.files?.[0];
        if (!f) return;

        // Create preview URL for image
        if (f.type.startsWith('image/')) {
            const url = URL.createObjectURL(f);
            setPreviewUrl(url);
        }

        await setFieldValue("file", f, true);
        console.log("Selected file:", f);
    }, []);

    const dropHandlers = useMemo(() => ({
        onDragOver: (e: React.DragEvent) => e.preventDefault(),
        onDragEnter: (e: React.DragEvent) => e.preventDefault(),
        onDragLeave: (e: React.DragEvent) => e.preventDefault(),
    }), []);

    // Cleanup preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);



    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Upload Image with Preview</h1>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={testApolloServer}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Test Server
                        </button>
                        <button
                            type="button"
                            onClick={testUploadMethods}
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Test Upload
                        </button>
                        {/* <button
                            type="button"
                            onClick={testUploadFunction}
                            className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            Test Simple
                        </button> */}
                    </div>
                </div>

                {banner && (
                    <BannerError type={banner?.type || "success"} msg={banner?.msg || ""} />
                )}

                <Formik<UploadImageValues>
                    initialValues={initialValues}
                    validateOnBlur
                    validateOnChange
                    validateOnMount
                    enableReinitialize={false}
                    validate={validateUpload}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        if (!values.file) {
                            setBanner({ type: "error", msg: "Please select a file to upload" });
                            return;
                        }
                        console.log("Submitting values:", values);

                        setSubmitting(true);
                        setBanner(null);
                        setIsUploading(true);
                        setUploadProgress(0);

                        try {
                            // Upload to GraphQL API with real-time progress
                            const uploadResult = await uploadFileWithProgress(values.file, (progress) => {
                                setUploadProgress(progress);
                            });

                            // Upload completed
                            setIsUploading(false);

                            setBanner({
                                type: "success",
                                msg: `Image uploaded successfully! File ID: ${uploadResult.id}`
                            });

                            resetForm();
                            setUploadProgress(0);
                            setPreviewUrl(null);
                        } catch (error) {
                            setIsUploading(false);
                            setUploadProgress(0);
                            setBanner({
                                type: "error",
                                msg: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                            });
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                        <Form className="space-y-6">
                            {/* Image Preview */}
                            {previewUrl && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2">Image Preview:</h3>
                                    <div className="relative inline-block">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300 dark:border-gray-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewUrl(null);
                                                setFieldValue("file", null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}

                            <label
                                htmlFor="image-input"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                                onDrop={(e) => handleDrop(e, setFieldValue)}
                                {...dropHandlers}
                            >
                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Click to select</span> or drag & drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {values.file ? `Selected: ${values.file.name}` : "PNG/JPG, ≥ 300x300, ≤ 5MB"}
                                    </p>
                                </div>
                                <input
                                    id="image-input"
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setFieldValue)}
                                />
                            </label>
                            {touched.file && errors.file && (
                                <div className="text-xs text-red-600" role="alert">{errors.file as string}</div>
                            )}

                            {isUploading && (
                                <div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-500 h-3 rounded-full transition-all"
                                            style={{ width: `${Math.floor(uploadProgress)}%` }}
                                        />
                                    </div>
                                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                        {Math.floor(uploadProgress)}%
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm"
                                        onClick={stopUpload}
                                    >
                                        Cancel Upload
                                    </button>
                                </div>
                            )}

                            <label className="inline-flex items-center gap-2 text-sm">
                                <Field type="checkbox" name="acceptTerms" /> I accept the terms *
                            </label>
                            {touched.acceptTerms && (errors.acceptTerms as string) && (
                                <div className="-mt-1 text-xs text-red-600" role="alert">{errors.acceptTerms as string}</div>
                            )}

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 disabled:opacity-50"
                                    disabled={isSubmitting || isUploading}
                                >
                                    {isSubmitting ? "Submitting…" : "Submit"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
