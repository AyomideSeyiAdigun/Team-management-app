"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  requiredPermissions: string[];
};

export default function UserPermissionGuard({ children, requiredPermissions }: Props) {
  const { currentUser, activeOrg } = useAuthStore();
  const router = useRouter();

  const hasPermissions = currentUser?.memberships
    ?.find((m) => m.orgId === activeOrg?.orgId)
    ?.permissions || [];

  const isAllowed = requiredPermissions.every((perm) => hasPermissions.includes(perm));

  useEffect(() => {
    if (!isAllowed) {
      router.push("/organization"); // or dashboard
    }
  });

  if (!isAllowed) return null;

  return <>{children}</>;
}
