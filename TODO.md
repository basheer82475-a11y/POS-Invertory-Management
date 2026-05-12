# TODO - Admin Dashboard Improvements (Dynamic Metrics + Charts)

## Backend
- [ ] Create `pos-backend/src/routes/adminRoutes.js` with protected analytics endpoints
  - [ ] `GET /api/admin/metrics?lowStockThreshold=10`
  - [ ] `GET /api/admin/sales-chart?rangeDays=30`
  - [ ] `GET /api/admin/top-products?limit=5`
- [x] Create `pos-backend/src/routes/adminRoutes.js` with protected analytics endpoints
- [x] Create `pos-backend/src/controllers/adminController.js` implementing the above using `Order` + `Product`
- [x] Mount admin routes in `pos-backend/src/app.js` under `/api/admin`
- [x] Created TODO tracking file



## Frontend
- [x] Update `pos-frontend/src/pages/dashboard.jsx`
  - [x] Replace localStorage-based metrics with API calls
  - [x] Render recent orders table using backend order data
  - [x] Add charts (Recharts) for revenue/orders by day
  - [x] Add top-selling products section


## Integration / Testing
- [ ] Ensure RBAC allows access for the correct roles (admin only vs admin+manager)
- [ ] Verify dashboard renders without console errors (charts removed fallback)

- [ ] Verify endpoints work with auth token

