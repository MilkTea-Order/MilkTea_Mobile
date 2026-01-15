import { useAuthStore } from "@/features/auth/store/authStore";
import { useTheme } from "@/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed";
  time: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    items: ["Trà sữa truyền thống", "Trà sữa matcha"],
    total: 85000,
    status: "pending",
    time: "10:30",
  },
  {
    id: "2",
    customerName: "Trần Thị B",
    items: ["Trà sữa thái xanh", "Trân châu đen"],
    total: 65000,
    status: "preparing",
    time: "10:25",
  },
  {
    id: "3",
    customerName: "Lê Văn C",
    items: ["Trà sữa oolong", "Kem cheese"],
    total: 95000,
    status: "ready",
    time: "10:15",
  },
  {
    id: "4",
    customerName: "Phạm Thị D",
    items: ["Trà sữa đào", "Thạch dừa"],
    total: 75000,
    status: "completed",
    time: "10:00",
  },
];

const statusLabels = {
  pending: "Chờ xử lý",
  preparing: "Đang pha chế",
  ready: "Sẵn sàng",
  completed: "Hoàn thành",
};

const statusIcons = {
  pending: "time-outline",
  preparing: "cafe-outline",
  ready: "checkmark-circle-outline",
  completed: "checkmark-done-circle-outline",
};

export default function HomeScreen() {
  const [orders] = useState<Order[]>(mockOrders);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { colors, gradients, status } = useTheme();
  const insets = useSafeAreaInsets();
  const isDarkMode = colors.background === "#0F172A";
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to top when tab is focused
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getStatusCount = (statusType: Order["status"]) => {
    return orders.filter((order) => order.status === statusType).length;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-white text-sm opacity-90 mb-1">
              Xin chào,
            </Text>
            <Text className="text-white text-3xl font-bold">
              {user?.name || "Nhân viên"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            className="bg-white/20 rounded-full p-3"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards - Redesigned */}
        <View className="flex-row gap-3">
          {(["pending", "preparing", "ready"] as const).map((statusType) => {
            const count = getStatusCount(statusType);
            return (
              <View
                key={statusType}
                className="flex-1 rounded-2xl p-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons
                    name={statusIcons[statusType] as any}
                    size={20}
                    color="white"
                  />
                  <Text className="text-white/80 text-xs">
                    {statusLabels[statusType]}
                  </Text>
                </View>
                <Text className="text-white text-2xl font-bold">{count}</Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>

      {/* Orders List */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        scrollEventThrottle={16}
        bounces={true}
        showsVerticalScrollIndicator={true}
      >
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              Đơn hàng
            </Text>
            <Text
              className="text-sm mt-1"
              style={{ color: colors.textSecondary }}
            >
              {orders.length} đơn đang chờ xử lý
            </Text>
          </View>
        </View>

        {orders.map((order) => {
          const statusConfig = status[order.status];
          const statusTheme = isDarkMode
            ? statusConfig.dark
            : statusConfig.light;

          return (
            <TouchableOpacity
              key={order.id}
              className="rounded-3xl p-5 mb-4 border-2"
              style={{
                backgroundColor: colors.card,
                borderColor: statusTheme.border,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
              activeOpacity={0.9}
            >
              {/* Order Header */}
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                  <View className="flex-row items-center mb-3">
                    <View
                      className="rounded-2xl p-2 mr-3"
                      style={{
                        backgroundColor: `${statusConfig.icon}20`,
                      }}
                    >
                      <Ionicons
                        name={statusIcons[order.status] as any}
                        size={22}
                        color={statusConfig.icon}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-bold text-lg mb-1"
                        style={{ color: colors.text }}
                      >
                        {order.customerName}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        {order.time}
                      </Text>
                    </View>
                  </View>

                  {/* Order Items */}
                  <View className="ml-12">
                    {order.items.map((item, index) => (
                      <View key={index} className="flex-row items-center mb-2">
                        <View
                          className="w-1.5 h-1.5 rounded-full mr-2"
                          style={{ backgroundColor: colors.primary }}
                        />
                        <Text
                          className="text-sm flex-1"
                          style={{ color: colors.textSecondary }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Total Price */}
                <View className="items-end">
                  <Text
                    className="text-xl font-bold mb-1"
                    style={{ color: colors.text }}
                  >
                    {formatCurrency(order.total)}
                  </Text>
                </View>
              </View>

              {/* Order Footer */}
              <View
                className="flex-row items-center justify-between pt-4"
                style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                <View
                  className="px-4 py-2 rounded-full"
                  style={{ backgroundColor: statusTheme.badge }}
                >
                  <Text
                    className="text-xs font-bold"
                    style={{ color: statusTheme.text }}
                  >
                    {statusLabels[order.status]}
                  </Text>
                </View>
                {order.status !== "completed" && (
                  <TouchableOpacity
                    className="px-5 py-2.5 rounded-xl"
                    style={{ backgroundColor: colors.primary }}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-white text-sm font-bold mr-2">
                        Xử lý
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="white" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
