import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
export default function ViewALl({ route, navigation }) {
  const data = route.params;

  const categoryDATA = [
    "all",
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
    "other",
  ];
  const [selectedCategory, setSelectedCategory] = useState("all");

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => navigation.navigate("ViewItem", { ...item })}>
        <View
          style={{
            width: Dimensions.get("window").width * 0.47,
            height: Dimensions.get("window").width * 0.7,
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
              flex: 2,
            }}
          >
            <Image
              source={{ uri: item.productPhotoUrl }}
              style={{ width: "80%", height: "80%", borderRadius: 10 }}
              resizeMode="contain"
            />
          </View>

          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{ fontSize: 15, fontWeight: "bold" }}
            >
              {item.title}
            </Text>
            <Text style={{ color: "#4FBCDD", marginVertical: 2 }}>
              ₱{item.price}
            </Text>
            <Text style={{ color: "gray", marginVertical: 2, fontSize: 10 }}>
              Seller: {item.owner.firstName + " " + item.owner.lastName}
            </Text>
            <Text style={{ color: "gray", marginVertical: 2, fontSize: 10 }}>
              listed on: {item.createdAt.toDate().toDateString()}
            </Text>
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
            {/* Upper Case first letter of the string */}
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
        </View>
      </Pressable>
    );
  };

  let itemDataFiltered = [...data.itemDATA];

  if (selectedCategory !== "all") {
    itemDataFiltered = data.itemDATA.filter((i) => {
      if (i.category === selectedCategory) {
        return i;
      }
    });
  }

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
      <View style={{ height: "90%", width: "100%" }}>
        <FlatList
          data={itemDataFiltered}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
        />
      </View>
    </SafeAreaView>
  );
}
