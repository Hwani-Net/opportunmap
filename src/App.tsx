import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./hooks/useAuth";

function ContestRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/?detail=${id}`} replace />;
}

function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="w-6 h-6 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/contest/:id" element={<ContestRedirect />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
