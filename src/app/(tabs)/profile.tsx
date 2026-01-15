import { ThemeSelector } from "@/components/molecules/ThemeSelector";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useTheme } from "@/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { colors, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to top when tab is focused
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: "person-outline",
      label: "Thông tin cá nhân",
      onPress: () => Alert.alert("Thông tin", "Tính năng đang phát triển"),
    },
    {
      icon: "notifications-outline",
      label: "Thông báo",
      onPress: () => Alert.alert("Thông báo", "Tính năng đang phát triển"),
    },
    {
      icon: "help-circle-outline",
      label: "Trợ giúp",
      onPress: () => Alert.alert("Trợ giúp", "Tính năng đang phát triển"),
    },
    {
      icon: "information-circle-outline",
      label: "Về ứng dụng",
      onPress: () =>
        Alert.alert(
          "Về ứng dụng",
          "Milk Tea Shop\nVersion 1.0.0\n\nỨng dụng quản lý đơn hàng quán trà sữa"
        ),
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={gradients.header as any}
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute bg-white/20 rounded-full p-2"
          style={{
            top: insets.top + 16,
            left: 20,
            zIndex: 10,
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold text-center mt-2">
          Hồ sơ
        </Text>
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEventThrottle={16}
        bounces={true}
        showsVerticalScrollIndicator={true}
      >
        {/* Profile Card - Separated from header */}
        <View className="px-6 mt-8">
          <View
            className="rounded-3xl p-6"
            style={{
              backgroundColor: colors.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View className="items-center mb-6">
              <View
                className="rounded-full p-1 mb-4"
                style={{
                  backgroundColor: `${colors.primary}15`,
                }}
              >
                <LinearGradient
                  colors={gradients.header as any}
                  className="rounded-full p-3"
                >
                  <Ionicons name="person" size={64} color="white" />
                </LinearGradient>
              </View>
              <Text
                className="text-2xl font-bold mb-1"
                style={{ color: colors.text }}
              >
                {user?.name || "Nhân viên"}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                {user?.email || ""}
              </Text>
            </View>

            {/* Stats */}
            <View
              className="flex-row gap-4 pt-4"
              style={{ borderTopWidth: 1, borderTopColor: colors.border }}
            >
              <View className="flex-1 items-center">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  24
                </Text>
                <Text
                  className="text-xs mt-1"
                  style={{ color: colors.textSecondary }}
                >
                  Đơn hôm nay
                </Text>
              </View>
              <View
                className="w-px"
                style={{ backgroundColor: colors.border }}
              />
              <View className="flex-1 items-center">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  1.2M
                </Text>
                <Text
                  className="text-xs mt-1"
                  style={{ color: colors.textSecondary }}
                >
                  Doanh thu
                </Text>
              </View>
              <View
                className="w-px"
                style={{ backgroundColor: colors.border }}
              />
              <View className="flex-1 items-center">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  4.8
                </Text>
                <Text
                  className="text-xs mt-1"
                  style={{ color: colors.textSecondary }}
                >
                  Đánh giá
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Theme Settings */}
        <View className="px-6 mt-6">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: colors.text }}
          >
            Giao diện
          </Text>
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: colors.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ThemeSelector />
            <Text
              className="text-xs mt-3 text-center"
              style={{ color: colors.textSecondary }}
            >
              Chọn chế độ hiển thị phù hợp với bạn
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-6">
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                className="flex-row items-center px-4 py-4"
                style={{
                  borderBottomWidth: index !== menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
                activeOpacity={0.7}
              >
                <View
                  className="rounded-xl p-3 mr-4"
                  style={{
                    backgroundColor: `${colors.primary}12`,
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text
                  className="flex-1 font-medium"
                  style={{ color: colors.text }}
                >
                  {item.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-6 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="rounded-2xl p-4 items-center"
            style={{
              backgroundColor: colors.error,
              shadowColor: colors.error,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Đăng xuất
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
