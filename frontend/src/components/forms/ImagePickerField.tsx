import { useState } from "react";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Colors } from "../../theme/colors";

interface Props {
  label: string;
  onImageSelected: (uri: string) => void;
}

export default function ImagePickerField({ label, onImageSelected }: Props) {
  const [image, setImage] = useState<string | null>(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setImage(uri);

      onImageSelected(uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.upload} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Select Photo</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
  },

  upload: {
    height: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  placeholder: {
    color: Colors.textSecondary,
  },
});
