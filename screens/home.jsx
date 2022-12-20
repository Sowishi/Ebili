import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import Header from "../components/header";
import { auth, db, userCol } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

//Redux
import { useSelector, useDispatch } from "react-redux";
import { Store } from "../redux/store";
import { fetchUser } from "../redux/actions";
import Loading from "../components/loading";

export default function Home({ navigation }) {
  const user = auth;

  //Redux state

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.mainReducer);

  //State

  const [itemDATA, setItemDATA] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState();

  const getProducts = async () => {
    const productsRef = collection(db, "products");
    onSnapshot(productsRef, (snapshot) => {
      const products = [];
      snapshot.docs.forEach((doc) => {
        products.push({ ...doc.data(), docID: doc.id });
      });
      setItemDATA(products);
    });
  };

  useEffect(() => {
    getProducts();
    dispatch(fetchUser(userCol, user));
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => navigation.navigate("ViewItem", { ...item })}>
        <View
          style={{
            width: Dimensions.get("window").width * 0.3,
            minHeight: Dimensions.get("window").width * 0.5,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 5,
            margin: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,

            elevation: 2,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 100,
            }}
          >
            <Image
              source={{ uri: item.productPhotoUrl }}
              style={{ width: "90%", height: "90%", borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>

          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{ fontSize: 13, fontWeight: "bold" }}
            >
              {item.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#0096be", marginVertical: 2, fontSize: 10 }}
              >
                ₱{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
              <View
                style={{
                  paddingRight: 5,
                  marginRight: 5,
                }}
              >
                <View
                  style={{
                    paddingVertical: 3,
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    backgroundColor:
                      item.sellType === "bidding" ? "#0096be" : "#EFB701",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 7,
                      color: "white",
                    }}
                  >
                    {item.sellType === "bidding" ? "Bidding" : "Retail"}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={{ color: "gray", marginVertical: 2, fontSize: 7 }}>
              Seller:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {item.owner.firstName + " " + item.owner.lastName}
              </Text>
            </Text>
            {item.createdAt && (
              <Text style={{ color: "gray", marginVertical: 2, fontSize: 7 }}>
                Listed:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {item.createdAt.toDate().toDateString()}
                </Text>
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const onRefresh = () => {
    getProducts();
  };

  if (Object.keys(currentUser).length === 0) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#f8f8f8", flex: 1 }}>
      <Header currentUser={currentUser} navigation={navigation} />

      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          Marketplace
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("ViewAll", { itemDATA })}
        >
          <Text style={{ fontSize: 13, color: "gray" }}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={itemDATA}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        initialNumToRender={10}
      />
    </SafeAreaView>
  );
}
