import { useEffect, useState } from "react";
import { api } from "../services/api";
import Modal from "../components/Modal";

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: string;
  customerName: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const loadData = async () => {
    const [ordersRes, customersRes, productsRes] = await Promise.all([
      api.get<Order[]>("/orders"),
      api.get<Customer[]>("/customers"),
      api.get<Product[]>("/products"),
    ]);
    setOrders(ordersRes.data);
    setCustomers(customersRes.data);
    setProducts(productsRes.data);
  };

  const create = async () => {
    if (!customerId || !productId || !quantity) return;
    try {
      await api.post("/orders", {
        customerId,
        productId,
        quantity: parseInt(quantity),
      });
      setCustomerId("");
      setProductId("");
      setQuantity("1");
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Check stock availability.");
    }
  };

  const remove = async (id: string) => {
    await api.delete(`/orders/${id}`);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h2>Sales & Orders</h2>
      <div className="card">
        <button onClick={() => setIsModalOpen(true)}>+ Create Order</button>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.customerName}</td>
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td>${o.totalPrice.toFixed(2)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => remove(o.id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Order"
      >
        <div className="form-group">
          <label>Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (${p.price} - Stock: {p.stock})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button onClick={create}>Create Order</button>
        </div>
      </Modal>
    </div>
  );
}
