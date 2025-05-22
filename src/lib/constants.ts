
import { Wand2, Users, Heart, UserCircle, LogIn, Home } from 'lucide-react';

export const DESIGN_STYLES = [
  "Modern",
  "Rustic",
  "Minimalist",
  "Bohemian",
  "Industrial",
  "Coastal",
  "Scandinavian",
  "Mid-Century Modern",
  "Farmhouse",
  "Art Deco",
  "Japandi",
  "Maximalist"
];

export const APP_NAME = "StyleMyRoom";

export const AUTH_SIGNIN_PATH = "/auth/signin";
export const AUTH_SIGNUP_PATH = "/auth/signup";

export const SIDEBAR_NAV_ITEMS_AUTHENTICATED = [
  { href: "/", label: "Redesign Room", icon: Wand2 },
  { href: "/community", label: "Community", icon: Users },
  { href: "/favorites", label: "My Favorites", icon: Heart },
  { href: "/profile", label: "My Profile", icon: UserCircle },
];

export const SIDEBAR_NAV_ITEMS_UNAUTHENTICATED = [
  { href: "/", label: "Redesign Room", icon: Wand2 },
  { href: "/community", label: "Community", icon: Users },
  { href: AUTH_SIGNIN_PATH, label: "Sign In", icon: LogIn },
];

// For AppHeader, if NavLink was used, it's now mostly in Sidebar.
// AppHeader will handle auth buttons or UserNav.
