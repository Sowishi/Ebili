import { View, Text, ImageBackground, Dimensions } from "react-native";
import React from "react";

export default function Banner() {
  return (
    <View
      style={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      <ImageBackground
        imageStyle={{ borderRadius: 10 }}
        style={{
          width: Dimensions.get("window").width - 20,
          height: 150,
        }}
        source={require("../assets/banner-1.jpg")}
      />
    </View>
  );
}
