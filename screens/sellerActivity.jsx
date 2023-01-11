import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  BackHandler,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/header";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiviy } from "../redux/actions";
import moment from "moment/moment";
import Loading from "../components/loading";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function SellerActivity({ navigation }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.mainReducer);
  const { activities } = useSelector((state) => state.mainReducer);

  const [loading, setLoading] = useState(false);

  const getActivity = () => {
    setLoading(true);
    dispatch(fetchActiviy(currentUser.id));
    setLoading(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  const renderActivity = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.type === "review") {
            navigation.navigate("Reviews", item.item);
          } else if (item.type === "bid") {
            navigation.navigate("ViewItem", item.item);
          }
        }}
        style={{
          margin: 10,
          padding: 15,
          backgroundColor: "white",
          borderRadius: 20,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: item.user.photoUrl }}
              style={{ width: 50, height: 50, borderRadius: 100 }}
            />
            <View
              style={{
                backgroundColor: item.type === "review" ? "#FFDF38" : "green",
                position: "absolute",
                bottom: 0,
                right: 0,
                padding: 3,
                borderRadius: 100,
              }}
            >
              {item.type === "review" ? (
                <MaterialIcons name="rate-review" size={15} color="white" />
              ) : (
                <MaterialCommunityIcons name="gavel" size={15} color="white" />
              )}
            </View>
          </View>

          {item.type === "review" && (
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>
                  {item.user.firstName} {item.user.lastName}
                </Text>{" "}
                leave a{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {item.rate} star
                </Text>{" "}
                review on your item{" "}
                <Text style={{ color: "#4FBCDD", fontWeight: "bold" }}>
                  {" "}
                  {item.item.title}
                </Text>
              </Text>

              {item.createdAt && (
                <Text>{moment(item.createdAt.toDate()).calendar()}</Text>
              )}
            </View>
          )}

          {item.type === "bid" && (
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>
                  {item.user.firstName} {item.user.lastName}
                </Text>{" "}
                bid{" "}
                <Text style={{ color: "green", fontWeight: "bold" }}>
                  ₱
                  {item.bidAmount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                </Text>{" "}
                on your item{" "}
                <Text style={{ color: "#4FBCDD", fontWeight: "bold" }}>
                  {" "}
                  {item.item.title}
                </Text>
              </Text>

              {item.createdAt && (
                <Text>{moment(item.createdAt.toDate()).calendar()}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (activities === undefined) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header navigation={navigation} currentUser={currentUser} />

      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Seller Activities
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Sell")}
          style={{
            backgroundColor: "#4FBCDD",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", marginRight: 5 }}>Sell an item</Text>
          <MaterialCommunityIcons
            name="shape-square-rounded-plus"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getActivity} />
        }
        data={activities}
        keyExtractor={(item, index) => index}
        renderItem={renderActivity}
      />
    </SafeAreaView>
  );
}
