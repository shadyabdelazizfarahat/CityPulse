import { LoginScreen, RegisterScreen } from "@/screens";
import { RootStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName="Login"
    >
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
    </RootStack.Navigator>
  );
};

export default AuthStackNavigator