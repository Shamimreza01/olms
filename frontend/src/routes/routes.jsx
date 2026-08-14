import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingPage from "../components/ui/LoadingPage";
import Register from "../pages/auth/Register";

// ─── Code-split dashboard pages ──────────────────────────────
// Each dashboard loads as its own JS chunk — a Student never
// downloads Admin or Teacher code, and vice versa.
const HomePage = lazy(() => import("../pages/HomePage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingPage />}>
        <HomePage />
      </Suspense>
    ),
    errorElement: (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <p className="mt-2 text-slate-400">Page Not Found</p>
        <a href="/" className="mt-4 px-4 py-2 bg-blue-600 rounded-xl font-bold text-xs">
          Return Home
        </a>
      </div>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
