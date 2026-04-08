import React, { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/Products/ProductsPage';
import ProductDetailPage from './pages/Products/ProductDetailPage';
import ProjectPage from './pages/Project/ProjectPage';
import ProjectDetailPage from './pages/Project/ProjectDetailPage';
import AboutPage from './pages/About/AboutPage';
import BespokePage from './pages/Bespoke/BespokePage';
import StorePage from './pages/Store/StorePage';
import ContactPage from './pages/Contact/ContactPage';
import CartPage from './pages/Cart/CartPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import { AdminEnquiriesPage, AdminNewsletterPage, AdminSettingsPage, AdminUsersPage } from './pages/Admin/AdminCrudPages';
import { AdminProductFormPage } from './pages/Admin/ProductComponent/AdminProductFormPage';
import { AdminProductsPage } from './pages/Admin/ProductComponent/AdminProductsPage';
import { AdminProjectsPage } from './pages/Admin/ProjectsComponent/AdminProjectsPage';
import { AdminProjectFormPage } from './pages/Admin/ProjectsComponent/AdminProjectFormPage';
import { AdminArchivesPage } from './pages/Admin/ArchivesComponent/AdminArchivesPage';
import { AdminArchiveFormPage } from './pages/Admin/ArchivesComponent/AdminArchiveFormPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrderSuccessPage from './pages/Checkout/OrderSuccessPage';
import MyOrdersPage from './pages/Orders/MyOrdersPage';
import AdminOrdersPage from './pages/Admin/AdminOrdersPage';

// NEW
import DeliveryLoginPage from './pages/Delivery/DeliveryLoginPage';
import DeliveryDashboardPage from './pages/Delivery/DeliveryDashboardPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const NotFoundPage = () => (
  <section className="min-h-[60vh] grid place-items-center">
    <div className="text-center">
      <p className="tracking-label text-stone">404</p>
      <h1 className="font-serif-display text-6xl text-charcoal">Page not found</h1>
    </div>
  </section>
);

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDeliveryRoute = location.pathname.startsWith('/delivery');

  return (
    <div className="bg-ivory min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAdminRoute && !isDeliveryRoute && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/bespoke" element={<BespokePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/delivery/login" element={<DeliveryLoginPage />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboardPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/create" element={<AdminProductFormPage />} />
            <Route path="products/edit/:id" element={<AdminProductFormPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="projects/create" element={<AdminProjectFormPage />} />
            <Route path="projects/edit/:id" element={<AdminProjectFormPage />} />
            <Route path="archives" element={<AdminArchivesPage />} />
            <Route path="archives/create" element={<AdminArchiveFormPage />} />
            <Route path="archives/edit/:id/" element={<AdminArchiveFormPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && !isDeliveryRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <Router>
            <AppLayout />
          </Router>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}