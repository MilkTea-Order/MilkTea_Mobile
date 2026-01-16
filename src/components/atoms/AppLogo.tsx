import { useTheme } from "@/shared/hooks/useTheme";
import React from "react";
import { Text, View } from "react-native";
import Logo from "~/assets/images/logo.svg";
interface AppLogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

const sizeMap = {
  small: { icon: 32, text: 16, container: 16 },
  medium: { icon: 48, text: 20, container: 20 },
  large: { icon: 80, text: 28, container: 24 },
};

export function AppLogo({ size = "medium", showText = true }: AppLogoProps) {
  const { colors } = useTheme();
  const sizes = sizeMap[size];
  const logoSize = sizes.icon + 35;

  return (
    <View className="items-center">
      <View
        className="rounded-full mb-3 items-center justify-center"
        style={{
          width: logoSize,
          height: logoSize,
          backgroundColor: `${colors.primary}12`,
        }}
      >
        <Logo width={logoSize} height={logoSize} />
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
