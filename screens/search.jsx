import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import AuthTextInput from "../components/AuthTextInput";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Search({ navigation }) {
  const [itemDATA, setItemDATA] = useState([]);
  const [search, setSearch] = useState();
  const [refreshing, setRefreshing] = useState();

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
  }, []);

  const onRefresh = () => {
    getProducts();
  };

  const queriedData = itemDATA.filter((i) => {
    if (i.title.startsWith(search)) {
      return i;
    }
  });

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

            <Text style={{ color: "black", marginVertical: 2, fontSize: 7 }}>
              Seller:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {item.owner.firstName + " " + item.owner.lastName}
              </Text>
            </Text>
            {item.createdAt && (
              <Text style={{ color: "black", marginVertical: 2, fontSize: 7 }}>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#4FBCDD" }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <AuthTextInput
          onChange={(text) => setSearch(text)}
          style={{
            marginVertical: 15,
            borderWidth: 1,
            backgroundColor: "white",
          }}
          placeHolder="Search something..."
          entypoIconName="magnifying-glass"
          secured={false}
        />
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={queriedData}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        initialNumToRender={10}
      />
    </SafeAreaView>
  );
}
