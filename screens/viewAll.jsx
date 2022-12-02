import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../components/header";

import { SafeAreaView } from "react-native-safe-area-context";
export default function ViewALl({ route, navigation }) {
  const data = route.params;

  const [categoryDATA, setCategoryDATA] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const getCategory = async () => {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    const json = await res.json();
    setCategoryDATA(["all", ...json]);
  };

  let itemDataFiltered = [...data.itemDATA];

  if (selectedCategory !== "all") {
    itemDataFiltered = data.itemDATA.filter((i) => {
      if (i.category === selectedCategory) {
        return i;
      }
    });
  }

  console.log(categoryDATA);

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8f8f8",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <Header navigation={navigation} /> */}
      <FlatList
        style={{ marginVertical: 10 }}
        horizontal={true}
        data={categoryDATA}
        renderItem={renderCategory}
        keyExtractor={(item, index) => index}
      />

      <FlatList
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
