import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "../components/banner";
import { Entypo } from "@expo/vector-icons";
import { View, Text, FlatList, Dimensions, Image } from "react-native";

import Header from "../components/header";

export default function Home() {
  const CategoryDATA = [
    {
      title: "All",
      icon: "menu",
    },
    {
      title: "Footwear",
      icon: "app-store",
    },
    {
      title: "Mens",
      icon: "beamed-note",
    },
    {
      title: "Footwear",
      icon: "menu",
    },
    {
      title: "Mens",
      icon: "menu",
    },
    {
      title: "Mens",
      icon: "menu",
    },
    {
      title: "Footwear",
      icon: "menu",
    },
    {
      title: "Mens",
      icon: "menu",
    },
  ];

  const ItemDATA = [
    { image: require("../assets/Nike.png"), title: "Nike", price: 1231 },
    { image: require("../assets/aqua.png"), title: "Aqua", price: 323 },
    { image: require("../assets/Nike.png"), title: "Nike", price: 1231 },
    { image: require("../assets/Nike.png"), title: "Nike", price: 1231 },
    { image: require("../assets/Nike.png"), title: "Nike", price: 1231 },
    { image: require("../assets/Nike.png"), title: "Nike", price: 1231 },
  ];

  const renderCategory = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          marginHorizontal: 5,
          borderRadius: 10,
        }}
      >
        <Entypo name={item.icon} size={24} color="#FF7B7D" />
        <Text style={{ fontSize: "bold", color: "#FF7B7D", fontSize: 15 }}>
          {item.title}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.47,
          height: Dimensions.get("window").width * 0.47,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 5,
          margin: 5,
        }}
      >
        <Image source={item.image} style={{ width: "70%", height: "70%" }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.title}</Text>
          <Text style={{ color: "#FF7B7D" }}>₱{item.price}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#f8f8f8", flex: 1 }}>
      <Header />
      <Banner />

      <View style={{ marginVertical: 10 }}>
        <FlatList
          horizontal={true}
          data={CategoryDATA}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
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
        <Text style={{ fontSize: 13, color: "gray" }}>View All</Text>
      </View>

      <FlatList
        data={ItemDATA}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
