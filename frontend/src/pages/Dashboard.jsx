import { useState, useEffect } from 'react';
import { getInvoices, getInvoiceById } from '../services/api';

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await getInvoices();
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Please enter an Invoice ID');
      return;
    }
    try {
      setError('');
      const res = await getInvoiceById(searchId.trim());
      setSelectedInvoice(res.data);
    } catch (err) {
      setError('Invoice not found');
      setSelectedInvoice(null);
    }
  };

  const handleView = async (invoiceId) => {
    try {
      const res = await getInvoiceById(invoiceId);
      setSelectedInvoice(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    setSelectedInvoice(null);
    setError('');
  };

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search by Invoice ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            padding: '8px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            width: '280px',
            outline: 'none',
          }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        {searchId && (
          <button className="btn btn-secondary" onClick={handleClearSearch}>
            Clear
          </button>
        )}
      </div>

      {error && (
        <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </p>
      )}

      {/* Invoice Details Panel */}
      {selectedInvoice && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Invoice Details</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                Invoice ID: <strong>{selectedInvoice.invoice_id}</strong>
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px', fontWeight: '600' }}>
              Customer Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
              <p><span style={{ color: '#6b7280' }}>Name</span> : {selectedInvoice.customer_name}</p>
              <p><span style={{ color: '#6b7280' }}>Address</span> : {selectedInvoice.address}</p>
              <p><span style={{ color: '#6b7280' }}>Pan Card</span> : {selectedInvoice.pan_card}</p>
              <p><span style={{ color: '#6b7280' }}>GST Num</span> : {selectedInvoice.gstin}</p>
            </div>
          </div>

          {/* Items Table */}
          <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>Items</p>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items?.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{Number(item.line_total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '14px' }}>
            <p style={{ marginBottom: '4px', color: '#6b7280' }}>
              Subtotal: ₹{Number(selectedInvoice.subtotal).toLocaleString()}
            </p>
            {Number(selectedInvoice.gst_amount) > 0 && (
              <p style={{ marginBottom: '4px', color: '#6b7280' }}>
                GST (18%): ₹{Number(selectedInvoice.gst_amount).toLocaleString()}
              </p>
            )}
            <p style={{ fontWeight: '600', fontSize: '16px' }}>
              Total: ₹{Number(selectedInvoice.total).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#6b7280' }}>
                  No invoices yet
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoice_id}</td>
                  <td>{inv.customer_name}</td>
                  <td>₹{Number(inv.total).toLocaleString()}</td>
                  <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleView(inv.invoice_id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;