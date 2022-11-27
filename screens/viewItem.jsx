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

export default function ViewItem({ route }) {
  const data = route.params;
  const [addCart, setAddCart] = useState(false);
  const [count, setCount] = useState(1);

  const star = (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <FontAwesome name="star" size={24} color="#E6E121" />
      <Text style={{ marginLeft: 5, fontWeight: "bold" }}>
        {data.rating.rate}
      </Text>
    </View>
  );

  const showToast = () => {
    setAddCart(false);
    Toast.show({
      type: "success",
      text1: "ITEM ADDED TO CART!",
    });
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
                source={{ uri: data.image }}
              />
              <View
                style={{ justifyContent: "center", alignItems: "flex-start" }}
              >
                <Text
                  style={{ color: "#4FBCDD", fontWeight: "bold", fontSize: 30 }}
                >
                  ₱{data.price}
                </Text>
                {star}
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
              <Text style={{ fontSize: 20 }}>Quantity</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  color={"#4FBCDD"}
                  title="-"
                  disabled={count === 1 ? true : false}
                  onPress={() => setCount(count - 1)}
                ></Button>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {count}
                </Text>
                <Button
                  color={"#4FBCDD"}
                  onPress={() => setCount(count + 1)}
                  title="+"
                ></Button>
              </View>
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
                onPress={showToast}
                style={{
                  backgroundColor: "#E6141C",
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
                  ADD TO CART
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
          source={{ uri: data.image }}
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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {data.title}
              </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "#4FBCDD" }}
              >
                ₱{data.price}
              </Text>
              {star}
            </View>
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
