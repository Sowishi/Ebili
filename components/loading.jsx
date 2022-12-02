import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

export default function Loading() {
  return (
    <View
      style={{
        backgroundColor: "#4FBCDD99",
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
      <ActivityIndicator size="large" color="white" />
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
        Loading
      </Text>
    </View>
  );
}
