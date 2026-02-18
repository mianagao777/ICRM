import { useEffect, useState } from "react";
import { api } from "../services/api";
import Modal from "../components/Modal";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const load = async () => {
    const res = await api.get<Product[]>("/products");
    setProducts(res.data);
  };

  const create = async () => {
    if (!name || !price || !stock) return;
    try {
      await api.post("/products", {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
      });
      setName("");
      setPrice("");
      setStock("");
      setIsModalOpen(false);
      load();
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product");
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    await api.put(`/products/${id}`, { stock: newStock });
    load();
  };

  const remove = async (id: string) => {
    await api.delete(`/products/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Inventory</h2>
      <div className="card">
        <button onClick={() => setIsModalOpen(true)}>+ Add Product</button>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>
                  <button onClick={() => updateStock(p.id, p.stock - 1)}>-</button>
                  {" "}{p.stock}{" "}
                  <button onClick={() => updateStock(p.id, p.stock + 1)}>+</button>
                </td>
                <td>
                  <button onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Product"
      >
        <div className="form-group">
          <label>Product Name</label>
          <input
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            placeholder="Enter price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input
            placeholder="Enter stock quantity"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button onClick={create}>Save</button>
        </div>
      </Modal>
    </div>
  );
}
