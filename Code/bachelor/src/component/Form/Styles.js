/***************************************************************
 *
 * File      : Styles.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : // src/component/Form/Styles sheet
 *
 *********************************************************************/
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { backgroundColor: "#0D1C2F" },
  text: {
    color: "#fff"
  },
  text_center: {
    color: "#fff",
    marginTop: 15,
    textAlign: "center",
    justifyContent: "center"
  },

  //Login Form

  LoginForm: {
    margin: 30,
    marginTop: 160
  },
  LoginButton: {
    marginTop: 45,
    backgroundColor: "#FF8710",
    width: "80%"
  },
  LoginButtonText: {
    color: "#fff",
    fontSize: 13
  },
  loginButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  ItemMargin: { marginLeft: 0 },

  // Register Form

  registerForm: {
    margin: 20,
    marginTop: 60
  },
  registerButton: {
    marginTop: 30,
    backgroundColor: "#FF8710",
    alignContent: "center",
    justifyContent: "center",
    width: "80%"
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 13
  },
  registerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  input: {
    backgroundColor: "rgba(225,225,225,0.3)",
    marginBottom: 16,
    padding: 10,
    color: "#fff"
  }
});
