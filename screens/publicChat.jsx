import { View, Text, FlatList, TextInput, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/header";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { auth, userCol } from "../firebaseConfig";

export default function PublicCHat({ navigation }) {
  const user = auth;

  const textInputRef = useRef();
  const msgRef = useRef();

  const [currentUser, setCurrentUser] = useState();
  const [messages, setMessages] = useState();

  const [text, setText] = useState();

  const handleSend = () => {
    const messagesRef = collection(db, "messages");
    addDoc(messagesRef, {
      userUID: currentUser.id,
      createdAt: serverTimestamp(),
      text: text,
      photoUrl: currentUser.photoUrl,
      firstName: currentUser.firstName,
    });
    textInputRef.current.clear();
    msgRef.current.scrollToEnd();
  };

  const fetchMessages = () => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt"), limit(30));

    onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.docs.forEach((doc) => {
        messages.push(doc.data());
      });

      setMessages(messages);
    });
  };

  const fetchUserData = () => {
    const q = query(userCol, where("id", "==", user.currentUser.uid));

    getDocs(q)
      .then((snapshot) => {
        const users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), docID: doc.id });
        });
        setCurrentUser(users[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderMessages = ({ item }) => {
    const ownMessage = item.userUID === currentUser.id;

    return (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: ownMessage ? "flex-end" : "flex-start",
          marginVertical: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            marginHorizontal: 10,
          }}
        >
          {!ownMessage && (
            <Image
              style={{ width: 30, height: 30, borderRadius: 100 }}
              source={{ uri: item.photoUrl }}
            />
          )}

          <View
            style={{
              alignItems: "flex-start",
              alignItems: "flex-start",
            }}
          >
            {!ownMessage && (
              <Text style={{ marginLeft: 10, fontSize: 13, color: "gray" }}>
                {item.firstName}
              </Text>
            )}

            <View
              style={{
                backgroundColor: ownMessage ? "#4FBCDD" : "gray",
                paddingHorizontal: 5,
                paddingVertical: 3,
                borderRadius: 10,
                marginHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 20, color: "white" }}>{item.text}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchUserData();
    fetchMessages();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <Header navigation={navigation} />
      <View style={{ flex: 6 }}>
        <FlatList
          ref={msgRef}
          data={messages}
          renderItem={renderMessages}
          keyExtractor={(item, index) => index}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 30,
        }}
      >
        <TextInput
          ref={textInputRef}
          clearButtonMode="always"
          onChangeText={(text) => setText(text)}
          style={{ borderBottomWidth: 1, flex: 1, borderColor: "#4FBCDD" }}
        />
        <TouchableOpacity
          style={{
            marginLeft: 10,
            backgroundColor: "#4FBCDD",
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
          onPress={handleSend}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
              Send
            </Text>
            <Feather
              style={{ marginLeft: 5 }}
              name="send"
              size={20}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
