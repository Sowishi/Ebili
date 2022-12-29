import { View, Text, Image } from "react-native";
import React from "react";

export default function LoginLoading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Image
        source={require("../assets/loginLoading.gif")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Logging In...</Text>
    </View>
  );
}
