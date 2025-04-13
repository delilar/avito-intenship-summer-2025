import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './components/Header';
import { IssuesPage } from './pages/IssuesPage';
import { BoardsPage } from './pages/BoardsPage';
import { BoardPage } from './pages/BoardPage';

export default function App() {
  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/boards" replace />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/board/:id" element={<BoardPage />} />
        </Routes>
      </DndProvider>
    </BrowserRouter>
  );
}