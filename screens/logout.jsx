import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import Loading from "../components/loading";

export default function Logout({ navigation }) {
  const handleSIgnOut = () => {
    signOut(auth).then(() => {
      navigation.replace("Login");
    });
  };

  useEffect(() => {
    handleSIgnOut();
  });

  return <Loading />;
}
