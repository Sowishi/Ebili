import {
  View,
  Text,
  Pressable,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import AuthTextInput from "../components/AuthTextInput";
import AuthButton from "../components/AuthButton";

import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import Loading from "../components/loading";
import Toast from "react-native-toast-message";

import { userCol } from "../firebaseConfig";
import { addDoc } from "@firebase/firestore";

export default function Registration({ navigation }) {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [pass2, setPass2] = useState();
  const [loading, setLoading] = useState(false);

  const handleError = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (firstName === "" || firstName === undefined) {
      return "Please input your first name.";
    } else if (lastName === "" || lastName === undefined) {
      return "Please input your last name.";
    } else if (email === "" || email === undefined) {
      return "Please input your email.";
    } else if (!reg.test(email)) {
      return "Please input a proper email address";
    } else if (pass === "" || pass === undefined) {
      return "Password is empty";
    } else if (pass !== pass2) {
      return "Password did'nt Match";
    } else if (pass.length < 8) {
      return "Password must be longer than 8 characters";
    } else {
      return false;
    }
  };

  const handleSignUp = () => {
    const result = handleError();

    if (result !== false) {
      showErrorToast(result);
    } else {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredentials) => {
          addDoc(userCol, {
            id: userCredentials.user.uid,
            firstName: firstName,
            lastName: lastName,
            role: "customer",
            photoUrl:
              "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg",
          });

          showSuccessToast();
          navigation.navigate("Login");
          setLoading(false);
        })
        .catch((error) => {
          showErrorToast(error.code);
          setLoading(false);
        });
    }
  };

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Registered Successfully",
    });
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
        source={require("../assets/ebili-cover.png")}
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
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          CREATE YOUR ACCOUNT
        </Text>
        <View style={{ alignItems: "center" }}>
          <AuthTextInput
            style={{
              marginTop: 15,
            }}
            entypoIconName="user"
            placeHolder="First name"
            secured={false}
            onChange={(text) => setFirstName(text)}
          />
          <AuthTextInput
            entypoIconName="user"
            style={{
              marginTop: 15,
            }}
            placeHolder="Last name"
            secured={false}
            onChange={(text) => setLastName(text)}
          />
          <AuthTextInput
            onChange={(text) => setEmail(text)}
            style={{ marginTop: 15 }}
            placeHolder="Email"
            entypoIconName="mail"
            type="emailAddress"
            secured={false}
          />
          <AuthTextInput
            onChange={(text) => setPass(text)}
            style={{ marginVertical: 15 }}
            placeHolder="Password"
            entypoIconName="lock"
            secured={true}
          />
          <AuthTextInput
            onChange={(text) => setPass2(text)}
            placeHolder="Re-type password"
            entypoIconName="lock"
            secured={true}
          />
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
              Already have an account?
            </Text>
          </Pressable>

          <AuthButton
            style={{ backgroundColor: "#4FBCDD" }}
            text="SIGN UP"
            handlePress={handleSignUp}
          />
        </View>
      </View>
    </View>
  );
}
