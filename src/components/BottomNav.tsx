import { NavLink } from "react-router-dom";
import { Target, Calendar, BookOpen, Dumbbell, Moon, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Target, label: "Maqsadlar" },
  { path: "/darslar", icon: Calendar, label: "Darslar" },
  { path: "/ingliz-tili", icon: BookOpen, label: "Ingliz tili" },
  { path: "/sport", icon: Dumbbell, label: "Sport" },
  { path: "/namoz", icon: Moon, label: "Namoz" },
  { path: "/profil", icon: User, label: "Profil" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-strong z-50">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-smooth ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
