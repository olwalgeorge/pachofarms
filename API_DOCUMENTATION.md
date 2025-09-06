# Pacho Farms API Documentation

## Base URL
`http://localhost:3001/api`

## Available Endpoints

### 🌱 Products
- `GET /products` - Get all products with filtering
  - Query params: `category`, `status`, `search`, `limit`, `offset`
- `POST /products` - Create new product
- `GET /products/{id}` - Get specific product with details
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `POST /products/{id}/stock` - Update product stock
  - Body: `{ quantity, type: "in|out|adjustment", reason?, reference? }`

### 🚜 Fields
- `GET /fields` - Get all fields
  - Query params: `includeOperations=true`
- `POST /fields` - Create new field
- `GET /fields/{id}` - Get specific field with operations and care programs
- `PUT /fields/{id}` - Update field
- `DELETE /fields/{id}` - Delete field

### 📋 Operations
- `GET /operations` - Get field operations
  - Query params: `fieldId`, `status`, `type`, `limit`
- `POST /operations` - Create new operation
- `GET /operations/{id}` - Get specific operation
- `PUT /operations/{id}` - Update operation
- `DELETE /operations/{id}` - Delete operation

### 🧴 Care Programs
- `GET /care-programs` - Get care programs
  - Query params: `fieldId`, `status`, `type`
- `POST /care-programs` - Create new care program

### 👥 Customers
- `GET /customers` - Get all customers
  - Query params: `type`, `status`, `search`
- `POST /customers` - Create new customer
- `GET /customers/{id}` - Get specific customer with order history
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

### 📦 Orders
- `GET /orders` - Get all orders
  - Query params: `status`, `customerId`, `dateFrom`, `dateTo`
- `POST /orders` - Create new order
  - Body: `{ customerId, items: [{ productId, quantity }], tax?, shipping?, ... }`

### 🏭 Equipment
- `GET /equipment` - Get all equipment
  - Query params: `type`, `status`
- `POST /equipment` - Create new equipment

### 📊 Inventory
- `GET /inventory` - Get inventory logs
  - Query params: `productId`, `type`, `limit`
- `POST /inventory` - Create inventory movement
  - Body: `{ productId, quantity, type: "in|out|adjustment|waste|harvest", reason?, reference? }`

### 👤 Users
- `GET /users` - Get all users
  - Query params: `role`, `status`
- `POST /users` - Create new user

### 📈 Dashboard
- `GET /dashboard` - Get dashboard statistics

### 📊 Analytics
- `GET /analytics?report=sales` - Sales report
- `GET /analytics?report=products` - Product analysis
- `GET /analytics?report=customers` - Customer analysis
- `GET /analytics?report=inventory` - Inventory report
- `GET /analytics?report=operations` - Operations report
  - Query params: `startDate`, `endDate` (for sales report)

## Data Models

### Product
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "pepper|herb|spice|vegetable",
  "variety": "string",
  "origin": "string",
  "price": "number",
  "unit": "string",
  "stock": "number",
  "minStock": "number",
  "maxStock": "number",
  "status": "active|inactive|out_of_stock",
  "image": "string",
  "tags": "JSON string",
  "nutritionInfo": "JSON string",
  "growingInfo": "JSON string",
  "harvestDate": "date",
  "expiryDate": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Field
```json
{
  "id": "string",
  "name": "string",
  "size": "string",
  "location": "string",
  "soilType": "string",
  "soilPh": "number",
  "status": "active|fallow|maintenance",
  "crop": "string",
  "plantingDate": "date",
  "expectedHarvest": "date",
  "progress": "number (0-100)",
  "temperature": "string",
  "humidity": "string",
  "notes": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Customer
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "customerType": "individual|business|restaurant",
  "status": "active|inactive|suspended",
  "leadScore": "number (0-100)",
  "notes": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Order
```json
{
  "id": "string",
  "orderNumber": "string",
  "customerId": "string",
  "status": "pending|confirmed|processing|shipped|delivered|cancelled",
  "total": "number",
  "subtotal": "number",
  "tax": "number",
  "shipping": "number",
  "paymentStatus": "pending|paid|failed|refunded",
  "paymentMethod": "string",
  "shippingAddress": "string",
  "orderDate": "date",
  "shippedDate": "date",
  "deliveredDate": "date",
  "notes": "string"
}
```

## Example Usage

### Create a Product
```javascript
fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Carolina Reaper',
    description: 'Hottest pepper in the world',
    category: 'pepper',
    variety: 'Carolina Reaper',
    origin: 'American',
    price: 29.99,
    unit: 'per lb',
    stock: 25,
    minStock: 5,
    maxStock: 100
  })
})
```

### Create an Order
```javascript
fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: 'customer-id',
    items: [
      { productId: 'product-id-1', quantity: 2 },
      { productId: 'product-id-2', quantity: 1 }
    ],
    tax: 5.50,
    shipping: 10.00,
    shippingAddress: '123 Main St, City, State'
  })
})
```

### Update Stock
```javascript
fetch('/api/products/product-id/stock', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quantity: 50,
    type: 'in',
    reason: 'Fresh harvest',
    reference: 'HARVEST-2024-001'
  })
})
```

## Error Responses
All endpoints return standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```
