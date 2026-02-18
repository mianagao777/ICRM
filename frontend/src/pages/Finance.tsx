import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Order {
  id: string;
  customerName: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface FinanceSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export default function Finance() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });

  const loadData = async () => {
    const [ordersRes, productsRes, customersRes] = await Promise.all([
      api.get<Order[]>("/orders"),
      api.get<Product[]>("/products"),
      api.get<{ id: string }[]>("/customers"),
    ]);
    setOrders(ordersRes.data);
    setProducts(productsRes.data);

    const totalRevenue = ordersRes.data.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = ordersRes.data.length;
    const totalCustomers = customersRes.data.length;
    setSummary({
      totalRevenue,
      totalOrders,
      totalProducts: productsRes.data.length,
      totalCustomers,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div>
      <h2>Finance</h2>
      <div className="grid grid-3">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${summary.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{summary.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Average Order Value</h3>
          <p>${summary.averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{summary.totalCustomers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{summary.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Inventory Value</h3>
          <p>${inventoryValue.toFixed(2)}</p>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Order History</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id.slice(0, 8)}...</td>
                <td>{o.customerName}</td>
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td>${o.totalPrice.toFixed(2)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
