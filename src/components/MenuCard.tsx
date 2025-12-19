import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  delay?: number;
}

const MenuCard = ({ title, description, icon, onClick, delay = 0 }: MenuCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full p-6 rounded-lg bg-card border border-border",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:border-primary/30",
        "text-left animate-slide-up"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default MenuCard;
