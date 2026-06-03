import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import LoveEntrance, { isLoveDay } from './components/LoveEntrance/LoveEntrance'
import Home from './pages/Home'
import EnterpriseQuery from './pages/EnterpriseQuery'
import FinancialData from './pages/FinancialData'
import LiliStockQuery from './pages/LiliStockQuery'
import StockDetail from './pages/StockDetail'
import InterviewKnowledgeBase from './pages/InterviewKnowledgeBase'
import WorldCup from './pages/WorldCup/WorldCup'
import WorldCupTeamDetail from './pages/WorldCup/WorldCupTeamDetail'
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
  const [showLoveEntrance, setShowLoveEntrance] = useState(isLoveDay())

  const handleEntranceComplete = () => setShowLoveEntrance(false)

  return (
    <>
      {showLoveEntrance && <LoveEntrance onComplete={handleEntranceComplete} />}
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
          <Route path="worldcup" element={<WorldCup />} />
          <Route path="worldcup/team/:teamId" element={<WorldCupTeamDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* 兜底：未匹配任何路由时显示 404（如 /login/abc 等） */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
