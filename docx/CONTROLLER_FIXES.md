# Controller fixes

This document summarizes the controller issues reviewed and the changes made.

## Order creation

- **Reported problem:** Sending `POST http://localhost:3000/orders` returned `Order.create is not a function`.
- **Fix:** Order creation now constructs an `Order` document and saves it with `order.save()` instead of calling the static `Order.create()` method.
- **File:** `src/controllers/order.controllers.js`

## Product creation

- **Problem found during review:** Product creation also relied on the static `Product.create()` method.
- **Fix:** Product creation now constructs a `Product` document and saves it with `product.save()`, matching the instance-save flow used for orders and categories.
- **File:** `src/controllers/product.controllers.js`

## Update validation

- **Problem found during review:** Update handlers did not request Mongoose schema validation when updating existing documents.
- **Fix:** Product, order, and category update handlers now pass `runValidators: true` to `findByIdAndUpdate`, alongside `new: true`.
- **Files:** `src/controllers/product.controllers.js`, `src/controllers/order.controllers.js`, and `src/controllers/category.controllers.js`

## Route check

Confirmed the active routers register these methods:

| Resource | GET collection | GET one | POST | PUT one | DELETE one |
| --- | --- | --- | --- | --- | --- |
| Products | `/products` | `/products/:id` | `/products` | `/products/:id` | `/products/:id` |
| Orders | `/orders` | `/orders/:id` | `/orders` | `/orders/:id` | `/orders/:id` |
| Categories | `/categories` | `/categories/:id` | `/categories` | `/categories/:id` | `/categories/:id` |

## Verification notes

- JavaScript syntax checks passed for all three active controllers.
- Route registration checks confirmed the methods and paths listed above.
- Database-backed Postman requests were not run as part of this review. Restart the server after applying the changes so it loads the updated controller files.
