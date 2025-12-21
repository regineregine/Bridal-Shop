import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './user/pages/Home';
import Shop from './user/pages/Shop';
import Contact from './user/pages/Contact';
import SizeGuide from './user/pages/SizeGuide';
import Reservation from './user/pages/Reservation';
import ProductDetail from './user/pages/ProductDetail';
import Profile from './user/pages/Profile';
import Orders from './user/pages/Orders';
import PlaceOrder from './user/pages/PlaceOrder';
import Cart from './user/pages/Cart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
