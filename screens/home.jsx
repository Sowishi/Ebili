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

export default function Home({ navigation }) {
  const [itemDATA, setItemDATA] = useState([]);
  const [categoryDATA, setCategoryDATA] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const getProducts = async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    const json = await res.json();
    setItemDATA(json);
  };

  const getCategory = async () => {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    const json = await res.json();
    setCategoryDATA(["all", ...json]);
  };

  let itemDataFiltered = [...itemDATA];

  if (selectedCategory !== "all") {
    itemDataFiltered = itemDATA.filter((i) => {
      if (i.category === selectedCategory) {
        return i;
      }
    });
  }

  useEffect(() => {
    getProducts();
    getCategory();
  }, []);

  const renderCategory = ({ item }) => {
    return (
      <Pressable onPress={() => setSelectedCategory(item)}>
        <View
          style={{
            backgroundColor: `${
              selectedCategory === item ? "#4FBCDD" : "white"
            }`,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            marginHorizontal: 5,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: "bold",
              color: `${selectedCategory === item ? "white" : "#4FBCDD"}`,
              fontSize: 15,
            }}
          >
            {item}
          </Text>
        </View>
      </Pressable>
    );
  };

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
    getCategory();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#f8f8f8", flex: 1 }}>
      <Header currentUser={auth} navigation={navigation} />
      <Banner />

      <View style={{ marginVertical: 10 }}>
        <FlatList
          horizontal={true}
          data={categoryDATA}
          renderItem={renderCategory}
          keyExtractor={(item, index) => index}
        />
      </View>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginVertical: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Popular</Text>
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
        data={itemDataFiltered}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
      />
    </SafeAreaView>
  );
}
