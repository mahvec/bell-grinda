import type { ReactNode } from "react";
import { Barbell } from "@phosphor-icons/react/Barbell";
import { BookOpen } from "@phosphor-icons/react/BookOpen";
import { House } from "@phosphor-icons/react/House";
import { UserCircle } from "@phosphor-icons/react/UserCircle";
import { NavLink } from "react-router-dom";

const navigation = [
  { to: "/", label: "Train", icon: House },
  { to: "/exercises", label: "Exercises", icon: BookOpen },
  { to: "/history", label: "Activity", icon: Barbell },
  { to: "/profile", label: "You", icon: UserCircle }
];

export function AppShell({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="BellGrinda home">
          <img className="brand-mark" src="/icon.svg" alt="" width="38" height="38" />
          <span>bellgrinda<span className="brand-dot">.</span></span>
        </NavLink>
        {action}
      </header>
      <main className="page" id="main-content">{children}</main>
      <nav className="bottom-nav" aria-label="Primary navigation">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <Icon size={22} weight="bold" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
