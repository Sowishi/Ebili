import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/header";
import SelectDropdown from "react-native-select-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { userCol, db, auth } from "../firebaseConfig";
import {
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
  collection,
  addDoc,
} from "firebase/firestore";

import * as ImagePicker from "expo-image-picker";
import { serverTimestamp } from "firebase/firestore";

export default function Sell({ navigation }) {
  const user = auth;

  const [productPhotoUrl, setProductPhotoUrl] = useState();
  const [category, setCategory] = useState();
  const [title, setTitle] = useState();
  const [bidTime, setBidTime] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();

  const [currentUser, setCurrentUser] = useState();
  const [disable, setDisable] = useState(false);

  const fetchUserData = () => {
    const q = query(userCol, where("id", "==", user.currentUser.uid));

    onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), docID: doc.id });
      });
      setCurrentUser(users[0]);
    });
  };

  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
    "other",
  ];

  const handleUploadPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0].uri;
      const imgRef = ref(storage, `product-photos/${img}`);

      const imgFetch = await fetch(img);
      const bytes = await imgFetch.blob();

      uploadBytes(imgRef, bytes).then(() => {
        getDownloadURL(imgRef).then((url) => {
          setProductPhotoUrl(url);
          showSuccessToast("Uploaded Successfully");
        });
      });
    }
  };

  const handleUploadItem = () => {
    setDisable(true);

    if (
      categories === undefined ||
      title === undefined ||
      bidTime === undefined ||
      price === undefined ||
      description === undefined ||
      productPhotoUrl === undefined
    ) {
      showErrorToast();
      setDisable(false);
    } else {
      const data = {
        category: category,
        title: title,
        bidTime: bidTime,
        price: price,
        description: description,
        productPhotoUrl: productPhotoUrl,
        createdAt: serverTimestamp(),
        owner: currentUser,
        currentBidder: "None",
        bidAmount: 0,
      };
      const productRef = collection(db, "products");
      addDoc(productRef, data)
        .then(() => {
          showSuccessToast("Your item is posted");
          setDisable(false);
        })
        .catch((e) => {
          console.log(e);
          setDisable(false);
        });
    }
  };

  const showSuccessToast = (text) => {
    Toast.show({
      type: "success",
      text1: text,
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "All fields must not be empty!",
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  console.log(disable);

  return (
    <SafeAreaView>
      <Header navigation={navigation} />
      <View
        style={{
          width: "100%",
          justifyContent: "flex-end",
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            handleUploadItem();
          }}
          disabled={disable}
        >
          <View
            style={{
              backgroundColor: "#4FBCDD",
              paddingHorizontal: 20,
              borderRadius: 5,
              paddingVertical: 5,
            }}
          >
            {disable ? (
              <ActivityIndicator color={"white"} size={"small"} />
            ) : (
              <Text
                style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
              >
                Post
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 16,
              color: "gray",
              marginBottom: 3,
            }}
          >
            Category
          </Text>
          <SelectDropdown
            buttonStyle={{
              backgroundColor: "#4FBCDD",
              width: "90%",
              borderRadius: 10,
              height: 40,
            }}
            buttonTextStyle={{ color: "white", fontWeight: "bold" }}
            data={categories}
            onSelect={(selectedItem, index) => {
              setCategory(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 16,
              color: "gray",
              marginBottom: 3,
            }}
          >
            What are you selling?
          </Text>
          <TextInput
            onChangeText={(text) => setTitle(text)}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#4FBCDD",
              width: "90%",
            }}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 16,
              color: "gray",
              marginBottom: 3,
            }}
          >
            Bid Time
          </Text>
          <SelectDropdown
            buttonStyle={{
              backgroundColor: "#4FBCDD",
              width: "90%",
              borderRadius: 10,
              height: 40,
            }}
            buttonTextStyle={{ color: "white", fontWeight: "bold" }}
            data={[
              "1 min",
              "5 min",
              "10min",
              "1 hour",
              "5 hours",
              "10 hours",
              "1 day",
            ]}
            onSelect={(selectedItem, index) => {
              setBidTime(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 16,
              color: "gray",
              marginBottom: 3,
            }}
          >
            Price (₱)
          </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={(text) => setPrice(text)}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#4FBCDD",
              width: "90%",
            }}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 16,
              color: "gray",
              marginBottom: 3,
            }}
          >
            Description
          </Text>
          <TextInput
            onChangeText={(text) => setDescription(text)}
            style={{
              borderWidth: 1,
              borderColor: "#4FBCDD",
              minHeight: 100,
              width: "90%",
              borderRadius: 10,
              textAlignVertical: "top",
              padding: 10,
            }}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <View
            style={{
              backgroundColor: productPhotoUrl ? "green" : "#4FBCDD",
              width: "90%",
              borderRadius: 10,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              disabled={productPhotoUrl ? true : false}
              onPress={handleUploadPhoto}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {productPhotoUrl ? (
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                >
                  Uploaded Successfully
                </Text>
              ) : (
                <>
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                  >
                    Add Photo
                  </Text>
                  <MaterialIcons
                    style={{ marginLeft: 5 }}
                    name="add-a-photo"
                    size={24}
                    color="white"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
            marginBottom: 200,
          }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 16,
              color: "gray",
            }}
          >
            Preview
          </Text>
          <Image
            resizeMode="contain"
            source={{ uri: productPhotoUrl }}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
