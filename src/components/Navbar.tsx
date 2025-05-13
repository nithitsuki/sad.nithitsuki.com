import { ThemeButton } from "@/components/ui/ThemeButton";
import { ReactNode } from "react";

interface NavbarProps {
    children?: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
    return(
        <div className="w-full h-[48px] bg-white/30 dark:bg-black/30 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50  top-0 left-0 z-50">

            {children}

            <div className="absolute top-0 right-3 m-[6px]">
            <ThemeButton></ThemeButton>
            </div>
        </div>
    );
}

export default Navbar;