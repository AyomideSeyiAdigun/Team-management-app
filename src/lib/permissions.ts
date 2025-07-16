
export const DEFAULT_ADMIN_PERMISSIONS = [
  "view_users",
  "manage_users",
  "view_teams",
  "manage_teams",
  "view_roles",
  "manage_roles",
  "view_audit_trail"
];


/**
 * Check if a user has a specific permission in a given organization.
 * 
 * @param user - The current user object
 * @param permission - The permission string to check (e.g., "view_users")
 * @param orgId - The organization ID to check in (optional if user has activeOrg)
 */
// export function hasPermission(user: User, permission: string, orgId?: string): boolean {
//   if (!user || !permission) return false;

//   // Find the matching membership
//   const membership = user.memberships?.find((m: Membership) => {
//     return orgId ? m.orgId === orgId : m.orgId === user.activeOrg?.orgId;
//   });

//   return membership?.permissions?.includes(permission) || false;
// }
