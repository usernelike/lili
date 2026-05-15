import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Home from './pages/Home'
import EnterpriseQuery from './pages/EnterpriseQuery'
import FinancialData from './pages/FinancialData'
import LiliStockQuery from './pages/LiliStockQuery'
import StockDetail from './pages/StockDetail'
import InterviewKnowledgeBase from './pages/InterviewKnowledgeBase'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

function RequireGuest({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<RequireGuest><LoginPage /></RequireGuest>} />
        <Route path="/register" element={<RequireGuest><RegisterPage /></RequireGuest>} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="enterprise" element={<RequireAuth><EnterpriseQuery /></RequireAuth>} />
          <Route path="financial" element={<RequireAuth><FinancialData /></RequireAuth>} />
          <Route path="lili" element={<RequireAuth><LiliStockQuery /></RequireAuth>} />
          <Route path="stock/:code" element={<RequireAuth><StockDetail /></RequireAuth>} />
          <Route path="interview" element={<RequireAuth><InterviewKnowledgeBase /></RequireAuth>} />
          <Route path="legal" element={<RequireAuth><Legal /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
