// =====================
// USER TYPES
// =====================

export interface Membership {
  orgId: string;
  orgName?: string;
  role: string;
  permissions: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // encrypted
  memberships: Membership[];
  status?: "active" | "pending"; // optional for user status
  isSuperAdmin?: boolean; // optional for super admin users,
  role?: string; // optional for role display
    orgId?: string;
}

export interface SuperAdmin{
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password:string,
    isSuperAdmin: boolean,
    memberships:Membership[]
  }


  export  type CombinedUser =
    | {
        email: string;
        orgId?: string;
        role?: string;
        id: string;
        firstName: string;
        lastName: string;
        password: string;
        memberships: Membership[];
        status?: "active" | "pending"; // optional for user status
      }
    | {
        email: string;
        role: string;
        status: string;
     
      };

// =====================
// ROLE TYPES
// =====================

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// =====================
// ORGANIZATION TYPES
// =====================

export interface Organization {
  id: string;
  name: string;
  address: string;
  admins?: string[]; // list of admin user emails
}

// =====================
// TEAM TYPES
// =====================

export interface Team {
  id: string;
  name: string;
  members: string[]; // array of user emails
  orgId?: string;
}

// =====================
// INVITE TYPES
// =====================

export interface UserInvite {
  email: string;
  orgId: string;
  role?: string; // optional role for the invite
}

// =====================
// AUTH TYPES
// =====================

export interface AuthState {
  currentUser: User | null;
  activeOrg: Membership | null;
  setCurrentUser: (user: User | null) => void;
  setActiveOrg: (org: Membership | null) => void;
  logout: () => void;
}

// =====================
// PERMISSION TYPES
// =====================

export type Permission =
  | "view_users"
  | "manage_users"
  | "view_teams"
  | "manage_teams"
  | "view_organizations"
  | "manage_organizations"
  | "view_roles"
  | "manage_roles"
  | "view_audit_trail";

// =====================
// AUDIT LOG TYPES
// =====================

export interface LogEntry {
  actor: string; // email or name
  action: string; // e.g., "created user"
  target: string; // e.g., email or entity name
  timestamp: string;
  orgId: string;
  orgName?: string; // optional for global logs
}

// =====================
// SUPER ADMIN TYPES
// =====================

export interface SuperAdminState {
  user: User | null;
  setUser: (user: User | null) => void;
}


