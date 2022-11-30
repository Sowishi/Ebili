import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AuthTextInput from "./AuthTextInput";

export default function Header({ navigation }) {
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
          <Entypo
            name="menu"
            size={25}
            color="#4FBCDD"
            onPress={() => navigation.openDrawer()}
          />
        </View>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>E-BILI</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 100,
                padding: 6,
                marginRight: 10,
              }}
            >
              <Entypo name="shopping-cart" size={25} color="#4FBCDD" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("User")}>
            <View
              style={{
                backgroundColor: "#F7A721",
                borderRadius: 100,
                padding: 5,
              }}
            >
              <Entypo name="user" size={25} color="black" />
            </View>
          </TouchableOpacity>
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
      </View>
    </View>
  );
}
