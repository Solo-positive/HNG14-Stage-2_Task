import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Sidebar from './components/Sidebar';
import InvoiceListPage from './pages/InvoiceListPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Sidebar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<InvoiceListPage />} />
                <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </InvoiceProvider>
    </ThemeProvider>
  );
}
