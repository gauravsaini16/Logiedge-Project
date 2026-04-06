# LogiEdge Billing Dashboard

A full-stack web application for managing billing operations, generating invoices, and managing customer and item master data.

## Tech Stack

**Frontend:** React JS
**Backend:** Node.js, Express.js
**Database:** PostgreSQL

### Master Module

- View all customers with Active/Inactive status
- Add new customers with GST registration details
- View all items with pricing
- Add new items

### Billing Module

- Select customer to generate bill
- Add multiple items with quantity control
- GST logic:
  - Customer is GST registered → 0% GST applied
  - Customer is not GST registered → 18% GST applied
- Auto generated Invoice ID (format: INVC + 6 digits e.g. INVC224830)

### Dashboard Module

- View all recently generated invoices
- Search invoice by Invoice ID
- View complete invoice details with customer info and items
