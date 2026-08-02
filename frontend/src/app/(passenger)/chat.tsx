import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useJourney } from "../../hooks/useJourney";
import * as chatService from "../../services/chatService";
import { BackendChatMessage } from "../../services/chatService";
import { connectSocket } from "../../services/socket";
import { Colors } from "../../theme/colors";

export default function PassengerChatScreen() {
  const { user } = useAuth();
  const { selectedBus } = useJourney();

  const [messages, setMessages] = useState<BackendChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<BackendChatMessage>>(null);

  useEffect(() => {
    if (!selectedBus) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const history = await chatService.getMessages(selectedBus.id);
        if (!cancelled) setMessages(history);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    connectSocket().then(() => {
      if (!cancelled) chatService.joinChatRoom(selectedBus.id);
    });

    const unsubscribe = chatService.onChatMessage((message) => {
      if (message.bus !== selectedBus.id) return;
      setMessages((prev) => [...prev, message]);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    });

    return () => {
      cancelled = true;
      chatService.leaveChatRoom(selectedBus.id);
      unsubscribe();
    };
  }, [selectedBus?.id]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !selectedBus) return;

    setInput("");
    setSending(true);
    try {
      const ack = await chatService.sendChatMessage(selectedBus.id, trimmed);
      if (!ack.success) {
        // Socket path failed (e.g. not connected yet) — fall back to REST.
        const message = await chatService.sendMessageRest(selectedBus.id, trimmed);
        setMessages((prev) => [...prev, message]);
      }
    } finally {
      setSending(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }

  if (!selectedBus) {
    return (
      <View style={styles.emptyState}>
        <PageHeader title="Bus Chat" subtitle="Chat with bus staff" showBackButton />
        <Ionicons name="chatbubbles-outline" size={48} color={Colors.textSecondary} />
        <Text style={styles.emptyText}>
          Board a bus from the live map first — chat opens once you've selected a bus.
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/(passenger)/map")}>
          <Text style={styles.emptyButtonText}>Open Live Map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerWrap}>
        <PageHeader title={`Chat • ${selectedBus.busNumber}`} subtitle="Bus staff" showBackButton />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isMine = item.senderId === user?.id;
            return (
              <View
                style={[styles.bubbleRow, isMine ? styles.bubbleRowUser : styles.bubbleRowBot]}
              >
                {!isMine && (
                  <View style={styles.botIcon}>
                    <Ionicons name="person" size={14} color="#FFFFFF" />
                  </View>
                )}

                <View style={[styles.bubble, isMine ? styles.bubbleUser : styles.bubbleBot]}>
                  <Text style={isMine ? styles.bubbleTextUser : styles.bubbleTextBot}>
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>
              No messages yet — say hello to the bus staff.
            </Text>
          }
        />
      )}

      <View style={styles.inputBar}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Message bus staff..."
          style={styles.input}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || sending) && styles.sendButtonDisabled]}
          disabled={!input.trim() || sending}
          onPress={() => sendMessage(input)}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyState: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 56,
  },

  emptyText: {
    marginTop: 14,
    textAlign: "center",
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  emptyButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  emptyListText: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginTop: 30,
  },

  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 56,
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },

  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },

  bubbleRowUser: {
    justifyContent: "flex-end",
  },

  bubbleRowBot: {
    justifyContent: "flex-start",
  },

  botIcon: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  bubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },

  bubbleBot: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },

  bubbleTextUser: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 21,
  },

  bubbleTextBot: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 21,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    paddingHorizontal: 18,
    fontSize: 15,
    marginRight: 10,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },
});
