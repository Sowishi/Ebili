import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/header";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  query,
  serverTimestamp,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useSelector } from "react-redux";
import { mainReducer } from "../redux/reducers";

export default function Chat({ navigation, route }) {
  const { otherUser } = route.params;
  const { currentUser } = useSelector((state) => state.mainReducer);

  const textInputRef = useRef();
  const msgRef = useRef();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState();

  const handleSend = () => {
    if (text === "" || text === undefined) {
      showErrorToast();
      textInputRef.current.clear();
    } else {
      const conversationRef = collection(db, "conversation");
      addDoc(conversationRef, {
        createdAt: serverTimestamp(),
        otherUser: otherUser,
        owner: currentUser,
        text: text,
      });

      textInputRef.current.clear();
      setText("");
      msgRef.current.scrollToEnd();
    }
  };

  const fetchMessages = () => {
    const messagesRef = collection(db, "conversation");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(30));

    onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.docs.forEach((doc) => {
        messages.push(doc.data());
      });

      setMessages(messages.reverse());
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Your message cannot be empty",
    });
  };

  const renderMessages = ({ item }) => {
    const ownMessage = item.owner.id === currentUser.id;

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
            <TouchableOpacity
              onPress={() => navigation.navigate("User", item.owner)}
            >
              <Image
                style={{ width: 30, height: 30, borderRadius: 100 }}
                source={{ uri: item.owner.photoUrl }}
              />
            </TouchableOpacity>
          )}

          <View
            style={{
              alignItems: "flex-start",
              alignItems: "flex-start",
            }}
          >
            {!ownMessage && (
              <Text style={{ marginLeft: 10, fontSize: 13, color: "gray" }}>
                {item.owner.firstName}
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
    fetchMessages();
  }, []);

  const filteredMessage = messages.filter((i) => {
    if (
      (i.owner.id === currentUser.id && i.otherUser.id === otherUser.id) ||
      (i.owner.id === otherUser.id && i.otherUser.id === currentUser.id)
    ) {
      return i;
    }
  });

  console.log(filteredMessage);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8f8f8", marginTop: 20 }}
    >
      <View style={{ flex: 1 }}>
        {otherUser ? (
          <Text
            style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}
          >
            {otherUser.firstName + " " + otherUser.lastName}
          </Text>
        ) : (
          <ActivityIndicator />
        )}

        {messages ? (
          <View style={{ flex: 6 }}>
            <FlatList
              ref={msgRef}
              data={filteredMessage}
              renderItem={renderMessages}
              keyExtractor={(item, index) => index}
            />
          </View>
        ) : (
          <ActivityIndicator />
        )}

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
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
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
      </View>
    </SafeAreaView>
  );
}
