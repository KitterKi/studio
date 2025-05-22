
import { Wand2, Users, Heart, UserCircle, LogIn, Home, Settings } from 'lucide-react'; // Added Settings

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

export const APP_NAME = "RoomStyle";

export const AUTH_SIGNIN_PATH = "/auth/signin";
export const AUTH_SIGNUP_PATH = "/auth/signup";

export const SIDEBAR_NAV_ITEMS_AUTHENTICATED = [
  { href: "/", label: "Rediseñar Habitación", icon: Wand2 },
  { href: "/community", label: "Comunidad", icon: Users },
  { href: "/favorites", label: "Mis Favoritos", icon: Heart },
  { href: "/profile", label: "Mi Perfil", icon: UserCircle },
  { href: "/settings", label: "Configuración", icon: Settings }, // Added Settings
];

export const SIDEBAR_NAV_ITEMS_UNAUTHENTICATED = [
  { href: "/", label: "Rediseñar Habitación", icon: Wand2 },
  { href: "/community", label: "Comunidad", icon: Users },
  { href: AUTH_SIGNIN_PATH, label: "Iniciar Sesión", icon: LogIn },
];
