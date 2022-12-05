import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  Dimensions,
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-gesture-handler";
import CountDown from "react-native-countdown-component";
import { userCol, db, auth } from "../firebaseConfig";
import {
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import Loading from "../components/loading";

export default function ViewItem({ route, navigation }) {
  const data = route.params;
  const [addCart, setAddCart] = useState(false);
  const [bid, setBid] = useState();

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

  const showSuccessToast = () => {
    setAddCart(false);
    Toast.show({
      type: "success",
      text1: "You are the highest bidder.",
    });
  };

  const showErrorToast = (text) => {
    setAddCart(false);
    Toast.show({
      type: "error",
      text1: text,
    });
  };

  const handleBid = () => {
    if (currentUser.docID === data.owner.docID) {
      showErrorToast("You. cannot bid in your own item!");
    } else if (parseInt(bid) < data.price) {
      showErrorToast("Your bid must be higher than the current price/bid");
    } else if (bid === undefined) {
      showErrorToast("Your bid is empty!");
    } else {
      const productDoc = doc(db, "products", data.docID);
      updateDoc(productDoc, {
        currentBidder: currentUser.firstName + " " + currentUser.lastName,
        bidAmount: parseInt(bid),
      }).then(() => {
        showSuccessToast("Your bid is place successfully!");
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addCart}
        onRequestClose={() => setAddCart(false)}
      >
        <View
          style={{
            backgroundColor: "#00000030",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              height: Dimensions.get("window").height * 0.6,
              width: "100%",
              backgroundColor: "white",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            }}
          >
            <View
              style={{
                margin: 30,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Image
                style={{ width: 100, height: 100 }}
                source={{ uri: data.productPhotoUrl }}
              />
              <View
                style={{ justifyContent: "center", alignItems: "flex-start" }}
              >
                <Text
                  style={{ color: "#4FBCDD", fontWeight: "bold", fontSize: 30 }}
                >
                  ₱{data.price}
                </Text>
              </View>
            </View>
            <View
              style={{
                margin: 40,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>Amount</Text>
              <TextInput
                keyboardType="numeric"
                onChangeText={(text) => setBid(text)}
                style={{
                  borderBottomWidth: 1,
                  width: "50%",
                  borderColor: "#4FBCDD",
                  marginLeft: 10,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Pressable
                onPress={handleBid}
                style={{
                  backgroundColor: "#46B950",
                  width: "90%",
                  paddingVertical: 15,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  BID{" "}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: "#f8f8f430",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          resizeMode="contain"
          source={{ uri: data.productPhotoUrl }}
          style={{ width: "70%", height: "70%" }}
        />
      </View>
      <ScrollView
        style={{
          position: "relative",
          backgroundColor: "white",
          flex: 1.5,
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
        }}
      >
        <View style={{ margin: 30 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "70%" }}>
              <Text style={{ fontSize: 23, fontWeight: "bold" }}>
                {data.title}
              </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "#4FBCDD" }}
              >
                ₱{data.price}
              </Text>
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                marginTop: 10,
                fontWeight: "bold",
                fontSize: 20,
                marginVertical: 5,
                fontSize: 20,
              }}
            >
              Seller
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              {currentUser ? (
                <Pressable
                  disabled={data.owner.id === currentUser.id}
                  onPress={() => navigation.navigate("User", data.owner)}
                >
                  <Image
                    source={{ uri: data.owner.photoUrl }}
                    style={{ width: 50, height: 50, borderRadius: 100 }}
                  />
                </Pressable>
              ) : (
                <Loading />
              )}

              <Text style={{ marginLeft: 5 }}>
                {data.owner.firstName + " " + data.owner.lastName}
              </Text>
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text>
              Highest Bidder:{" "}
              <Text style={{ fontWeight: "bold", color: "#4FBCDD" }}>
                {data.currentBidder}
              </Text>
            </Text>
            <Text>
              Highest Bid:{" "}
              <Text style={{ fontWeight: "bold", color: "#4FBCDD" }}>
                ₱{data.bidAmount}{" "}
              </Text>
            </Text>
            <Text>
              Listed on:{" "}
              {data && (
                <Text style={{ fontWeight: "bold", color: "#4FBCDD" }}>
                  {data.createdAt.toDate().toDateString()}
                </Text>
              )}
            </Text>
            <Text>
              Bidding ends in:{" "}
              <Text style={{ fontWeight: "bold", color: "#4FBCDD" }}>
                {data.bidTime}{" "}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 5,
                fontSize: 20,
              }}
            >
              Description
            </Text>
            <Text style={{ fontSize: 15, color: "gray" }}>
              {data.description}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => setAddCart(true)}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            padding: 15,
            borderRadius: 100,
            backgroundColor: "#4FBCDD",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome name="cart-plus" size={24} color="white" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
