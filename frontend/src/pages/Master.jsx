import { useState, useEffect } from 'react';
import {
  getCustomers, createCustomer,
  getItems, createItem
} from '../services/api';

function Master() {
  const [view, setView] = useState('home');
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    name: '', address: '', pan_card: '',
    gstin: '', gst_registered: false, status: 'Active'
  });

  const [itemForm, setItemForm] = useState({
    name: '', unit_price: '', status: 'Active'
  });

  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      await createCustomer(customerForm);
      setShowCustomerForm(false);
      setCustomerForm({
        name: '', address: '', pan_card: '',
        gstin: '', gst_registered: false, status: 'Active'
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateItem = async () => {
    try {
      await createItem(itemForm);
      setShowItemForm(false);
      setItemForm({ name: '', unit_price: '', status: 'Active' });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  // HOME VIEW
  if (view === 'home') {
    return (
      <div>
        <h1 className="page-title">Master</h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div
            className="card"
            style={{ width: '200px', cursor: 'pointer' }}
            onClick={() => setView('customers')}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              Customer
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Read or Create customer data
            </p>
          </div>
          <div
            className="card"
            style={{ width: '200px', cursor: 'pointer' }}
            onClick={() => setView('items')}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              Items
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Read or Create items data
            </p>
          </div>
        </div>
      </div>
    );
  }

  // CUSTOMERS VIEW
  if (view === 'customers') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button className="btn btn-secondary" onClick={() => setView('home')}>
            Back
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>Customers</h1>
          <button
            className="btn btn-primary"
            style={{ marginLeft: 'auto' }}
            onClick={() => setShowCustomerForm(true)}
          >
            + Add
          </button>
        </div>

        <div className="customer-grid">
          {customers.map((c) => (
            <div key={c.id} className="customer-card">
              <h4>{c.name}</h4>
              <span className={`badge ${c.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>

        {/* Add Customer Modal */}
        {showCustomerForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="modal-title">Add New Customer</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-group">
                  <label>Customer Address</label>
                  <input
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label>Pan Card Number</label>
                  <input
                    value={customerForm.pan_card}
                    onChange={(e) => setCustomerForm({ ...customerForm, pan_card: e.target.value })}
                    placeholder="Enter PAN"
                  />
                </div>
                <div className="form-group">
                  <label>GST Number</label>
                  <input
                    value={customerForm.gstin}
                    onChange={(e) => setCustomerForm({ ...customerForm, gstin: e.target.value })}
                    placeholder="Enter GSTIN"
                  />
                </div>
                <div className="form-group">
                  <label>Customer Status</label>
                  <select
                    value={customerForm.status}
                    onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>GST Registered</label>
                  <select
                    value={customerForm.gst_registered}
                    onChange={(e) => setCustomerForm({
                      ...customerForm,
                      gst_registered: e.target.value === 'true'
                    })}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setShowCustomerForm(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreateCustomer}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ITEMS VIEW
  if (view === 'items') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button className="btn btn-secondary" onClick={() => setView('home')}>
            Back
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>Items</h1>
          <button
            className="btn btn-primary"
            style={{ marginLeft: 'auto' }}
            onClick={() => setShowItemForm(true)}
          >
            + Add
          </button>
        </div>

        <div className="customer-grid">
          {items.map((item) => (
            <div key={item.id} className="customer-card">
              <h4>{item.name}</h4>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0' }}>
                ₹{Number(item.unit_price).toLocaleString()}
              </p>
              <span className={`badge ${item.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {/* Add Item Modal */}
        {showItemForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="modal-title">Add New Item</h2>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="form-group">
                <label>Selling Price</label>
                <input
                  type="number"
                  value={itemForm.unit_price}
                  onChange={(e) => setItemForm({ ...itemForm, unit_price: e.target.value })}
                  placeholder="Enter price"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={itemForm.status}
                  onChange={(e) => setItemForm({ ...itemForm, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setShowItemForm(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreateItem}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Master;