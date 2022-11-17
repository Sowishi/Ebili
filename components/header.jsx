import { View, Text } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AuthTextInput from "./AuthTextInput";

export default function Header() {
  return (
    <View
      style={{
        marginHorizontal: 10,
        backgroundColor: "#f8f8f8",
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{ backgroundColor: "white", borderRadius: 100, padding: 5 }}
        >
          <Entypo name="menu" size={25} color="#FF7B7D" />
        </View>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>E-BILI</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 100,
              padding: 6,
              marginRight: 10,
            }}
          >
            <Entypo name="shopping-cart" size={25} color="#FF7B7D" />
          </View>
          <View
            style={{
              backgroundColor: "#F7A721",
              borderRadius: 100,
              padding: 5,
            }}
          >
            <Entypo name="user" size={25} color="black" />
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AuthTextInput
          style={{
            marginVertical: 15,
            borderWidth: 1,
            backgroundColor: "white",
          }}
          placeHolder="Username"
          entypoIconName="magnifying-glass"
          secured={false}
        />
        <View
          style={{
            marginLeft: 10,
            backgroundColor: "white",
            borderRadius: 100,
            padding: 5,
          }}
        >
          <Ionicons name="md-filter" size={24} color="#FF7B7D" />
        </View>
      </View>
    </View>
  );
}