# Flowdash Workwise

Flowdash Workwise is a **role-based enterprise workflow and dashboard platform** designed to streamline operations across different organizational roles such as **Admin, Operator, Project Manager, and Manager**. The system focuses on secure authentication, modular dashboards, document handling, real-time status tracking, and a clean, modern UI.

---

## 🚀 Project Overview

Modern organizations often rely on multiple disconnected tools for task tracking, document management, and internal communication. **Flowdash Workwise** solves this by providing a **single unified platform** where users can log in based on their role and access features tailored specifically to their responsibilities.

The project emphasizes:

* Role-based access control
* Scalable dashboard architecture
* Clean and consistent UI/UX
* Secure backend integration

---

## 👥 User Roles & Dashboards

### 🔑 Admin Dashboard

* Create and manage user accounts (Operators, Managers, Project Managers)
* Assign roles and permissions
* Monitor overall system activity
* View organization-level analytics

### 🧑‍💻 Operator Dashboard

* View assigned tasks and workflow status
* Upload and manage documents
* Track task progress (Pending / In Progress / Completed)
* Profile management with avatar updates

### 📊 Project Manager Dashboard

* Oversee multiple projects
* Assign tasks to operators
* Track project milestones and deadlines
* Review submitted documents

### 🧭 Manager Dashboard

* Monitor team performance
* View summarized reports and dashboards
* Approve or review task outputs
* High-level visibility without operational overload

---

## ✨ Key Features

* 🔐 **Role-Based Authentication** – Users are redirected to dashboards based on their assigned role
* 📁 **Document Management** – Upload, preview, and download files (PDF, images, ZIP)
* 📊 **Dashboard Analytics** – Status cards, progress indicators, and timelines
* 💬 **Scalable Architecture** – Designed to support future features like chat, notifications, and reports
* 🎨 **Modern UI/UX** – Clean, responsive, and consistent design across all dashboards
* 🧩 **Modular Codebase** – Easy to maintain and extend

---

## 🛠️ Technology Stack

### Frontend

* **React.js**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui** components
* **Lucide Icons**

### Backend / Services

* **Supabase**

  * Authentication
  * PostgreSQL Database
  * Role-based user management

### Tools

* Git & GitHub
* Postman (API testing)
* VS Code

---

## 🏗️ System Architecture (High Level)

1. **Client Layer (Frontend)**

   * Role-based dashboards
   * Secure routing
   * API interaction

2. **Authentication Layer**

   * Supabase Auth
   * Session and role validation

3. **Backend Layer**

   * PostgreSQL database
   * Row Level Security (RLS)
   * Secure data access per role

---

## 🔄 Application Flow

1. User logs in using email and password
2. System validates credentials via Supabase
3. User role is fetched from the database
4. User is automatically redirected to the corresponding dashboard
5. Dashboard features are rendered based on permissions

---

## 📂 Project Structure (Simplified)

```
flowdash-workwise/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── dashboards/        # Role-based dashboards
│   │   ├── admin/
│   │   ├── operator/
│   │   ├── manager/
│   │   └── projectManager/
│   ├── auth/              # Authentication & role handling
│   ├── lib/               # Supabase and utilities
│   └── pages/
│
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/flowdash-workwise.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

---

## 🔐 Security Considerations

* Role-based routing prevents unauthorized dashboard access
* Supabase Row Level Security (RLS) ensures data isolation
* Sensitive logic handled server-side

---

## 📈 Future Enhancements

* Real-time notifications
* Internal chat and messaging system
* Advanced analytics and reports
* File versioning and audit logs
* Organization-wide announcements

---

## 🧪 Testing

* Manual testing using different user roles
* API testing with Postman
* UI testing across screen sizes

---

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Submit a pull request

---

## 📄 License

This project is created for **educational and internship purposes**.

---

## 🙌 Acknowledgements

* Supabase Documentation
* shadcn/ui
* Tailwind CSS
* Open-source community

---

**Flowdash Workwise** – A unified, role-driven workflow management solution 🚀
