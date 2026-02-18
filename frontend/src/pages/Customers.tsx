import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../services/api";
import Modal from "../components/Modal";

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const load = async () => {
    const res = await api.get<Customer[]>("/customers");
    setCustomers(res.data);
  };

  const create = async () => {
    if (!name || !email) return;
    try {
      const response = await api.post("/customers", { name, email });
      console.log("Customer created:", response.data);
      setName("");
      setEmail("");
      setIsModalOpen(false);
      load();
    } catch (error: unknown) {
      console.error("Failed to create customer:", error);
      if (axios.isAxiosError(error)) {
        alert(`Failed to create customer: ${error.response?.data || error.message}`);
      } else {
        alert("Failed to create customer");
      }
    }
  };

  const remove = async (id: string) => {
    await api.delete(`/customers/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Customer Management</h2>
      <div className="card">
        <button onClick={() => setIsModalOpen(true)}>+ Add Customer</button>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => remove(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Customer"
      >
        <div className="form-group">
          <label>Name</label>
          <input
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
