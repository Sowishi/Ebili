import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AuthTextInput from "./AuthTextInput";
import { userCol, db, auth } from "../firebaseConfig";
import {
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

export default function Header({ navigation }) {
  const user = auth;
  const [currentUser, setCurrentUser] = useState();

  const fetchUserData = () => {
    const q = query(userCol, where("id", "==", user.currentUser.uid));

    onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), docID: doc.id });
      });
      setCurrentUser(users[0]);
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AuthTextInput
          onFocus={() => navigation.navigate("Search")}
          style={{
            marginVertical: 15,
            borderWidth: 1,
            backgroundColor: "white",
          }}
          placeHolder="Search Something..."
          entypoIconName="magnifying-glass"
          secured={false}
        />
      </View>
    </View>
  );
}
