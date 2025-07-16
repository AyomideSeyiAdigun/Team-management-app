"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  requiredPermissions: string[];
};

export default function UserPermissionGuard({ children, requiredPermissions }: Props) {
  const { currentUser, activeOrg } = useAuthStore();
  const router = useRouter();
   const [hasMounted, setHasMounted] = useState(false);



  const hasPermissions = currentUser?.memberships
    ?.find((m) => m.orgId === activeOrg?.orgId)
    ?.permissions || [];

  const isAllowed = requiredPermissions.every((perm) => hasPermissions.includes(perm));

  
  useEffect(() => {
    setHasMounted(true);
    if (!isAllowed) {
    router.push("/organization"); // or d
    }
  },[hasMounted,isAllowed,router]);

   
   if (!hasMounted) return null;

  if (!isAllowed) return null;

  return <>{children}</>;
}
