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
  ActivityIndicator,
} from "react-native";

import Header from "../components/header";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import Loading from "../components/loading";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Lato_100Thin,
  Lato_100Thin_Italic,
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,
} from "@expo-google-fonts/lato";

import { useFonts } from "expo-font";

export default function Home({ navigation }) {
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

  const [loaded] = useFonts({
    Lato_100Thin,
    Lato_100Thin_Italic,
    Lato_300Light,
    Lato_300Light_Italic,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
    Lato_700Bold_Italic,
    Lato_900Black,
    test: Lato_900Black_Italic,
    Lato: require("../assets/fonts/Lato-Regular.ttf"),
  });

  useEffect(() => {
    getProducts();
  }, []);

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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#4FBCDD", marginVertical: 2 }}>
                ₱{item.price}
              </Text>
              <View
                style={{
                  paddingRight: 5,
                  borderRightWidth: 2,
                  borderRightColor: "#4FBCDD",
                  marginRight: 5,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {item.sellType === "bidding" ? "Bidding" : "Retail"}
                </Text>
              </View>
            </View>

            <Text style={{ color: "gray", marginVertical: 2, fontSize: 10 }}>
              Seller: {item.owner.firstName + " " + item.owner.lastName}
            </Text>
            {item.createdAt && (
              <Text style={{ color: "gray", marginVertical: 2, fontSize: 10 }}>
                listed on: {item.createdAt.toDate().toDateString()}
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

  return (
    <SafeAreaView style={{ backgroundColor: "#f8f8f8", flex: 1 }}>
      {loaded && (
        <>
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
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 25,
                fontFamily: "Lato",
              }}
            >
              Today's Pick
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
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            initialNumToRender={10}
          />
        </>
      )}
    </SafeAreaView>
  );
}
