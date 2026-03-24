import { Home, Calendar, User, Settings, ShieldAlert, Compass, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";

export function MobileNav({ role }: { role: "client" | "owner" | "admin" }) {
  const location = useLocation();

  const links = {
    client: [
      { to: "/", icon: Compass, label: "اكتشف" },
      { to: "/bookings", icon: Calendar, label: "حجوزاتي" },
      { to: "/profile", icon: User, label: "حسابي" },
    ],
    owner: [
      { to: "/owner", icon: Sparkles, label: "الرئيسية" },
      { to: "/owner/bookings", icon: Calendar, label: "المواعيد" },
      { to: "/owner/settings", icon: Settings, label: "الإعدادات" },
    ],
    admin: [
      { to: "/admin", icon: ShieldAlert, label: "اللوحة" },
      { to: "/admin/users", icon: User, label: "الأعضاء" },
      { to: "/admin/services", icon: Sparkles, label: "الخدمات" },
    ]
  };

  const currentLinks = links[role];

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50">
      <div className="glass-panel rounded-full px-6 py-3 flex justify-between items-center shadow-2xl shadow-purple-900/20">
        {currentLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all relative px-4 py-1",
                isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-full -z-10"></div>
              )}
              <Icon className={cn("w-6 h-6 transition-transform", isActive && "scale-110 text-purple-400")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px] font-bold", isActive && "text-purple-300")}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
