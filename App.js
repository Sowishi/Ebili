
// Navigators

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";


// Screens

import Cart from "./screens/cart";
import Home from "./screens/home";
import Login from "./screens/login";
import Registration from "./screens/registration";
import ViewALl from "./screens/viewAll";
import ViewItem from "./screens/viewItem";
import User from "./screens/user";
import Sell from "./screens/sell";
import Chat from "./screens/chat";
import PublicCHat from "./screens/publicChat";
import Reviews from "./screens/reviews";
import Checkout from "./screens/checkout";
import Search from "./screens/search";
import OrderPending from "./screens/orderPending";
import OrderCompleted from "./screens/orderCompleted";
import OrderConfirmed from "./screens/orderConfirmed";
import Logout from "./screens/logout";




// Firebase
import { auth } from "./firebaseConfig";


//Dependecies
import Toast from "react-native-toast-message";


// Icons
import { FontAwesome } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 



//Redux
import { Store } from "./redux/store";
import { Provider } from "react-redux";



import { Image, Text, View } from "react-native";
import SellerActivity from "./screens/sellerActivity";



export default function App() {


  //Navigators instance

  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const Order = createMaterialTopTabNavigator();

  const handleSIgnOut = (props) => {
    console.log(props);
  };
  

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            resizeMode="contain"
            style={{ width: 100, height: 100 }}
            source={require("./assets/ebili-cover.png")}
          />
        </View>

        <DrawerItemList {...props} />
      
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
        drawerContent={(props) => <CustomDrawerContent  {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#0096be",
          },

          drawerActiveTintColor: "black",
          drawerInactiveTintColor: "white",
          drawerActiveBackgroundColor: "#EFB701",
        }}
      >
        <Drawer.Screen name="HOME" component={Home} options={
          {
            drawerIcon: ({focused, size}) => (
              <FontAwesome name="home" size={size} color={focused ? "black" : "white"} />
           ),
          }
        } />
        <Drawer.Screen
          options={{ title: "PUBLIC CHAT", 
          drawerIcon: ({focused, size}) => (
            <FontAwesome name="wechat" size={size} color={focused ? "black" : "white"} />
         ), }}
          name="PublicChat"
          component={PublicCHat}
        />
        <Drawer.Screen
          options={{ title: "SWITCH TO SELLING",  drawerIcon: ({focused, size}) => (
            <FontAwesome name="tag" size={size} color={focused ? "black" : "white"} />
         ), }}
          name="SellerActivity"
          component={SellerActivity}
        />
        <Drawer.Screen
          options={{ title: "SETTINGS", 
          drawerIcon: ({focused, size}) => (
            <FontAwesome name="gear" size={size} color={focused ? "black" : "white"} />
         ),}}
          name="User"
          component={User}
        />

        <Drawer.Screen
          options={{ title: "ORDERS", headerShown: true, 
          drawerIcon: ({focused, size}) => (
            <FontAwesome5 name="box" size={size} color={focused ? "black" : "white"} />
         ), }}
          name="OrderTab"
          component={OrderTab}
        />
         <Drawer.Screen
         
          options={{ title: "LOGOUT", headerShown: false, drawerItemStyle: {backgroundColor: "#870000"},
        drawerIcon: () => {
          return( 
            <Entypo name="log-out" size={24} color="white" />
          )
        } }}
          name="Logout"
          component={Logout}
        />
      </Drawer.Navigator>
    );
  };

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="Drawer" component={DrawerTab} />
          <Stack.Screen name="ViewItem" component={ViewItem} />
          <Stack.Screen name="Sell" options={{headerShown: true, title: "Sell an item!"}} component={Sell} />


          <Stack.Screen name="User" component={User} />

          <Stack.Screen name="OrderConfirmed" component={OrderConfirmed} />

          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen
            options={{ headerShown: true, title: "Reviews" }}
            name="Reviews"
            component={Reviews}
          />

          <Stack.Screen
            options={{ headerShown: false, title: "" }}
            name="Search"
            component={Search}
          />

          <Stack.Screen
            options={{ headerShown: true, title: "Checkout" }}
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
              headerTitle: () => {
                return (
                  <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", color: "#4FBCDD", marginRight: 5}}>Shopping Cart</Text>
                    <MaterialCommunityIcons name="cart-variant" size={20} color="#4FBCDD" /> 
                  </View>
                )

              },

              headerShown: true,
              headerTitleStyle: { color: "#4FBCDD" },
            }}
            component={Cart}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </Provider>
  );
}
