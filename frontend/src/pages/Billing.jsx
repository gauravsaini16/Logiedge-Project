import { useState, useEffect } from 'react';
import { getCustomers, getItems, createInvoice } from '../services/api';

function Billing() {
  const [step, setStep] = useState('home');
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

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

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
    setStep('billing');
  };

  const handleAddItem = (item) => {
    const exists = cart.find((i) => i.item_id === item.id);
    if (exists) {
      setCart(cart.map((i) =>
        i.item_id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, {
        item_id: item.id,
        name: item.name,
        unit_price: Number(item.unit_price),
        quantity: 1,
      }]);
    }
  };

  const handleUpdateQty = (item_id, delta) => {
    setCart(cart
      .map((i) => i.item_id === item_id
        ? { ...i, quantity: i.quantity + delta }
        : i
      )
      .filter((i) => i.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const gst = selectedCustomer?.gst_registered ? 0 : subtotal * 0.18;
  const total = subtotal + gst;

  const handleSubmit = async () => {
    try {
      const payload = {
        customer_id: selectedCustomer.id,
        items: cart.map((i) => ({
          item_id: i.item_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
      };
      const res = await createInvoice(payload);
      setGeneratedInvoice(res.data);
      setStep('generated');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setStep('home');
    setSelectedCustomer(null);
    setCart([]);
    setGeneratedInvoice(null);
  };

  // HOME STEP
  if (step === 'home') {
    return (
      <div>
        <h1 className="page-title">Billing</h1>
        <div className="card" style={{ maxWidth: '600px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
            Select a customer to start billing
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowCustomerModal(true)}
          >
            + New Bill
          </button>
        </div>

        {/* Customer Select Modal */}
        {showCustomerModal && (
          <div className="modal-overlay">
            <div className="modal" style={{ width: '560px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 className="modal-title" style={{ margin: 0 }}>Select Customer</h2>
                <button className="btn btn-secondary" onClick={() => setShowCustomerModal(false)}>
                  Cancel
                </button>
              </div>
              <div className="customer-grid">
                {customers.map((c) => (
                  <div key={c.id} className="customer-card">
                    <h4 style={{ marginBottom: '6px' }}>{c.name}</h4>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      {c.address}
                    </p>
                    <span className={`badge ${c.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                      {c.status}
                    </span>
                    <br />
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: '10px', width: '100%' }}
                      onClick={() => handleSelectCustomer(c)}
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // BILLING STEP
  if (step === 'billing') {
    return (
      <div>
        <h1 className="page-title">Billing</h1>
        <div className="card" style={{ maxWidth: '700px' }}>

          {/* Customer Info */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
              Customer Details
            </p>
            <p style={{ fontSize: '14px', fontWeight: '600' }}>{selectedCustomer.name}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>{selectedCustomer.address}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>PAN: {selectedCustomer.pan_card}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>GST: {selectedCustomer.gstin}</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>
              GST Registered:
              <span style={{ color: selectedCustomer.gst_registered ? '#16a34a' : '#dc2626', marginLeft: '6px', fontWeight: '600' }}>
                {selectedCustomer.gst_registered ? 'Yes (No GST applied)' : 'No (18% GST will apply)'}
              </span>
            </p>
          </div>

          {/* Add Items Button */}
          <button
            className="btn btn-primary"
            style={{ marginBottom: '16px' }}
            onClick={() => setShowItemModal(true)}
          >
            + Add Items
          </button>

          {/* Cart Table */}
          {cart.length > 0 && (
            <>
              <table className="table" style={{ marginBottom: '16px' }}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.item_id}>
                      <td>{item.name}</td>
                      <td>₹{item.unit_price.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '2px 10px' }}
                            onClick={() => handleUpdateQty(item.item_id, -1)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '2px 10px' }}
                            onClick={() => handleUpdateQty(item.item_id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>₹{(item.unit_price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ textAlign: 'right', fontSize: '14px', marginBottom: '20px' }}>
                <p style={{ marginBottom: '4px', color: '#6b7280' }}>
                  Subtotal: ₹{subtotal.toLocaleString()}
                </p>
                {gst > 0 && (
                  <p style={{ marginBottom: '4px', color: '#6b7280' }}>
                    GST (18%): ₹{gst.toLocaleString()}
                  </p>
                )}
                <p style={{ fontWeight: '700', fontSize: '16px' }}>
                  Total: ₹{total.toLocaleString()}
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleReset}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={cart.length === 0}
              style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
            >
              Generate Invoice
            </button>
          </div>
        </div>

        {/* Item Select Modal */}
        {showItemModal && (
          <div className="modal-overlay">
            <div className="modal" style={{ width: '560px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 className="modal-title" style={{ margin: 0 }}>Select Items</h2>
                <button className="btn btn-secondary" onClick={() => setShowItemModal(false)}>
                  Done
                </button>
              </div>
              <div className="customer-grid">
                {items.filter(i => i.status === 'Active').map((item) => {
                  const inCart = cart.find((c) => c.item_id === item.id);
                  return (
                    <div key={item.id} className="customer-card">
                      <h4 style={{ marginBottom: '4px' }}>{item.name}</h4>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                        ₹{Number(item.unit_price).toLocaleString()}
                      </p>
                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '2px 8px' }}
                            onClick={() => handleUpdateQty(item.id, -1)}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>
                            {inCart.quantity}
                          </span>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '2px 8px' }}
                            onClick={() => handleUpdateQty(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                          onClick={() => handleAddItem(item)}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // GENERATED STEP
  if (step === 'generated') {
    return (
      <div>
        <h1 className="page-title">Billing</h1>
        <div className="card" style={{ maxWidth: '700px' }}>

          {/* Invoice Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Invoice Generated!</h2>
            <span style={{
              background: '#1e3a8a',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {generatedInvoice.invoice_id}
            </span>
          </div>

          {/* Customer Info */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '6px' }}>{selectedCustomer.name}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>{selectedCustomer.address}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>PAN: {selectedCustomer.pan_card}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>GST: {selectedCustomer.gstin}</p>
          </div>

          {/* Items */}
          <table className="table" style={{ marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.item_id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.unit_price.toLocaleString()}</td>
                  <td>₹{(item.unit_price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ textAlign: 'right', fontSize: '14px', marginBottom: '24px' }}>
            <p style={{ marginBottom: '4px', color: '#6b7280' }}>
              Subtotal: ₹{subtotal.toLocaleString()}
            </p>
            {gst > 0 && (
              <p style={{ marginBottom: '4px', color: '#6b7280' }}>
                GST (18%): ₹{gst.toLocaleString()}
              </p>
            )}
            <p style={{ fontWeight: '700', fontSize: '16px' }}>
              Total: ₹{total.toLocaleString()}
            </p>
          </div>

          {/* New Bill Button */}
          <button className="btn btn-primary" onClick={handleReset}>
            Create New Bill
          </button>
        </div>
      </div>
    );
  }
}

export default Billing;