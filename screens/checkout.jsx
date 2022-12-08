import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Checkout({ navigation, route }) {
  const { toCheckout: productToCheckout } = route.params;
  const currentUser = productToCheckout[0].owner;
  const totalPrice = route.params.total;

  const [paymentMethod, setPaymentMethod] = useState();
  const [orderRequest, setOrderRequest] = useState();
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [region, setRegion] = useState();
  const [province, setProvince] = useState();
  const [city, setCity] = useState();
  const [barrangay, setBarrangay] = useState();
  const [pruok, setPruok] = useState();
  const [address, setAddress] = useState();

  const handleSubmitAddress = () => {
    if (
      region === undefined ||
      province === undefined ||
      city === undefined ||
      barrangay === undefined ||
      pruok === undefined
    ) {
      showErrorToast("All fields must not be empty");
    } else {
      const output =
        pruok + " " + barrangay + " " + city + " " + province + " " + region;
      setProvince(undefined);
      setCity(undefined);
      setBarrangay(undefined);
      setPruok(undefined);

      const userDoc = doc(db, "users", currentUser.docID);
      setDoc(
        userDoc,
        {
          address: output,
        },
        { merge: true }
      ).then(() => {
        showSuccessToast("Setup address successfully");
        setAddress(output);
        setShowAddressModal(false);
        s;
      });
    }
  };

  const MailDesign = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View
          style={{ height: 7, width: 15, backgroundColor: "#C41440" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#008AAC" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#C41440" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#008AAC" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#C41440" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#008AAC" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#C41440" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#008AAC" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#C41440" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#008AAC" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#C41440" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
        <View
          style={{ height: 7, width: 15, backgroundColor: "#008AAC" }}
        ></View>
        <View style={{ height: 7, width: 15, backgroundColor: "white" }}></View>
      </View>
    );
  };

  const handleConfirmOrder = () => {
    if (paymentMethod === undefined) {
      showErrorToast("Please select a payment method");
    } else if (paymentMethod === "card") {
      showErrorToast("Payment Method: Credit/Debit Card will coming soon");
    } else if (paymentMethod === "gcash") {
      showErrorToast("Payment Method: Gcash will coming soon");
    } else {
      const ordersRef = collection(db, "orders");
      addDoc(ordersRef, {
        owner: currentUser,
        paymentMethod: paymentMethod,
        products: productToCheckout,
        orderStatus: "pending",
        totalPrice: totalPrice,
      }).then(() => {
        navigation.replace("OrderConfirmed");
      });
    }
  };

  const showSuccessToast = (text) => {
    Toast.show({
      type: "success",
      text1: text,
    });
  };

  const showErrorToast = (text) => {
    Toast.show({
      type: "error",
      text1: text,
    });
  };

  const renderProductToCheckout = ({ item }) => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: "90%",
            minHeight: 100,
            flexDirection: "column",
            padding: 10,
            marginVertical: 5,
            backgroundColor: "white",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: item.product.productPhotoUrl }}
              style={{ width: 70, height: 70, marginHorizontal: 5 }}
              resizeMode="contain"
            />
            <View style={{ width: "50%", marginHorizontal: 5 }}>
              <Text numberOfLines={2}>{item.product.title}</Text>
            </View>
            <View>
              <Text style={{ color: "#4FBCDD", fontWeight: "bold" }}>
                ₱{item.product.price}
              </Text>
              <Text style={{ color: "gray", fontWeight: "bold" }}>
                x{item.quantity}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 5,
            }}
          ></View>
        </View>
      </View>
    );
  };

  console.log(currentUser, "udfsd");

  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddressModal}
        onRequestClose={() => {
          setShowAddressModal(!showAddressModal);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000099",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: "80%",
              width: "100%",
              backgroundColor: "white",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  Region
                </Text>
                <TextInput
                  onChangeText={(text) => setRegion(text)}
                  placeholder="eg: Metro Manila"
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  Province
                </Text>
                <TextInput
                  onChangeText={(text) => setProvince(text)}
                  placeholder="eg: Camarines Norte"
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  City
                </Text>
                <TextInput
                  onChangeText={(text) => setCity(text)}
                  placeholder="eg: Daet"
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  Barrangay
                </Text>
                <TextInput
                  onChangeText={(text) => setBarrangay(text)}
                  placeholder="eg: Pamorangon"
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  Street Number / Purok
                </Text>
                <TextInput
                  onChangeText={(text) => setPruok(text)}
                  placeholder="eg: Purok-3"
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                />
              </View>
              <View>
                <TouchableOpacity
                  onPress={handleSubmitAddress}
                  style={{
                    backgroundColor: "#4FBCDD",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>Add Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ backgroundColor: "#f8f8f8", padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "flex-start",
            marginBottom: 5,
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="map-pin" size={15} color="#4FBCDD" />
            <Text style={{ fontSize: 15, color: "#4FBCDD" }}>
              Delivery Address
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowAddressModal(true)}
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              backgroundColor: "#4FBCDD",
              borderRadius: 2,
              marginVertical: 5,
              marginRight: 5,
            }}
          >
            <Text style={{ color: "white" }}>Add address</Text>
          </TouchableOpacity>
        </View>
        <View>
          {currentUser.address === undefined && address === undefined ? (
            <Text style={{ color: "gray", fontSize: 16, textAlign: "center" }}>
              You currently don't have address, add one!
            </Text>
          ) : (
            <Text style={{ color: "gray", fontSize: 16, textAlign: "center" }}>
              {currentUser.address}
            </Text>
          )}
          {address && (
            <Text style={{ color: "gray", fontSize: 16, textAlign: "center" }}>
              {address}
            </Text>
          )}
        </View>
      </View>

      <MailDesign />

      <Text style={{ fontSize: 25, fontWeight: "bold", marginLeft: 5 }}>
        Orders
      </Text>
      {productToCheckout && (
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{
            height: "35%",
            paddingVertical: 10,

            backgroundColor: "#4FBCDD",
          }}
          data={productToCheckout}
          renderItem={renderProductToCheckout}
          keyExtractor={(item, index) => index}
        />
      )}
      <ScrollView>
        <View style={{ marginLeft: 10, marginTop: 10 }}>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            Payment Method
          </Text>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Checkbox
                value={paymentMethod === "cod" ? true : false}
                onValueChange={() => setPaymentMethod("cod")}
                color={paymentMethod === "cod" ? "#4FBCDD" : undefined}
              />
              <Text style={{ marginLeft: 5 }}>Cash on Delivery</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Checkbox
                value={paymentMethod === "gcash" ? true : false}
                onValueChange={() => setPaymentMethod("gcash")}
                color={paymentMethod === "gcash" ? "#4FBCDD" : undefined}
              />
              <Text style={{ marginLeft: 5 }}>
                Gcash <Text style={{ color: "gray" }}>(Coming soon)</Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Checkbox
                value={paymentMethod === "card" ? true : false}
                onValueChange={() => setPaymentMethod("card")}
                color={paymentMethod === "card" ? "#4FBCDD" : undefined}
              />
              <Text style={{ marginLeft: 5 }}>
                Credit/Debit Card{" "}
                <Text style={{ color: "gray" }}>(Coming soon)</Text>
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text>
              Total Price:{" "}
              <Text style={{ fontWeight: "bold", color: "#4FBCDD" }}>
                ₱{totalPrice}
              </Text>
            </Text>
            <TouchableOpacity
              onPress={handleConfirmOrder}
              style={{
                backgroundColor: "#4FBCDD",
                paddingVertical: 5,
                paddingHorizontal: 10,
                margin: 10,
              }}
            >
              <Text style={{ color: "white" }}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
