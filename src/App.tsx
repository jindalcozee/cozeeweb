/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Product } from './pages/Product';
import { Checkout } from './pages/Checkout';
import { Shop } from './pages/Shop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto flex flex-col">

        {/* Global UI Components */}
        <Header />
        <CartDrawer />
        <MenuDrawer />

        {/* Page Routes */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>

        <StackedCircularFooter />
      </div>
    </Router>
  );
}
