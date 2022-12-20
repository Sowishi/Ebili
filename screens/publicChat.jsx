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
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Loading from "../components/loading";
import { useSelector } from "react-redux";

export default function PublicCHat({ navigation }) {
  const { currentUser } = useSelector((state) => state.mainReducer);
  const textInputRef = useRef();
  const msgRef = useRef();

  const [messages, setMessages] = useState();

  const [text, setText] = useState();

  const handleSend = () => {
    if (text === "" || text === undefined) {
      showErrorToast();
      textInputRef.current.clear();
    } else {
      const messagesRef = collection(db, "messages");
      addDoc(messagesRef, {
        createdAt: serverTimestamp(),
        text: text,
        owner: currentUser,
      });
      textInputRef.current.clear();
      setText("");
      msgRef.current.scrollToEnd();
    }
  };

  const fetchMessages = () => {
    const messagesRef = collection(db, "messages");
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
                style={{ width: 20, height: 20, borderRadius: 100 }}
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
              <Text style={{ marginLeft: 10, fontSize: 11, color: "gray" }}>
                {item.owner.firstName}
              </Text>
            )}

            <View
              style={{
                backgroundColor: ownMessage ? "#0096be" : "#EFB701",
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 10,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{ fontSize: 11, color: ownMessage ? "white" : "black" }}
              >
                {item.text}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <Header navigation={navigation} currentUser={currentUser} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
          Public Chat
        </Text>
        {messages ? (
          <View style={{ flex: 6 }}>
            <FlatList
              ref={msgRef}
              data={messages}
              renderItem={renderMessages}
              keyExtractor={(item, index) => index}
            />
          </View>
        ) : (
          <Loading />
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
              backgroundColor: "#0096be",
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
                paddingHorizontal: 13,
                paddingVertical: 5,
              }}
            >
              <Feather name="send" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
