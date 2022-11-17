import {
  View,
  Text,
  Pressable,
  ImageBackground,
  Dimensions,
} from "react-native";
import React from "react";
import AuthTextInput from "../components/AuthTextInput";
import AuthButton from "../components/AuthButton";

export default function Registration({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/shop-2.webp")}
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
          Register
        </Text>
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <AuthTextInput
              style={{
                width: Dimensions.get("screen").width * 0.45,
                paddingHorizontal: 0,
                marginHorizontal: 10,
              }}
              placeHolder="First name"
              secured={false}
            />
            <AuthTextInput
              style={{
                width: Dimensions.get("screen").width * 0.45,
                paddingHorizontal: 0,
              }}
              placeHolder="Last name"
              secured={false}
            />
          </View>
          <AuthTextInput
            style={{ marginTop: 15 }}
            placeHolder="Username"
            entypoIconName="user"
            secured={false}
          />
          <AuthTextInput
            style={{ marginVertical: 15 }}
            placeHolder="Password"
            entypoIconName="lock"
            secured={true}
          />
          <AuthTextInput
            placeHolder="Re-type password"
            entypoIconName="lock"
            secured={true}
          />
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#FF7C7E", fontSize: 15, marginTop: 10 }}>
              Already have an account?
            </Text>
          </Pressable>
          <AuthButton text="SIGN UP" />
        </View>
      </View>
    </View>
  );
}
