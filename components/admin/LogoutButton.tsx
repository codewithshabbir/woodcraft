import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // future: clear token / redux / cookies
      // router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <Link href="" className="flex items-center gap-2 cursor-pointer">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Link>
    </DropdownMenuItem>
  );
};

export default LogoutButton;