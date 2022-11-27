import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../firebaseConfig";
import { signOut } from "@firebase/auth";

export default function User({ navigation }) {
  const handleSIgnOut = () => {
    signOut(auth).then(() => {
      navigation.replace("Login");
    });
  };

  return (
    <SafeAreaView>
      <Pressable onPress={handleSIgnOut}>
        <View>
          <Text>LOGOUT</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
