/***************************************************************
 *
 * File      : App.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : React-native main component
 *
 *********************************************************************/
import React, { Component } from "react";
import { Provider } from "react-redux";
import RootContainer from "./src/Containers/RootContainer";
import createStore from "./src/utils/storeCreator";

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}

export default App;
