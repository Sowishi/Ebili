import { View, Text, FlatList, Image, Button, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";

export default function Cart() {
  const [selectAll, setSelectAll] = useState(false);

  const [cart, setCart] = useState([
    {
      id: 1,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating: {
        rate: 3.9,
        count: 120,
      },
      quantity: 1,
    },
    {
      id: 2,
      title: "Mens Casual Premium Slim Fit T-Shirts ",
      price: 22.3,
      description:
        "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
      category: "men's clothing",
      image:
        "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
      rating: {
        rate: 4.1,
        count: 259,
      },
      quantity: 1,
    },
    {
      id: 3,
      title: "Mens Cotton Jacket",
      price: 55.99,
      description:
        "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      rating: {
        rate: 4.7,
        count: 500,
      },
      quantity: 1,
    },
  ]);

  const handleIncreament = (item) => {
    const data = [...cart];
    const newData = data.map((i) => {
      if (i.id === item.id) {
        i.quantity = i.quantity + 1;
      }
      return i;
    });
    setCart(newData);
  };

  const handleDecrement = (item) => {
    const data = [...cart];
    const newData = data.map((i) => {
      if (i.id === item.id) {
        i.quantity = i.quantity - 1;
      }
      return i;
    });
    setCart(newData);
  };

  const handleAddToCart = (item) => {
    const data = [...cart];
    const newData = data.map((i) => {
      if (i.id === item.id) {
        i.addedToCart = !i.addedToCart;
      }
      return i;
    });
    setCart(newData);
  };

  const handleTotal = () => {
    const data = [...cart];
    let total = 0;
    data.map((i) => {
      if (i.addedToCart) {
        total += i.price * i.quantity;
      }
    });
    return parseInt(total);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const data = [...cart];
    const newData = data.map((i) => {
      if (selectAll) {
        i.addedToCart = false;
      } else {
        i.addedToCart = true;
      }
      return i;
    });

    setCart(newData);
  };

  const renderCarts = ({ item }) => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: "90%",
            minHeight: 100,
            flexDirection: "column",
            padding: 10,
            marginVertical: 5,
            backgroundColor: "white",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Checkbox
              value={item.addedToCart}
              onValueChange={() => handleAddToCart(item)}
              color={item.addedToCart ? "#4FBCDD" : undefined}
            />
            <Image
              source={{ uri: item.image }}
              style={{ width: 70, height: 70, marginHorizontal: 5 }}
              resizeMode="contain"
            />
            <View style={{ width: "50%", marginHorizontal: 5 }}>
              <Text numberOfLines={2}>{item.title}</Text>
              <Text style={{ color: "#4FBCDD", fontWeight: "bold" }}>
                ₱{item.price}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              color={"#4FBCDD"}
              title="-"
              disabled={item.quantity === 1 ? true : false}
              onPress={() => handleDecrement(item)}
            ></Button>
            <Text
              style={{
                paddingHorizontal: 10,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {item.quantity}
            </Text>
            <Button
              color={"#4FBCDD"}
              onPress={() => handleIncreament(item)}
              title="+"
            ></Button>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={cart}
        renderItem={renderCarts}
        keyExtractor={(item, index) => index}
      />
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: 50,
          position: "absolute",
          bottom: 0,
          left: 0,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ marginRight: 5 }}>Select All</Text>
          <Checkbox
            value={selectAll}
            onValueChange={handleSelectAll}
            color={selectAll ? "#4FBCDD" : undefined}
          />
          <Text style={{ marginHorizontal: 10 }}>
            Total: <Text style={{ color: "#E6141C" }}>₱{handleTotal()}</Text>
          </Text>
        </View>

        <Pressable>
          <View
            style={{
              backgroundColor: "#E6141C",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Checkout</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
