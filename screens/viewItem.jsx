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
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-gesture-handler";
import { Timestamp } from "@firebase/firestore";

export default function ViewItem({ route }) {
  const data = route.params;
  const [addCart, setAddCart] = useState(false);

  const showToast = () => {
    setAddCart(false);
    Toast.show({
      type: "success",
      text1: "You are the current bidder.",
    });
  };

  const handleBid = () => {
    console.log(data);
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
      <View
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
              <Image
                source={{ uri: data.owner.photoUrl }}
                style={{ width: 50, height: 50, borderRadius: 100 }}
              />
              <Text style={{ marginLeft: 5 }}>
                {data.owner.firstName + " " + data.owner.lastName}
              </Text>
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text>
              Current Bidder:{" "}
              <Text style={{ fontWeight: "bold", color: "#4FBCDD" }}>None</Text>
            </Text>
            <Text>
              Amount:{" "}
              <Text style={{ fontWeight: "bold", color: "#4FBCDD" }}>₱0 </Text>
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
                {data.bidTime}
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
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
