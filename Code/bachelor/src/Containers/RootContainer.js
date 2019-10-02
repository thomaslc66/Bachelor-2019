/***************************************************************
 *
 * File      : RootContainer.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Main container, managing the navigation between views
 *
 *********************************************************************/
import React, { Component } from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";
import LoginForm from "../component/Form/LoginForm";
import RegisterForm from "../component/Form/RegisterForm";
import Profile from "../component/Profile/Profile";
import Mapview from "../component/Map/Mapview";
import MapResume from "../component/Map/MapResume";
import { Root } from "native-base";
import screens from "../utils/screens";

// React Navigation creation
const AppNavigator = createStackNavigator(
  {
    Login: LoginForm,
    Register: RegisterForm,
    Profile: Profile,
    Map: Mapview,
    MapResume: MapResume
  },
  {
    initialRouteName: screens.login,
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#0D1C2F"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {}
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

class RootContainer extends Component {
  render() {
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}

export default RootContainer;
