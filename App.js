import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";

import Cart from "./screens/cart";
import Home from "./screens/home";
import Login from "./screens/login";
import Registration from "./screens/registration";
import ViewALl from "./screens/viewAll";
import ViewItem from "./screens/viewItem";
import User from "./screens/user";

import Toast from "react-native-toast-message";
import PublicCHat from "./screens/publicChat";
import Sell from "./screens/sell";
import Chat from "./screens/chat";
import Search from "./screens/search";
import { auth } from "./firebaseConfig";
import Reviews from "./screens/reviews";
import Checkout from "./screens/checkout";
import OrderConfirmed from "./screens/orderConfirmed";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import OrderPending from "./screens/orderPending";
import OrderCompleted from "./screens/orderCompleted";

export default function App() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const Order = createMaterialTopTabNavigator();

  const handleSIgnOut = (props) => {
    console.log(props);
  };

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* <DrawerItem label="Logout" onPress={() => handleSIgnOut()} /> */}
      </DrawerContentScrollView>
    );
  }

  const OrderTab = () => {
    return (
      <Order.Navigator>
        <Order.Screen name="OrderPending" component={OrderPending} />
        <Order.Screen name="OrderCompleted" component={OrderCompleted} />
      </Order.Navigator>
    );
  };

  const DrawerTab = ({ navigation }) => {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#4FBCDD",
          },

          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "white",
          drawerActiveBackgroundColor: "gray",
        }}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen
          options={{ title: "Public Chat" }}
          name="PublicChat"
          component={PublicCHat}
        />
        <Drawer.Screen
          options={{ title: "Switch to selling" }}
          name="Sell"
          component={Sell}
        />
        <Drawer.Screen
          options={{ title: "Settings" }}
          name="User"
          component={User}
        />

        <Drawer.Screen
          options={{ title: "Orders", headerShown: true }}
          name="OrderTab"
          component={OrderTab}
        />
      </Drawer.Navigator>
    );
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="Drawer" component={DrawerTab} />
          <Stack.Screen name="ViewItem" component={ViewItem} />

          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="OrderConfirmed" component={OrderConfirmed} />

          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen
            options={{ headerShown: true, title: "Reviews" }}
            name="Reviews"
            component={Reviews}
          />

          <Stack.Screen
            options={{ headerShown: true, title: "" }}
            name="Search"
            component={Search}
          />

          <Stack.Screen
            options={{ headerShown: true, title: "" }}
            name="Checkout"
            component={Checkout}
          />

          <Stack.Screen
            options={{
              headerShown: true,
              headerTitle: "All Items",
              headerTitleStyle: { color: "#4FBCDD" },
            }}
            name="ViewAll"
            component={ViewALl}
          />
          <Stack.Screen
            name="Cart"
            options={{
              headerShown: true,
              headerTitle: "Shopping Cart",
              headerTitleStyle: { color: "#4FBCDD" },
            }}
            component={Cart}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
