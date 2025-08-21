import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from 'sonner';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/configs/apollo';

import useAuthStore from "@/stores/authStore";
import SignIn from "@/pages/sign_in/sign_in";
import ProfileForm from "@/pages/form/form";
import DragDropList from "@/pages/dragdrop/dnd";
import Home from "@/pages/home/home";
import Upload from "@/pages/upload/upload";

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
    {
      path: "/upload",
      element: <Upload />,
    },

  ]);
  return (
    <ApolloProvider client={apolloClient}>
      {/* <ThemeProvider> */}
        <RouterProvider router={router} />
        <Toaster />
      {/* </ThemeProvider> */}
    </ApolloProvider>
  );
}

export default App;