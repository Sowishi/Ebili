import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Cart from "./screens/cart";
import Home from "./screens/home";
import Login from "./screens/login";
import Registration from "./screens/registration";
import ViewALl from "./screens/viewAll";
import ViewItem from "./screens/viewItem";

import Toast from "react-native-toast-message";

export default function App() {
  const Stack = createStackNavigator();
  const drawer = createDrawerNavigator();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ViewItem" component={ViewItem} />
          <Stack.Screen name="ViewAll" component={ViewALl} />
          <Stack.Screen name="Cart" component={Cart} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
