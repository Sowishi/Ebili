import { View, Text, TextInput } from "react-native";
import { Entypo } from "@expo/vector-icons";
import React from "react";

export default function AuthTextInput({
  placeHolder,
  entypoIconName,
  secured,
  style,
}) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          borderWidth: 2,
          justifyContent: "flex-start",
          alignItems: "center",
          width: "75%",
          padding: 5,
          borderRadius: 20,
        },
        { ...style },
      ]}
    >
      <Entypo
        name={entypoIconName}
        size={24}
        color="black"
        style={{ marginLeft: 5 }}
      />
      <TextInput
        secureTextEntry={secured}
        placeholder={placeHolder}
        style={{
          width: "75%",
          paddingHorizontal: 20,
        }}
      ></TextInput>
    </View>
  );
}
