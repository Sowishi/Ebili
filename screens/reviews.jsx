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
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Loading from "../components/loading";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useSelector } from "react-redux";

import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import * as ImagePicker from "expo-image-picker";

import moment from "moment";

export default function Reviews({ route }) {
  const data = route.params;

  const { currentUser } = useSelector((state) => state.mainReducer);

  const [heart, setHeart] = useState();
  const [text, setText] = useState();
  const [reviews, setReviews] = useState();
  const [photoUrl, setPhotoUrl] = useState();
  const [selectedHeart, setSelectedHeartt] = useState("all");

  const handleReviewSend = () => {
    if (text === undefined) {
      showErrorToast("Please input your message");
    } else if (heart === undefined) {
      showErrorToast("Please leave a rating");
    } else {
      const productDoc = doc(db, "products", data.docID);
      const reviewsRef = collection(productDoc, "reviews");
      const activityRef = collection(db, "activities");

      addDoc(reviewsRef, {
        user: currentUser,
        text: text,
        rate: heart,
        photoUrl: photoUrl === undefined ? "" : photoUrl,
        createdAt: serverTimestamp(),
      })
        .then(() => {
          addDoc(activityRef, {
            text: text,
            rate: heart,
            item: data,
            ownerID: data.owner.id,
            owner: data.owner,
            user: currentUser,
            createdAt: serverTimestamp(),
            type: "review",
          });
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
          alignItems: "flex-start",
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.user.firstName + " " + item.user.lastName}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                color: "gray",
                marginLeft: 5,
                fontSize: 10,
              }}
            >
              {/* {item.createdAt !== undefined &&
                item.createdAt !== null &&
                item.createdAt.toDate().toDateString()} */}

              {item.createdAt !== undefined &&
                item.createdAt !== null &&
                moment(item.createdAt.toDate()).calendar()}
            </Text>
          </View>

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
          {item.photoUrl && (
            <Image
              source={{ uri: item.photoUrl }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
    );
  };

  let filteredReviews = [];
  if (reviews !== undefined) {
    filteredReviews = reviews.filter((i) => {
      if (i.rate === selectedHeart) {
        return i;
      }
    });
  }

  const handleUploadPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,

      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0].uri;
      const imgRef = ref(storage, `reviews/${img}`);

      const imgFetch = await fetch(img);
      const bytes = await imgFetch.blob();

      uploadBytes(imgRef, bytes).then(() => {
        getDownloadURL(imgRef).then((url) => {
          setPhotoUrl(url);
        });
      });
    }
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
          {reviews.length >= 1 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 3,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor:
                    selectedHeart === "all" ? "#4FBCDD" : "#f8f8f8",
                }}
                onPress={() => setSelectedHeartt("all")}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: selectedHeart === "all" ? "white" : "black",
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",

                  paddingVertical: 3,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor: selectedHeart === 1 ? "#4FBCDD" : "#f8f8f8",
                }}
                onPress={() => setSelectedHeartt(1)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: selectedHeart === 1 ? "white" : "black",
                  }}
                >
                  1
                </Text>
                <AntDesign
                  style={{ marginHorizontal: 5 }}
                  name="heart"
                  size={15}
                  color="#F70000"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",

                  paddingVertical: 3,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor: selectedHeart === 2 ? "#4FBCDD" : "#f8f8f8",
                }}
                onPress={() => setSelectedHeartt(2)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: selectedHeart === 2 ? "white" : "black",
                  }}
                >
                  2
                </Text>
                <AntDesign
                  style={{ marginHorizontal: 5 }}
                  name="heart"
                  size={15}
                  color="#F70000"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",

                  paddingVertical: 3,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor: selectedHeart === 3 ? "#4FBCDD" : "#f8f8f8",
                }}
                onPress={() => setSelectedHeartt(3)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: selectedHeart === 3 ? "white" : "black",
                  }}
                >
                  3
                </Text>
                <AntDesign
                  style={{ marginHorizontal: 5 }}
                  name="heart"
                  size={15}
                  color="#F70000"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",

                  paddingVertical: 3,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor: selectedHeart === 4 ? "#4FBCDD" : "#f8f8f8",
                }}
                onPress={() => setSelectedHeartt(4)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: selectedHeart === 4 ? "white" : "black",
                  }}
                >
                  4
                </Text>
                <AntDesign
                  style={{ marginHorizontal: 5 }}
                  name="heart"
                  size={15}
                  color="#F70000"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",

                  paddingVertical: 3,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor: selectedHeart === 5 ? "#4FBCDD" : "#f8f8f8",
                }}
                onPress={() => setSelectedHeartt(5)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: selectedHeart === 5 ? "white" : "black",
                  }}
                >
                  5
                </Text>
                <AntDesign
                  style={{ marginHorizontal: 5 }}
                  name="heart"
                  size={15}
                  color="#F70000"
                />
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={selectedHeart === "all" ? reviews : filteredReviews}
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
          minHeight: 60,
          paddingVertical: 20,
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
              onPress={handleUploadPhoto}
              style={{
                backgroundColor: "black",
                padding: 5,
                marginRight: 5,
                borderRadius: 100,
              }}
            >
              <AntDesign name="camera" size={20} color="white" />
            </TouchableOpacity>
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
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {photoUrl && (
            <Image
              source={{ uri: photoUrl }}
              style={{
                width: 50,
                height: 50,
                marginLeft: 20,
                marginVertical: 5,
              }}
            />
          )}
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
