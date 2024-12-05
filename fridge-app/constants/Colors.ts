/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#2D302E", // General text color
    background: "#FFFFFF", // Background color (white)
    primary: "#A9DFA3", // Primary color for buttons and highlights
    secondary: "#5B795D", // Secondary color for less critical elements
    mutedText: "#919590", // Color for less important text
    divider: "#484A48", // Color for borders or dividers
    icon: "#2D302E", // Icon color
    tabIconDefault: "#484A48", // Default tab icon color
    tabIconSelected: "#A9DFA3", // Selected tab icon color
    tint: tintColorLight,
  },
  dark: {
    text: "#E0E0E0", // General text color
    background: "#1A1C1B", // Background color
    primary: "#A9DFA3", // Primary color for buttons and highlights
    secondary: "#5B795D", // Secondary color for less critical elements
    mutedText: "#919590", // Color for less important text
    divider: "#484A48", // Color for borders or dividers
    icon: "#9BA1A6", // Icon color
    tabIconDefault: "#9BA1A6", // Default tab icon color
    tabIconSelected: "#A9DFA3", // Selected tab icon color
    tint: tintColorDark,
  },
};
