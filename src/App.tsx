import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import useAuthStore from "@/stores/authStore";
import SignIn from "@/pages/sign_in/sign_in";
import ProfileForm from "@/pages/form/form";
import DragDropList from "@/pages/dragdrop/dnd";
import Home from "@/pages/home/home";



function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = createBrowserRouter([
     {
      path: "/",
      element: isAuthenticated ? <Home /> : <Navigate to="/auth" />,
    },
    {
      path: "/auth",
      element: <SignIn />,
    },
    {
      path: "/form",
      element: <ProfileForm />,
    },
    {
      path: "/dragdrop",
      element: <DragDropList />,
    },
   

  ]);
  return (
    <>
      {/* <ThemeProvider> */}
        <RouterProvider router={router} />
      {/* </ThemeProvider> */}
    </>
  );
}

export default App;
