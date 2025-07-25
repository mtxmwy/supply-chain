import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Suppliers from './pages/Suppliers/Suppliers';
import Purchase from './pages/Purchase/Purchase';
import Sales from './pages/Sales/Sales';
import Inventory from './pages/Inventory/Inventory';
import Warehouse from './pages/Warehouse/Warehouse';
import Store from './pages/Store/Store';
import Finance from './pages/Finance/Finance';
import Login from './pages/Login/Login';
import './App.css';

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem('token'); // 简单的认证状态检查

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          {!isAuthenticated ? (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/warehouse" element={<Warehouse />} />
                <Route path="/store" element={<Store />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          )}
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
