import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/login';

function App() {
    return (
        // <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes Wrapper */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        // </AuthProvider>
    );
}

export default App;