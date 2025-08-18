import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuthStore from "../../../store/authStore";
import { useNavigate } from "react-router-dom";

// Định nghĩa type cho form
interface SignInForm {
  email: string;
  password: string;
}

// Schema validate với Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const SignIn: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: yupResolver(schema),
  });

  // Hàm submit form
  const onSubmit = (data: SignInForm) => {
    const { email, password } = data;
    if (email === "admin@gmail.com" && password === "123456") {
      login(); // Gọi hàm login từ authStore
      navigate("/"); // Chuyển hướng về trang Home
      setErrorMessage(null); // Xóa thông báo lỗi (nếu có)
    } else {
      setErrorMessage("Invalid email or password"); // Hiển thị lỗi
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-extrabold text-indigo-600">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-indigo-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="email"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none sm:text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-500 hover:text-indigo-400"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                {...register("password")}
                autoComplete="current-password"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none sm:text-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errorMessage}
            </p>
          )}

          {/* Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-all"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold text-indigo-500 hover:text-indigo-400"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
