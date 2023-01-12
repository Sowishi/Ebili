import { View, Text, ActivityIndicator, Image } from "react-native";
import React from "react";

export default function Loading() {
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 99,
        left: 0,
        top: 0,
      }}
    >
      <Image
        source={require("../assets/loginLoading.gif")}
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}
