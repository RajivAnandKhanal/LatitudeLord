
import { StyleSheet, Text, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import PageHeader from "../../components/common/PageHeader";

export default function ChatScreen() {
  return (
    <AuthScreen>
      <PageHeader title="Chat" />

      <View style={styles.chat}>
        <Text>Chat with Bus Staff will appear here.</Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  chat: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },
});
