import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import * as notificationService from "../../services/notificationService";
import { BackendNotification } from "../../services/notificationService";
import { Colors } from "../../theme/colors";

const TYPE_STYLE: Record<
  BackendNotification["type"],
  { icon: string; color: string; label: string }
> = {
  busArrival: { icon: "bus", color: "#3B82F6", label: "Arrival" },
  chat: { icon: "chatbubble", color: "#10B981", label: "Chat" },
  system: { icon: "warning", color: "#EF4444", label: "System" },
  general: { icon: "information-circle", color: "#F59E0B", label: "Info" },
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<BackendNotification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { items } = await notificationService.getMyNotifications();
      setAlerts(items);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const unread = alerts.filter((a) => !a.isRead).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <PageHeader title="Alerts" subtitle="Notifications & emergencies" />

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{unread}</Text>
            <Text style={styles.summaryLabel}>Unread</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{alerts.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Latest Alerts</Text>

        {loading && (
          <ActivityIndicator
            color={Colors.primary}
            style={{ marginBottom: 16 }}
          />
        )}

        {!loading && alerts.length === 0 && (
          <Text style={styles.empty}>No notifications yet.</Text>
        )}

        {alerts.map((item) => {
          const meta = TYPE_STYLE[item.type] ?? TYPE_STYLE.general;
          return (
            <TouchableOpacity
              key={item._id}
              style={styles.alertCard}
              onPress={() => {
                if (!item.isRead) {
                  notificationService
                    .markAsRead(item._id)
                    .catch(() => undefined);
                  setAlerts((prev) =>
                    prev.map((a) =>
                      a._id === item._id ? { ...a, isRead: true } : a,
                    ),
                  );
                }
              }}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: meta.color + "22" },
                ]}
              >
                <Ionicons
                  name={meta.icon as any}
                  size={24}
                  color={meta.color}
                />
              </View>

              <View style={styles.alertBody}>
                <View style={styles.row}>
                  <Text style={styles.alertTitle}>{item.title}</Text>

                  <Text style={[styles.badge, { color: meta.color }]}>
                    {meta.label}
                  </Text>
                </View>

                <Text style={styles.description}>{item.body}</Text>

                <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(driver)/emergency-report")}
        >
          <Ionicons name="warning-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Report Emergency</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={load}
        >
          <Ionicons name="refresh" size={20} color={Colors.primary} />
          <Text style={[styles.buttonText, { color: Colors.primary }]}>
            Refresh Alerts
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },

  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 22,
  },

  summaryItem: {
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.primary,
  },

  summaryLabel: {
    marginTop: 6,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 16,
  },

  empty: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },

  alertCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  alertBody: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  alertTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },

  badge: {
    fontWeight: "700",
    fontSize: 13,
  },

  description: {
    marginTop: 6,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  time: {
    marginTop: 10,
    fontSize: 12,
    color: "#888",
  },

  button: {
    marginTop: 18,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  buttonText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
