import { useTheme } from "@/shared/hooks/useTheme";
import React from "react";
import { Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

interface AppLogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

const sizeMap = {
  small: { icon: 32, text: 16, container: 16 },
  medium: { icon: 48, text: 20, container: 20 },
  large: { icon: 80, text: 28, container: 24 },
};

// Modern SVG Logo with Orange/Amber theme
const logoSvg = `
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Cup base shadow -->
  <ellipse cx="60" cy="100" rx="35" ry="8" fill="#EA580C" opacity="0.3"/>
  
  <!-- Cup body - modern rounded design -->
  <path d="M35 35C35 28 40 23 47 23H73C80 23 85 28 85 35V75C85 82 80 87 73 87H47C40 87 35 82 35 75V35Z" fill="url(#gradient1)"/>
  
  <!-- Cup rim -->
  <path d="M40 35H80" stroke="#EA580C" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Handle - modern curved design -->
  <path d="M85 50C90 48 96 50 98 55C100 60 98 66 93 68C88 70 82 68 80 63C78 58 80 52 85 50Z" fill="url(#gradient2)"/>
  
  <!-- Tea/Liquid with gradient -->
  <path d="M40 40C40 37 42 35 45 35H75C78 35 80 37 80 40V70C80 73 78 75 75 75H45C42 75 40 73 40 70V40Z" fill="url(#gradient3)"/>
  
  <!-- Pearl bubbles (tapioca) -->
  <circle cx="50" cy="55" r="4" fill="#1C1917" opacity="0.8"/>
  <circle cx="60" cy="60" r="3.5" fill="#1C1917" opacity="0.8"/>
  <circle cx="70" cy="55" r="3" fill="#1C1917" opacity="0.8"/>
  <circle cx="55" cy="65" r="3.5" fill="#1C1917" opacity="0.8"/>
  <circle cx="65" cy="68" r="3" fill="#1C1917" opacity="0.8"/>
  <circle cx="50" cy="70" r="2.5" fill="#1C1917" opacity="0.8"/>
  
  <!-- Straw -->
  <rect x="75" y="25" width="4" height="30" rx="2" fill="#FB923C" transform="rotate(15 77 40)"/>
  
  <!-- Steam - elegant curves -->
  <path d="M50 23C48 15 52 10 50 5" stroke="#A8A29E" stroke-width="2.5" stroke-linecap="round" opacity="0.5" fill="none"/>
  <path d="M60 23C60 15 64 10 62 5" stroke="#A8A29E" stroke-width="2.5" stroke-linecap="round" opacity="0.5" fill="none"/>
  <path d="M70 23C72 15 68 10 70 5" stroke="#A8A29E" stroke-width="2.5" stroke-linecap="round" opacity="0.5" fill="none"/>
  
  <!-- Highlights on cup -->
  <ellipse cx="55" cy="45" rx="8" ry="15" fill="#FB923C" opacity="0.3"/>
  
  <!-- Gradients -->
  <defs>
    <linearGradient id="gradient1" x1="35" y1="35" x2="85" y2="87" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <linearGradient id="gradient2" x1="80" y1="50" x2="100" y2="68" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="100%" stop-color="#F97316"/>
    </linearGradient>
    <linearGradient id="gradient3" x1="40" y1="40" x2="80" y2="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="50%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
  </defs>
</svg>
`;

export function AppLogo({ size = "medium", showText = true }: AppLogoProps) {
  const { colors } = useTheme();
  const sizes = sizeMap[size];
  const logoSize = sizes.icon + 20;

  return (
    <View className="items-center">
      <View
        className="rounded-full mb-3 items-center justify-center"
        style={{
          width: logoSize + 15,
          height: logoSize + 15,
          backgroundColor: `${colors.primary}12`,
        }}
      >
        <SvgXml xml={logoSvg} width={logoSize} height={logoSize} />
      </View>

      {showText && (
        <>
          <Text
            className="font-bold mb-2"
            style={{
              fontSize: sizes.text + 4,
              color: colors.text,
              letterSpacing: 0.5,
            }}
          >
            Milk Tea Shop
          </Text>
          <Text
            className="text-sm"
            style={{
              fontSize: sizes.text - 6,
              color: colors.textSecondary,
            }}
          >
            Quản lý & Order
          </Text>
        </>
      )}
    </View>
  );
}
