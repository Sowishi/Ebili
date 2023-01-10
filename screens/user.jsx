import {
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  FlatList,
  Dimensions,
  ImageBackground,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, userCol } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { updateDoc, doc, setDoc } from "firebase/firestore";

import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, getProducts } from "../redux/actions";
import { RefreshControl, TextInput } from "react-native-gesture-handler";

import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function User({ navigation, route }) {
  const user = auth;
  const otherUser = route.params;

  //Redux state
  const { currentUser } = useSelector((state) => state.mainReducer);
  const { products: itemDATA } = useSelector((state) => state.mainReducer);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [bio, setBio] = useState();
  const [showAboutModal, setShowAboutModal] = useState(false);

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Uploaded Successfully",
    });
  };

  const updateProfilePic = (url, docID) => {
    const docRef = doc(db, "users", docID);
    updateDoc(docRef, { photoUrl: url }).then(() => {
      dispatch(fetchUser(userCol, user));
      showSuccessToast();
    });
  };

  const handleUploadProfile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0].uri;
      const imgRef = ref(storage, `profile/${img}`);

      const imgFetch = await fetch(img);
      const bytes = await imgFetch.blob();

      uploadBytes(imgRef, bytes).then(() => {
        getDownloadURL(imgRef).then((url) => {
          updateProfilePic(url, currentUser.docID);
        });
      });
    }
  };

  const updateCover = (url, docID) => {
    const docRef = doc(db, "users", docID);
    setDoc(docRef, { ...currentUser, coverUrl: url }).then(() => {
      dispatch(fetchUser(userCol, user));
      showSuccessToast();
    });
  };

  const handleUploadCover = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0].uri;
      const imgRef = ref(storage, `cover/${img}`);

      const imgFetch = await fetch(img);
      const bytes = await imgFetch.blob();

      uploadBytes(imgRef, bytes).then(() => {
        getDownloadURL(imgRef).then((url) => {
          updateCover(url, currentUser.docID);
        });
      });
    }
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

  const userItem = itemDATA.filter((i) => {
    if (otherUser === undefined) {
      if (currentUser.id === i.owner.id) {
        return i;
      }
    } else {
      if (otherUser.id === i.owner.id) {
        return i;
      }
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

  const updateBio = () => {
    const docRef = doc(db, "users", currentUser.docID);
    setDoc(docRef, { ...currentUser, bio }).then(() => {
      dispatch(fetchUser(userCol, user));
      showSuccessToast();
      setShowAboutModal(false);
    });
  };

  const onRefresh = () => {
    dispatch(getProducts());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <ImageBackground
        source={{
          uri:
            otherUser === undefined ? currentUser.coverUrl : otherUser.coverUrl,
        }}
        style={{
          backgroundColor: "#4FBCDD",
          width: "100%",
          minHeight: 150,
          justifyContent: "flex-end",
          alignItems: "center",
          position: "relative",
        }}
      >
        {otherUser === undefined && (
          <TouchableOpacity
            onPress={handleUploadCover}
            style={{
              position: "absolute",
              right: 1,
              bottom: 1,
              backgroundColor: "#4FBCDD",
              padding: 7,
              borderRadius: 100,
            }}
          >
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        )}

        <View>
          {currentUser ? (
            <View style={{ position: "relative" }}>
              <Image
                source={{
                  uri: otherUser ? otherUser.photoUrl : currentUser.photoUrl,
                }}
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 100,
                  marginBottom: -40,
                }}
              />
              {otherUser === undefined && (
                <TouchableOpacity
                  onPress={handleUploadProfile}
                  style={{
                    backgroundColor: "#4FBCDD",
                    position: "absolute",
                    padding: 7,
                    borderRadius: 100,
                    bottom: -40,
                    right: 0,
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera-plus-outline"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </ImageBackground>
      <View style={{ marginTop: 45 }}>
        <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
          {currentUser ? (
            otherUser ? (
              otherUser.firstName + " " + otherUser.lastName
            ) : (
              currentUser.firstName + " " + currentUser.lastName
            )
          ) : (
            <ActivityIndicator />
          )}
        </Text>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {(otherUser || currentUser) && (
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                color: "gray",
                fontSize: 15,
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {otherUser === undefined ? currentUser.bio : otherUser.bio}
            </Text>
          )}

          {otherUser === undefined && (
            <TouchableOpacity
              onPress={() => setShowAboutModal(true)}
              style={{
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: "#4FBCDD",
                paddingVertical: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 15,
                  marginRight: 5,
                }}
              >
                Update Info
              </Text>
              <Ionicons name="ios-information-circle" size={17} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {otherUser && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Chat", { otherUser })}
            >
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 10,
                  marginTop: 5,
                  backgroundColor: "#4FBCDD",
                  color: "white",
                  fontSize: 20,
                }}
              >
                Message
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: userItem.length <= 2 ? "flex-start" : "center",
          marginTop: 10,
        }}
      >
        <View></View>
        {userItem.length >= 1 ? (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-start",
                  fontSize: 18,
                  marginLeft: 15,
                  marginRight: 5,
                }}
              >
                {otherUser === undefined ? "Your Items" : "Seller Items"}
              </Text>
              <MaterialCommunityIcons
                name="shape-square-rounded-plus"
                size={24}
                color="black"
              />
            </View>

            <FlatList
              contentContainerStyle={{ paddingBottom: 300 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={userItem}
              numColumns={3}
              renderItem={renderItem}
              keyExtractor={(item, index) => index}
              initialNumToRender={10}
            />
          </>
        ) : (
          <View
            style={{
              height: "50%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "gray", fontSize: 20, marginBottom: 5 }}>
              No item posted yet
            </Text>

            <Entypo name="shopping-cart" size={24} color="gray" />
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAboutModal}
        onRequestClose={() => {
          setShowAboutModal(!showAboutModal);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000099",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: "80%",
              width: "100%",
              backgroundColor: "white",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  First Name
                </Text>
                <TextInput
                  value={currentUser.firstName}
                  onChangeText={(text) => setRegion(text)}
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                  editable={false}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  Last Name
                </Text>
                <TextInput
                  value={currentUser.lastName}
                  editable={false}
                  onChangeText={(text) => setProvince(text)}
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  Email
                </Text>
                <TextInput
                  onChangeText={(text) => setCity(text)}
                  value={auth.currentUser.email}
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                  editable={false}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                  }}
                >
                  Bio
                </Text>
                <TextInput
                  onChangeText={(text) => setBio(text)}
                  placeholder={currentUser.bio}
                  style={{
                    borderBottomWidth: 2,
                    width: "90%",
                    borderBottomColor: "#4FBCDD",
                  }}
                />
              </View>

              <View>
                <TouchableOpacity
                  onPress={updateBio}
                  style={{
                    backgroundColor: "#4FBCDD",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>UPDATE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
