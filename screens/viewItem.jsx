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
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useState } from "react";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-gesture-handler";
import { db } from "../firebaseConfig";
import {
  updateDoc,
  doc,
  collection,
  addDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import Loading from "../components/loading";
import { useSelector } from "react-redux";
import moment from "moment";

export default function ViewItem({ route, navigation }) {
  const { currentUser } = useSelector((state) => state.mainReducer);
  const data = route.params;

  const [addCart, setAddCart] = useState(false);
  const [bid, setBid] = useState();
  const [quantity, setQuantity] = useState(1);
  const [owner, setOwner] = useState();
  // const [data, setData] = useState();

  const showSuccessToast = (text) => {
    setAddCart(false);
    Toast.show({
      type: "success",
      text1: text,
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
    const activityRef = collection(db, "activities");

    if (currentUser.docID === owner.docID) {
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
        addDoc(activityRef, {
          bidAmount: parseInt(bid),
          item: data,
          ownerID: data.owner.id,
          owner: data.owner,
          user: currentUser,
          createdAt: serverTimestamp(),
          type: "bid",
        });
        showSuccessToast("Your bid is place successfully!");
      });
    }
  };

  const handleRetail = () => {
    const output = {
      quantity: quantity,
      product: data,
      owner: currentUser,
    };

    const cartsRef = collection(db, "carts");
    addDoc(cartsRef, output).then(() => {
      showSuccessToast("Added to cart!");
    });
  };

  const fetchOwner = () => {
    const ownerRef = doc(db, "users", data.owner.docID);
    getDoc(ownerRef)
      .then((snapshot) => {
        setOwner(snapshot.data());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const fetchProduct = () => {
  //   const productRef = doc(db, "products", passedData.docID);
  //   getDoc(productRef)
  //     .then((snapshot) => {
  //       setData(snapshot.data());
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    fetchOwner();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  if (owner === undefined || data === undefined) {
    return <Loading />;
  }

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
                  ₱{data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              </View>
            </View>
            {data.sellType === "bidding" ? (
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
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>Quantity</Text>

                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Button
                    color={"#4FBCDD"}
                    title="-"
                    disabled={quantity === 1 ? true : false}
                    onPress={() => setQuantity(quantity - 1)}
                  ></Button>
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {quantity}
                  </Text>
                  <Button
                    color={"#4FBCDD"}
                    onPress={() => setQuantity(quantity + 1)}
                    title="+"
                  ></Button>
                </View>
              </View>
            )}

            {data.sellType === "bidding" ? (
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
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Pressable
                  onPress={handleRetail}
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
                    ADD TO CART
                  </Text>
                </Pressable>
              </View>
            )}
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
          resizeMode="cover"
          source={{ uri: data.productPhotoUrl }}
          style={{ width: "90%", height: "90%", borderRadius: 10 }}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{
          position: "relative",
          backgroundColor: "#D1E8F7",
          flex: 1.5,
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
        }}
      >
        <View style={{ margin: 30 }}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <View>
              <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                {data.title}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "#0096be" }}
              >
                ₱{data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                fontSize: 15,
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
              {currentUser && owner ? (
                <Pressable
                  disabled={owner.id === currentUser.id}
                  onPress={() => navigation.navigate("User", owner)}
                >
                  <Image
                    source={{ uri: owner.photoUrl }}
                    style={{ width: 50, height: 50, borderRadius: 100 }}
                  />
                </Pressable>
              ) : (
                <Loading />
              )}

              <Text style={{ marginLeft: 5 }}>
                {owner.firstName + " " + owner.lastName}
              </Text>
            </View>
          </View>
          {data.sellType === "bidding" && (
            <View style={{ marginVertical: 10 }}>
              <Text>
                Highest Bidder:{" "}
                <Text style={{ fontWeight: "bold", color: "#0096be" }}>
                  {data.currentBidder}
                </Text>
              </Text>
              <Text>
                Highest Bid:{" "}
                <Text style={{ fontWeight: "bold", color: "#0096be" }}>
                  ₱
                  {data.bidAmount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              </Text>
              <Text>
                Listed on:{" "}
                {data && (
                  <Text style={{ fontWeight: "bold", color: "#0096be" }}>
                    {moment(data.createdAt.toDate()).calendar()}
                  </Text>
                )}
              </Text>
              <Text>
                Bidding ends in:{" "}
                <Text style={{ fontWeight: "bold", color: "#0096be" }}>
                  {data.bidTime}{" "}
                </Text>
              </Text>
            </View>
          )}

          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 5,
                fontSize: 13,
              }}
            >
              Product/Item Description
            </Text>
            <Text style={{ fontSize: 15, color: "gray" }}>
              {data.description}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Reviews", data);
              }}
              style={{
                backgroundColor: "#FFDF38",
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  marginBottom: 5,
                  fontSize: 15,
                  color: "white",
                  marginRight: 5,
                }}
              >
                See Reviews
              </Text>
              <MaterialIcons name="rate-review" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          onPress={() => setAddCart(true)}
          style={{
            position: "absolute",
            bottom: 10,
            right: 20,
            padding: 15,
            borderRadius: 100,
            backgroundColor: "#0096be",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data.sellType === "bidding" ? (
            <MaterialCommunityIcons name="gavel" size={24} color="white" />
          ) : (
            <FontAwesome name="cart-plus" size={24} color="white" />
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
