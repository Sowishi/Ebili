import { View, Text, Pressable, ImageBackground } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import AuthTextInput from "../components/AuthTextInput";
import AuthButton from "../components/AuthButton";

export default function Login({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/shop.jpg")}
        style={{
          flex: 1,
        }}
        imageStyle={{ borderBottomRightRadius: 50, borderBottomLeftRadius: 50 }}
      ></ImageBackground>

      <View style={{ flex: 2 }}>
        <Text
          style={{
            textAlign: "center",
            marginVertical: 10,
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          LOGIN
        </Text>
        <View style={{ alignItems: "center" }}>
          <AuthTextInput
            style={{ marginVertical: 15 }}
            placeHolder="Username"
            entypoIconName="user"
            secured={false}
          />
          <AuthTextInput
            placeHolder="Password"
            entypoIconName="lock"
            secured={true}
          />
          <Pressable onPress={() => console.warn("fdf")}>
            <Text style={{ color: "#FF7C7E", fontSize: 15, marginTop: 10 }}>
              Forget Password?
            </Text>
          </Pressable>
          <AuthButton
            handlePress={() => navigation.navigate("Home")}
            text="LOGIN"
          />
          <Text style={{ color: "gray", marginVertical: 10 }}>or</Text>
          <AuthButton
            text="SIGNUP"
            handlePress={() => navigation.navigate("Registration")}
            style={{ marginTop: 0 }}
          />
          <Text style={{ color: "gray", marginVertical: 10 }}>
            ---------------- login with ----------------
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Pressable>
              <AntDesign name="google" size={50} color="#F3B605" />
            </Pressable>
            <AntDesign name="facebook-square" size={50} color="#4081EC" />
          </View>
        </View>
      </View>
    </View>
  );
}
