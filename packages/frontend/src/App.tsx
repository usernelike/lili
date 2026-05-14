import { Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="enterprise" element={<EnterpriseQuery />} />
          <Route path="financial" element={<FinancialData />} />
          <Route path="lili" element={<LiliStockQuery />} />
          <Route path="stock/:code" element={<StockDetail />} />
          <Route path="interview" element={<InterviewKnowledgeBase />} />
          <Route path="legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
