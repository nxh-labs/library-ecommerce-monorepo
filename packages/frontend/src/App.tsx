import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Header, Footer } from "./components";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";
import { setOnUnauthorizedHandler } from "./services/api";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col min-w-screen">
          <Header />
          <Main />
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

function Main() {
  const navigate = useNavigate();
  useEffect(() => {
    setOnUnauthorizedHandler(() => {
      navigate("/login");
    });
    return () => setOnUnauthorizedHandler(() => {});
  }, [navigate]);
  return (
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </main>
  );
}

export default App;
