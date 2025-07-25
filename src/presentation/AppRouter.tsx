import { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Header } from './components/Header';

const GeneratePage = lazy(() => import('./pages/GeneratePage'));
const MyPalettesPage = lazy(() => import('./pages/MyPalettesPage'));
const PaletteDetailsPage = lazy(() => import('./pages/PaletteDetailsPage'));
const EditPalettePage = lazy(() => import('./pages/EditPalettePage'));
const ContrastCheckerPage = lazy(() => import('./pages/ContrastCheckerPage'));

export function AppRouter() {
  return (
    <Router>
      <Header />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            Carregando...
          </div>
        }
      >
        <div className="pt-20">
          {' '}
          {/* padding para não esconder atrás do header */}
          <Routes>
            <Route path="/" element={<Navigate to="/gerar" />} />
            <Route path="/gerar" element={<GeneratePage />} />
            <Route path="/paletas" element={<MyPalettesPage />} />
            <Route path="/paleta/:id" element={<PaletteDetailsPage />} />
            <Route path="/paleta/:id/editar" element={<EditPalettePage />} />
            <Route path="/contraste" element={<ContrastCheckerPage />} />
          </Routes>
        </div>
      </Suspense>
    </Router>
  );
}
