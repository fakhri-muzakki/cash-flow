// components/LogoutButton.tsx
"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";

export function LogoutButton() {
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth(); // Hapus token & user dari store (dan localStorage)
    toast.success("Logout berhasil");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="gap-2 bg-destructive text-red-50 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
