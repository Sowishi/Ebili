import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

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

export default function App() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  const DrawerTab = () => {
    return (
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="PublicChat" component={PublicCHat} />
        <Drawer.Screen name="Sell" component={Sell} />
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
          <Stack.Screen name="Chat" component={Chat}/>
          <Stack.Screen options={{headerShown: true, title: ""}} name="Search" component={Search}/>

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
