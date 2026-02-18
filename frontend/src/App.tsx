import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Finance from "./pages/Finance";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Customers</Link> | <Link to="/products">Inventory</Link> |{" "}
        <Link to="/orders">Sales & Orders</Link> | <Link to="/finance">Finance</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/finance" element={<Finance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
