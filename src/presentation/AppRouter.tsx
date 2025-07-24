import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const GeneratePage = lazy(() => import('./pages/GeneratePage'));
const MyPalettesPage = lazy(() => import('./pages/MyPalettesPage'));
const PaletteDetailsPage = lazy(() => import('./pages/PaletteDetailsPage'));
const EditPalettePage = lazy(() => import('./pages/EditPalettePage'));
const ContrastCheckerPage = lazy(() => import('./pages/ContrastCheckerPage'));

export function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/gerar" />} />
          <Route path="/gerar" element={<GeneratePage />} />
          <Route path="/paletas" element={<MyPalettesPage />} />
          <Route path="/paleta/:id" element={<PaletteDetailsPage />} />
          <Route path="/paleta/:id/editar" element={<EditPalettePage />} />
          <Route path="/contraste" element={<ContrastCheckerPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
} 