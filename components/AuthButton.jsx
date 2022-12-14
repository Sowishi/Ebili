import { Text, Pressable } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

export default function AuthButton({
  text,
  style,
  hasIcon,
  iconName,
  iconColor,
  handlePress,
}) {
  return (
    <Pressable
      onPress={handlePress}
      style={[
        {
          marginTop: 20,
          paddingVertical: 10,
          paddingHorizontal: 80,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        },
        { ...style },
      ]}
    >
      {hasIcon && (
        <AntDesign
          style={{ marginHorizontal: 10 }}
          name={iconName}
          size={24}
          color={iconColor}
        />
      )}
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          color: "black",
          width: 100,
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}
