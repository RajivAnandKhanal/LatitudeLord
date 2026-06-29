import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
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
import { Colors } from "../../theme/colors";
import { getBotReply } from "../../utils/busBot";

type Message = {
  id: string;
  from: "user" | "bot";
  text: string;
};

const suggestedPrompts = [
  "Where is Bus 12?",
  "Buses near me",
  "Bus 21 ETA",
  "Show all routes",
];

export default function PassengerChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      from: "bot",
      text: "Hi! I'm your LatitudeLord assistant. Ask me about any bus, route, or station and I'll help you find it.",
    },
  ]);

  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  function sendMessage(text: string) {
    const trimmed = text.trim();

    if (!trimmed) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      from: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setBotTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: `b-${Date.now()}`,
        from: "bot",
        text: getBotReply(trimmed),
      };

      setMessages((prev) => [...prev, botMessage]);
      setBotTyping(false);

      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }, 500);

    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerWrap}>
        <PageHeader title="Bus Assistant" subtitle="Ask about any bus or route" />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubbleRow,
              item.from === "user" ? styles.bubbleRowUser : styles.bubbleRowBot,
            ]}
          >
            {item.from === "bot" && (
              <View style={styles.botIcon}>
                <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              </View>
            )}

            <View
              style={[
                styles.bubble,
                item.from === "user" ? styles.bubbleUser : styles.bubbleBot,
              ]}
            >
              <Text
                style={
                  item.from === "user" ? styles.bubbleTextUser : styles.bubbleTextBot
                }
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          botTyping ? (
            <View style={[styles.bubbleRow, styles.bubbleRowBot]}>
              <View style={styles.botIcon}>
                <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              </View>
              <View style={[styles.bubble, styles.bubbleBot]}>
                <Text style={styles.bubbleTextBot}>Typing...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {messages.length <= 1 && (
        <View style={styles.suggestionsRow}>
          {suggestedPrompts.map((prompt) => (
            <TouchableOpacity
              key={prompt}
              style={styles.suggestionChip}
              onPress={() => sendMessage(prompt)}
            >
              <Text style={styles.suggestionText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputBar}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about a bus, route or station..."
          style={styles.input}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          disabled={!input.trim()}
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

  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 8,
  },

  suggestionChip: {
    backgroundColor: "#EFF6FF",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  suggestionText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 13,
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
