import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Loading from "../components/loading";

import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useSelector } from "react-redux";

export default function OrderPending() {
  const { currentUser } = useSelector((state) => state.mainReducer);
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    const orderRef = collection(db, "orders");

    onSnapshot(orderRef, (snapshot) => {
      const orders = [];
      snapshot.docs.forEach((doc) => {
        orders.push({ ...doc.data(), id: doc.id });
      });
      setOrders(orders);
    });
  };

  const handleApprove = (item) => {
    const orderDoc = doc(db, "orders", item.id);
    updateDoc(orderDoc, {
      orderStatus: "processing",
    }).then(() => {
      Toast.show({
        type: "success",
        text1: "Success!",
      });
    });
  };

  const handleReject = (item) => {
    const orderDoc = doc(db, "orders", item.id);
    deleteDoc(orderDoc).then(() => {
      Toast.show({
        type: "success",
        text1: "Success!",
      });
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const ordersFiltered = orders.filter((i) => {
    if (i.owner.id === currentUser.id) {
      return i;
    }
  });

  const pendingOrders = ordersFiltered.filter((i) => {
    if (i.orderStatus === "pending") {
      return i;
    }
  });

  const adminPendingOrders = orders.filter((i) => {
    if (i.orderStatus === "pending") {
      return i;
    }
  });

  if (ordersFiltered === undefined) {
    return <Loading />;
  }

  if (currentUser) {
    if (ordersFiltered.length === 0 && currentUser.role !== "admin") {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "gray", fontSize: 25 }}>
            You don't have any orders
          </Text>
        </View>
      );
    }
  }

  const renderOrder = ({ item }) => {
    const renderProduct = ({ item }) => {
      return (
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginHorizontal: 2 }}>₱{item.product.price}</Text>

            <Text style={{ marginHorizontal: 2 }}>{item.product.title}</Text>
            <Text style={{ marginHorizontal: 4 }}>x{item.quantity}</Text>
          </View>
        </View>
      );
    };

    return (
      <View
        style={{ backgroundColor: "white", padding: 10, marginVertical: 5 }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Order Details
          </Text>
          <View>
            <Text>
              Customer:{" "}
              <Text style={{ color: "#CC0000" }}>
                {item.owner.firstName + " " + item.owner.lastName}
              </Text>
            </Text>
            <Text>
              Address:{" "}
              <Text style={{ color: "#CC0000" }}>{item.owner.address}</Text>
            </Text>

            <Text>
              Payment Method:{" "}
              <Text style={{ color: "#CC0000" }}>
                {item.paymentMethod === "cod" ? "Cash on Delivery" : "Loading"}
              </Text>
            </Text>
            <Text>
              Order Request{" "}
              <Text style={{ color: "#CC0000" }}>{item.orderRequest}</Text>
            </Text>
          </View>
        </View>
        <FlatList
          data={item.products}
          keyExtractor={(item, index) => index}
          renderItem={renderProduct}
        />
        <View
          style={{
            marginVertical: 5,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#CC0000", fontWeight: "bold" }}>
            <Text style={{ color: "gray" }}>Total Price: </Text>₱
            {item.totalPrice}
          </Text>
          <Text>
            Order Status: {"  "}
            <Text style={{ color: "#CC0000", marginLeft: 5 }}>
              {item.orderStatus === "pending" ? "Pending" : "Loading"}
            </Text>
          </Text>
        </View>

        {currentUser.role === "admin" && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => handleReject(item)}
              style={{
                backgroundColor: "#CC0000",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Reject Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleApprove(item)}
              style={{
                backgroundColor: "green",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Process Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      {currentUser && (
        <FlatList
          data={
            currentUser.role === "admin" ? adminPendingOrders : pendingOrders
          }
          keyExtractor={(item, index) => index}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}
