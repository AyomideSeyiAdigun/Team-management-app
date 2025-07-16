 

````markdown
# 🧑‍💼 Multi-Tenant Team Management Platform (Frontend Only)

This is a **frontend-only** multi-tenant **Team Management Platform** built with:

- ✅ Next.js (App Router)
- 🎨 Tailwind CSS (Dark theme supported)
- 🧠 Zustand (State management)
- 🗂 localStorage (as mock backend)
- 🔐 Fully dynamic roles & permissions per organization

---

## 🚀 Getting Started

Follow these steps to **run the app locally**:

### 1. Clone the repository

```bash
git clone https://github.com/AyomideSeyiAdigun/Team-management-app.git
cd team-management-app
````

### 2. Install dependencies

Ensure you have **Node.js ≥ 16.x** and **npm ≥ 8.x** installed.

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Then open your browser and visit:

```
http://localhost:3000
```

You will be redirected to the user login page by default.

---

## 🧪 Super Admin Access

To access the **Super Admin panel**, go to:

```
http://localhost:3000/admin/login
```

You can use this default login (created automatically on first load):

```json
{
   "email": "superadmin@app.com",
    "password": "password",
}
```

---

## 📁 Folder Structure

```
src/
│
├── app/                # App routes (Next.js App Router)
│   ├── login/          # User login
│   ├── signup/         # User sign-up
│   ├── create-workspace/
│   ├── select-organization/
│   ├── organization/  # Super normal user (dashboard, users, orgs)
│   ├── user
│   └── admin-panel/          # Super admin panel (dashboard, users, orgs)
│
├── components/         # Reusable UI (Navbar, Sidebar, Modals)
├── stores/             # Zustand stores (authStore, roleStore, auditStore, etc.)
├── utils/              #
└── libs/             # auth.tsx, permission.tsx
```

---

## 🧠 Features

* 🔐 **Frontend-only Auth** with encrypted passwords
* 🏢 **Multi-organization system** with dynamic role-permission control
* 👤 **User management** (invite, assign role, edit)
* 🛡 **Permission-based route & UI protection**
* 🧩 **Custom roles & permissions per org**
* 📜 **Audit logging** (create/edit/delete actions)
* 👥 **Teams management** (assign members, edit teams)
* 👨‍💼 **Super Admin Panel** with full org/user/team/audit access

---

## 📦 Example Permissions

| Permission             | Description                   |
| ---------------------- | ----------------------------- |
| `view_users`           | View users in an organization |
| `manage_users`         | Invite/edit/delete users      |
| `view_teams`           | View teams                    |
| `manage_teams`         | Create/edit/delete teams      |
| `view_roles`           | View roles                    |
| `manage_roles`         | Create/edit/delete roles      |
| `view_audit_trail`     | View audit log                |
| `manage_organizations` | Only for Super Admin          |

---

## 🗂 LocalStorage Keys

| Key                | Purpose                       |
| ------------------ | ----------------------------- |
| `users`            | All registered users          |
| `userInvites`      | Emails of invited users       |
| `roles_<orgId>`    | Role list for an organization |
| `teams_<orgId>`    | Team list for an organization |
| `audit_<orgId>`    | Audit logs per organization   |
| `auditLogs`        | Super Admin logs              |
| `organizations`    | List of all organizations     |
| `super_admin_user` | Super Admin data              |

---

## 💡 Tips

* You can sign up with any email to create a new organization.
* Invited users will skip workspace setup and be added to the org that invited them.
* Super Admin can:

  * Change org admins
  * Delete organizations
  * See all audit logs

---
 
 

## 📄 License

MIT © 2025 Ayomide Adigun

```

---

Let me know if you’d like:
- A PDF version
- Sample screenshots
- Vercel deployment setup
```
