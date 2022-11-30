import { View, Text, Pressable, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import AuthTextInput from "../components/AuthTextInput";
import AuthButton from "../components/AuthButton";

import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "@firebase/auth";
import Toast from "react-native-toast-message";
import Loading from "../components/loading";

export default function Login({ navigation }) {
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, () => {
      if (auth.currentUser) {
        navigation.replace("Drawer");
      }
    });
  });

  const handleError = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email === "" || email === undefined) {
      return "Please input your email.";
    } else if (!reg.test(email)) {
      return "Please input a proper email address";
    } else if (pass === "" || pass === undefined) {
      return "Password is empty";
    } else {
      return false;
    }
  };

  const handleSignIn = () => {
    handleError();
    const result = handleError();

    if (result !== false) {
      showErrorToast(result);
    } else {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
          navigation.replace("Drawer");
          setLoading(false);
        })
        .catch((error) => {
          showErrorToast(error.code);
          setLoading(false);
        });
    }
  };

  const showErrorToast = (text) => {
    Toast.show({
      type: "error",
      text1: text,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && <Loading />}
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
            placeHolder="Email"
            entypoIconName="mail"
            secured={false}
            onChange={(text) => {
              setEmail(text);
            }}
          />
          <AuthTextInput
            placeHolder="Password"
            entypoIconName="lock"
            secured={true}
            onChange={(text) => {
              setPass(text);
            }}
          />
          <Pressable onPress={() => console.warn("fdf")}>
            <Text style={{ color: "#FF7C7E", fontSize: 15, marginTop: 10 }}>
              Forget Password?
            </Text>
          </Pressable>
          <AuthButton handlePress={handleSignIn} text="LOGIN" />
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
