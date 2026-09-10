import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isTradeRoute = location.pathname === '/trade' || location.pathname === '/exchange';

  return (
    <div className="flex h-screen overflow-hidden bg-vault-900 text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-vault-900/50 ${isTradeRoute ? '' : 'p-6'}`}>
          {isTradeRoute ? (
            <Outlet />
          ) : (
            <div className="container mx-auto max-w-7xl">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
