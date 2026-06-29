// Partlyra Utility Shelf theme.
// Calm home-workshop / parts cabinet palette.

export const COLORS = {
  background: "#F1F0EC", // warm light gray
  surface: "#FFFFFF",
  drawer: "#E9E3D7", // pale beige drawer card
  drawerAlt: "#EFEAE0",
  text: "#2B2F33", // deep charcoal
  textSoft: "#5C6670",
  textFaint: "#8A929A",
  header: "#4A5C6A", // muted steel blue
  headerDark: "#3A4955",
  divider: "#CBD2D8", // light slate
  teal: "#3E8E84", // in-stock accent
  tealSoft: "#DCEDE9",
  amber: "#D49A2A", // low-stock accent
  amberSoft: "#F6EACD",
  red: "#B4503F", // out-of-stock accent
  redSoft: "#F1DAD4",
  chip: "#E2E6EA",
  chipActive: "#4A5C6A",
  white: "#FFFFFF",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
};

// Navigation theme extended from the library DefaultTheme so that
// theme.fonts is always present (prevents "theme.fonts.regular is undefined").
import { DefaultTheme } from "@react-navigation/native";

export const NavTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.header,
    background: COLORS.background,
    card: COLORS.header,
    text: COLORS.white,
    border: COLORS.divider,
    notification: COLORS.amber,
  },
  fonts: DefaultTheme.fonts,
};
