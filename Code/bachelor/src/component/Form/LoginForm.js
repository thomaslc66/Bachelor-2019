/***************************************************************
 *
 * File      : LoginForm.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Connection / Login form
 *
 *********************************************************************/
import React, { Component } from "react";
import { Text } from "react-native";
import { Form, Input, Item, Button, Label, Container, View } from "native-base";
import {
  logIn,
  endToast,
  getUserFromDb,
  logout_success
} from "../../redux/actions/authAction";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import screens from "../../utils/screens";
import styles from "./Styles";
import text from "../../utils/text";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: "",
        password: ""
      }
    };
  }

  /* Hide navigation header on login page */
  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      let screen = screens.login;
      if (user) {
        screen = screens.profile;
        this.props.getUserFromDb(user);
      } else {
        this.props.logout_success();
      }
      this.props.navigation.navigate(screen);
    });
  }

  render() {
    const { user } = this.state;
    const { logIn } = this.props;

    return (
      <Container style={styles.container}>
        <Form style={styles.LoginForm}>
          <Item floatingLabel style={styles.ItemMargin}>
            <Label style={styles.text}>{text.login.email}</Label>
            <Input
              style={styles.text}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={email => {
                this.setState(prevState => ({
                  user: { ...prevState.user, email }
                }));
              }}
            />
          </Item>
          <Item floatingLabel style={styles.ItemMargin}>
            <Label style={styles.text}>{text.login.password}</Label>
            <Input
              style={styles.text}
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={password =>
                this.setState(prevState => ({
                  user: { ...prevState.user, password }
                }))
              }
            />
          </Item>
          <View style={styles.loginButtonContainer}>
            <Button
              style={styles.LoginButton}
              full
              rounded
              success
              onPress={() => {
                logIn(user);
              }}
            >
              <Text style={styles.LoginButtonText}>{text.login.button}</Text>
            </Button>
          </View>
          <Text
            style={styles.text_center}
            onPress={() => this.props.navigation.navigate(screens.register)}
          >
            {text.login.register}
          </Text>
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = state => ({});

const mapActionToProps = {
  logIn: logIn,
  getUserFromDb: getUserFromDb,
  endToast: endToast,
  logout_success: logout_success
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(LoginForm);
