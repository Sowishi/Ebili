import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Loading from "../components/loading";
import { AntDesign } from "@expo/vector-icons";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useSelector } from "react-redux";

export default function Reviews({ route }) {
  const data = route.params;

  const { currentUser } = useSelector((state) => state.mainReducer);

  const [heart, setHeart] = useState();
  const [text, setText] = useState();
  const [reviews, setReviews] = useState();

  const handleReviewSend = () => {
    if (text === undefined) {
      showErrorToast("Please input your message");
    } else if (heart === undefined) {
      showErrorToast("Please leave a rating");
    } else {
      const productDoc = doc(db, "products", data.docID);
      const reviewsRef = collection(productDoc, "reviews");
      addDoc(reviewsRef, {
        user: currentUser,
        text: text,
        rate: heart,
      })
        .then(() => {
          showSuccessToast("Thank you for your review!");
        })
        .catch((e) => {
          showErrorToast(e.code);
        });
    }
  };

  const fetchReviews = () => {
    const productDoc = doc(db, "products", data.docID);
    const reviewsRef = collection(productDoc, "reviews");

    onSnapshot(reviewsRef, (snapshot) => {
      const reviews = [];
      snapshot.docs.forEach((doc) => {
        reviews.push({ ...doc.data(), docID: doc.id });
      });
      setReviews(reviews);
    });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (!currentUser) {
    return <Loading />;
  }

  const showSuccessToast = (text) => {
    Toast.show({
      type: "success",
      text1: text,
    });
  };

  const showErrorToast = (text) => {
    Toast.show({
      type: "error",
      text1: text,
    });
  };

  const renderReview = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
          marginHorizontal: 15,
        }}
      >
        <Image
          style={{ width: 50, height: 50, borderRadius: 100 }}
          source={{ uri: item.user.photoUrl }}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            flex: 1,
            marginLeft: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {item.user.firstName + " " + item.user.lastName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <AntDesign
              style={{ marginHorizontal: 5 }}
              name="heart"
              size={10}
              color={item.rate >= 1 ? "#F70000" : "white"}
            />
            <AntDesign
              style={{ marginHorizontal: 5 }}
              name="heart"
              size={10}
              color={item.rate >= 2 ? "#F70000" : "white"}
            />
            <AntDesign
              style={{ marginHorizontal: 5 }}
              name="heart"
              size={10}
              color={item.rate >= 3 ? "#F70000" : "white"}
            />
            <AntDesign
              style={{ marginHorizontal: 5 }}
              name="heart"
              size={10}
              color={item.rate >= 4 ? "#F70000" : "white"}
            />
            <AntDesign
              style={{ marginHorizontal: 5 }}
              name="heart"
              size={10}
              color={item.rate >= 5 ? "#F70000" : "white"}
            />
          </View>
          <Text>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {reviews && reviews.length <= 0 && (
        <View style={{ backgroundColor: "white" }}>
          <Text style={{ marginTop: 20, fontSize: 20, textAlign: "center" }}>
            This item don't have a review yet
          </Text>
        </View>
      )}

      {reviews ? (
        <View style={{ flex: 4, backgroundColor: "white" }}>
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item, index) => index}
          />
        </View>
      ) : (
        <Loading />
      )}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginHorizontal: 20,
          }}
        >
          <Image
            style={{ width: 50, height: 50, borderRadius: 100 }}
            source={{ uri: currentUser.photoUrl }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              onChangeText={(text) => setText(text)}
              placeholder="Leave a review..."
              style={{
                borderBottomWidth: 2,
                borderBottomColor: "#4FBCDD",
                flex: 1,
                marginHorizontal: 20,
              }}
            />
            <TouchableOpacity
              onPress={handleReviewSend}
              style={{
                backgroundColor: "#4FBCDD",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity onPress={() => setHeart(1)}>
            <AntDesign
              name="heart"
              size={24}
              color={heart >= 1 ? "#F70000" : "#4FBCDD"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHeart(2)}>
            <AntDesign
              name="heart"
              size={24}
              color={heart >= 2 ? "#F70000" : "#4FBCDD"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHeart(3)}>
            <AntDesign
              name="heart"
              size={24}
              color={heart >= 3 ? "#F70000" : "#4FBCDD"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHeart(4)}>
            <AntDesign
              name="heart"
              size={24}
              color={heart >= 4 ? "#F70000" : "#4FBCDD"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHeart(5)}>
            <AntDesign
              name="heart"
              size={24}
              color={heart >= 5 ? "#F70000" : "#4FBCDD"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
