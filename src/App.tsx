import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { CollectionPoints } from './pages/CollectionPoints';
import { ScheduleCollection } from './pages/ScheduleCollection';
import { CollectionSchedules } from './pages/CollectionSchedules';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { PrivateRoute } from './components/PrivateRoute';
import { CollectionPointsCooperative } from './pages/CollectionPointsCooperative';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route
                path="/pontos-coleta"
                element={
                  <PrivateRoute>
                    <CollectionPoints />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pontos-descarte"
                element={
                  <PrivateRoute>
                    <CollectionPointsCooperative />
                  </PrivateRoute>
                }
              />
              <Route
                path="/agendamentos"
                element={
                  <PrivateRoute>
                    <ScheduleCollection />
                  </PrivateRoute>
                }
              />
              <Route
                path="/coletas"
                element={
                  <PrivateRoute>
                    <CollectionSchedules />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}