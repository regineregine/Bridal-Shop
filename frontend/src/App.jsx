import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './user/pages/Home';
import Shop from './user/pages/Shop';
import Contact from './user/pages/Contact';
import SizeGuide from './user/pages/SizeGuide';
import ProductDetail from './user/pages/ProductDetail';
import Profile from './user/pages/Profile';
import Orders from './user/pages/Orders';
import PlaceOrder from './user/pages/PlaceOrder';
import Cart from './user/pages/Cart';
import RefundPolicy from './user/pages/RefundPolicy';
import ResetPassword from './user/pages/ResetPassword';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/AdminProducts';
import AdminAddProduct from './admin/pages/AdminAddProduct';
import AdminOrders from './admin/pages/AdminOrders';
import AdminOrderDetails from './admin/pages/AdminOrderDetails';
import AdminCustomers from './admin/pages/AdminCustomers';
import AdminCustomerDetails from './admin/pages/AdminCustomerDetails';
import AdminEditProduct from './admin/pages/AdminEditProduct';

function App() {
  return (
    <Router>
      <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/customers/:id" element={<AdminCustomerDetails />} />
          <Route path="/admin/customers/details" element={<Navigate to="/admin/customers" replace />} />
          <Route path="/admin/orders/details" element={<Navigate to="/admin/orders" replace />} />
          <Route path="/admin/refund" element={<Navigate to="/admin/orders" replace />} />
        </Routes>
    </Router>
  );
}

export default App;
