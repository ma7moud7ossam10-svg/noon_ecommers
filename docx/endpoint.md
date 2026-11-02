# API endpoints

All endpoints are prefixed with `/api` and accept/return JSON. Start the server
with `npm run dev` or `npm start`; it listens on port `3000` by default.

## Products

| Method | Path | Description |
| --- | --- | --- |
| GET | `/products` | List products |
| GET | `/products/:id` | Get one product |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Update product fields |
| DELETE | `/products/:id` | Delete a product |

Product fields: `name`, `description`, `price`, `stock`, and `category`.
Prices and stock must be non-negative; stock must be a whole number.

Example product body:

```json
{
  "name": "Desk lamp",
  "description": "Adjustable LED lamp",
  "price": 24.99,
  "stock": 20,
  "category": "Lighting"
}
```

## Orders

| Method | Path | Description |
| --- | --- | --- |
| GET | `/orders` | List orders |
| GET | `/orders/:id` | Get one order |
| POST | `/orders` | Create an order |
| PUT | `/orders/:id` | Update customer details, items, or status |
| DELETE | `/orders/:id` | Delete an order |

Customer name and email are stored on the order because this project does not
include a user/account model. Item prices and `totalAmount` are calculated by
the API from the current product prices; client-supplied prices and totals are
not accepted. Updating order items refreshes their price snapshots.

Example order body:

```json
{
  "customer": {
    "name": "Avery Smith",
    "email": "avery@example.com"
  },
  "items": [
    {
      "product": "665000000000000000000001",
      "quantity": 2
    }
  ]
}
```

Allowed statuses are `pending`, `completed`, and `cancelled`. Invalid input
returns `400`, missing resources return `404`, and successful creation returns
`201`. Deletion returns `200` with a confirmation message.

## Authentication

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create an account and return a token |
| POST | `/auth/login` | Sign in and return a token |
| GET | `/auth/profile` | Get the authenticated user's profile |

Send the returned token in the `Authorization: Bearer <token>` header when
using authenticated endpoints.

## Cart

All cart endpoints require authentication.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/cart` | Get the authenticated user's cart |
| POST | `/api/cart` | Add a product to the cart |
| POST | `/api/cart/items` | Add a product to the cart |
| PUT | `/api/cart/items/:productId` | Set a cart item's quantity |
| DELETE | `/api/cart/items/:productId` | Remove a product from the cart |
| DELETE | `/api/cart` | Clear the cart |

Cart endpoints are also available without the `/api` prefix for compatibility.

Add a product with a `productId` and optional positive integer `quantity`:

```json
{
  "productId": "665000000000000000000001",
  "quantity": 2
}
```

Registration accepts `email` and `password` (at least 8 characters); `name` is
optional. Send the returned token as `Authorization: Bearer <token>` when using
the wishlist endpoints and `GET /auth/profile`.

## Configuration

Set `MONGODB_URI` or `MONGO_URL` in `.env` before starting the server. If both
are set, `MONGODB_URI` takes precedence. `PORT` is optional and defaults to
`3000`.
