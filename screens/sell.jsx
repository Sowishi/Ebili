import { View, Text, TextInput, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/header";
import SelectDropdown from "react-native-select-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import * as ImagePicker from "expo-image-picker";

export default function Sell({ navigation }) {
  const [productPhotoUrl, setProductPhotoUrl] = useState();

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
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const img = result.assets[0].uri;
      const imgRef = ref(storage, `product-photos/${img}`);

      const imgFetch = await fetch(img);
      const bytes = await imgFetch.blob();

      uploadBytes(imgRef, bytes).then(() => {
        getDownloadURL(imgRef).then((url) => {
          setProductPhotoUrl(url);
          showSuccessToast();
        });
      });
    }
  };

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Uploaded Successfully",
    });
  };

  return (
    <SafeAreaView>
      <Header navigation={navigation} />
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
              console.log(selectedItem, index);
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
            data={categories}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
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
        {productPhotoUrl && (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
