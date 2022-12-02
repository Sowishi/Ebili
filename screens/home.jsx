import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "../components/banner";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import Header from "../components/header";
import { FontAwesome } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import Loading from "../components/loading";

export default function Home({ navigation }) {
  const [itemDATA, setItemDATA] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState();

  const getProducts = async () => {
    setLoading(true);
    const res = await fetch("https://fakestoreapi.com/products");
    const json = await res.json();
    setItemDATA(json);
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => navigation.navigate("ViewItem", { ...item })}>
        <View
          style={{
            width: Dimensions.get("window").width * 0.47,
            height: Dimensions.get("window").width * 0.6,
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
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: "70%", height: "70%" }}
              resizeMode="contain"
            />
          </View>

          <View style={{ marginLeft: 10 }}>
            <Text
              numberOfLines={1}
              style={{ fontSize: 15, fontWeight: "bold" }}
            >
              {item.title}
            </Text>
            <Text style={{ color: "#4FBCDD", marginVertical: 2 }}>
              ₱{item.price}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <FontAwesome name="star" size={13} color="#E6E121" />
              <Text style={{ marginLeft: 5, fontWeight: "bold" }}>
                {item.rating.rate}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const onRefresh = () => {
    getProducts();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#f8f8f8", flex: 1 }}>
      {loading && <Loading />}
      <Header currentUser={auth} navigation={navigation} />

      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginVertical: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Today's Pick</Text>
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
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        initialNumToRender={10}
      />
    </SafeAreaView>
  );
}
