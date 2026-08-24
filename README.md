# 🛠️ Vue 3 Admin Panel (E-commerce)

A modern, scalable **Admin Dashboard** built with Vue 3 to manage an e-commerce backend powered by Laravel.

Designed with clean architecture, reusable components, and a maintainable structure.

---

## 🚀 Features

### 🔐 Authentication
- Admin login
- Token-based authentication (Laravel Sanctum)
- Protected routes
- Auto logout on 401
- Persistent login via local storage

---

### 📊 Dashboard
- Total users
- Total products
- Total categories
- Total orders
- Total revenue
- Low stock products
- Recent orders
- Top selling products

---

### 📂 Category Management
- List categories
- Create category
- Edit category
- Delete category
- Pagination support

---

### 🛍️ Product Management
- Full CRUD operations
- Featured image upload
- Multiple gallery images
- Replace gallery support
- Stock management
- Sale price support
- Pagination

---

### 📦 Order Management
- List orders
- View full order details
- Shipping & billing info
- Order items breakdown
- Update order status
- Update payment status

---

### 🧱 CMS (Content Management)

#### 🎯 Banners
- Create / Edit / Delete banners
- Image upload
- Sort order
- Active toggle

#### 🧾 Content Blocks
- Dynamic content system
- JSON meta support
- Image upload
- Used for homepage sections, etc.

---

## 🧠 Tech Stack

- **Vue 3** (Composition API)
- **Vite**
- **Vue Router**
- **Pinia**
- **Axios**
- **Tailwind CSS**

---

## 📁 Project Structure

```text
src/
├── api/                  # API services (Axios)
├── stores/               # Pinia stores
├── views/                # Pages
├── components/
│   ├── ui/               # Reusable UI components
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   ├── banners/
│   └── content-blocks/
├── layouts/              # Admin & Auth layouts
├── composables/          # Reusable logic (notify, confirm, errors)
├── utils/                # Helpers & form-data builders
├── router/               # Route definitions
└── assets/
```

🤝 Contribution

Feel free to fork and extend the project.

📄 License

This project is open-source and available under the MIT License.
