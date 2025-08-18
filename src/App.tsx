import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import SignIn from "./component/page/sign-in/sign-in";
import Home from "./component/page/home/home";
import useAuthStore from "./store/authStore";
import { AuthProvider } from "./store/authProvider";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <SignIn />,
    },
    {
      path: "/",
      element: isAuthenticated ? <Home /> : <Navigate to="/auth" />,
    },
  ]);
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
