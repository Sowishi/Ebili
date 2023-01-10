import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import AuthTextInput from "./AuthTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function Header({ navigation, currentUser }) {
  const { cart } = useSelector((state) => state.mainReducer);

  return (
    <View
      style={{
        backgroundColor: "#4FBCDD",
        padding: 10,
        marginBottom: 10,
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
        <AuthTextInput
          onFocus={() => navigation.navigate("Search")}
          style={{
            marginVertical: 15,
            borderWidth: 1,
            borderColor: "white",
            backgroundColor: "white",
            width: "60%",
          }}
          placeHolder="Search Something"
          entypoIconName="magnifying-glass"
          secured={false}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Cart", currentUser)}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 100,
                padding: 6,
                marginRight: 10,
                position: "relative",
              }}
            >
              <MaterialCommunityIcons
                name="cart-variant"
                size={24}
                color="#4FBCDD"
              />
              <View
                style={{
                  backgroundColor: "red",
                  position: "absolute",
                  height: 20,
                  width: 20,
                  borderRadius: 500,
                  right: -5,
                  top: -5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {cart && (
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {cart.length}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("User")}>
            {currentUser ? (
              <Image
                source={{ uri: currentUser.photoUrl }}
                style={{ width: 35, height: 35, borderRadius: 100 }}
              />
            ) : (
              <ActivityIndicator />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
