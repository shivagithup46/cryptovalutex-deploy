import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TradingView from './pages/TradingView';
import LiveMarket from './pages/LiveMarket';
import WalletDashboard from './pages/WalletDashboard';
import P2pMarket from './pages/P2pMarket';
import StakingDashboard from './pages/StakingDashboard';
import TaxDashboard from './pages/TaxDashboard';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import AIAssistant from './pages/AIAssistant';
import AdminDashboard from './pages/AdminDashboard';
import SystemMonitor from './pages/SystemMonitor';
import CryptoNews from './pages/CryptoNews';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import TradeIdeaPage from './pages/TradeIdeaPage';
import TutorialsPage from './pages/TutorialsPage';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trade-idea/:id" element={<TradeIdeaPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          <Route path="trade" element={<TradingView />} />
          <Route path="markets" element={<LiveMarket />} />
          <Route path="exchange" element={<LiveMarket />} />
          <Route path="wallet" element={<WalletDashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="p2p" element={<P2pMarket />} />
          <Route path="staking" element={<StakingDashboard />} />
          <Route path="tax" element={<TaxDashboard />} />
          <Route path="analytics" element={<AdvancedAnalytics />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="monitor" element={<SystemMonitor />} />
          <Route path="news" element={<CryptoNews />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
