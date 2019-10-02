/***************************************************************
 *
 * File      : RegisterForm.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Registration form
 *
 *********************************************************************/
import React, { Component } from "react";
import { findNodeHandle, Text, View } from "react-native";
import { Button, Container } from "native-base";
import { register } from "../../redux/actions/authAction";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInputComp } from "./TextInputComp/TextInputComp";
import screens from "../../utils/screens";
import styles from "./Styles";
import text from "../../utils/text";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      confirm_password: "",
      password: ""
    };
    this._mounted = false;
  }

  /** Set Header Title */
  static navigationOptions = {
    title: text.register.title
  };

  /**
   * @name _scrollToInput
   * @goal Method use to set focus on the next input of the form
   * @param {*} reactNode
   */
  _scrollToInput(reactNode) {
    this.scroll.props.scrollToFocusedInput(reactNode);
  }

  /**
   * @name handleTextChange
   * @goal Handle all input text changes on the form
   * @params The new text and the name of the input
   *
   */
  handleTextChange = (text, name) => {
    this.setState({
      [name]: text
    });
  };

  componentWillMount = () => {
    this._mounted = true;
  };

  componentWillUnmount = () => {
    this._mounted = false;
  };

  /**
   * @name render
   * @goal Rendering method of the component
   *
   */
  render() {
    const { signIn } = this.props;

    return (
      <Container style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          innerRef={ref => {
            this.scroll = ref;
          }}
        >
          <View style={styles.registerForm}>
            <TextInputComp
              placeholder={text.register.first_name}
              name="first_name"
              value={this.state.first_name}
              ref={ref => {
                this._first_name = ref;
              }}
              onFocus={event => {
                this._scrollToInput(findNodeHandle(event.target));
              }}
              onSubmitEditing={() => {
                this._last_name.focus();
              }}
              onChangeText={this.handleTextChange}
            />
            <TextInputComp
              placeholder={text.register.last_name}
              name="last_name"
              value={this.state.last_name}
              ref={ref => {
                this._last_name = ref;
              }}
              onFocus={event => {
                this._scrollToInput(findNodeHandle(event.target));
              }}
              onSubmitEditing={() => {
                this._email.focus();
              }}
              onChangeText={this.handleTextChange}
            />
            <TextInputComp
              placeholder={text.register.email}
              name="email"
              value={this.state.email}
              ref={ref => {
                this._email = ref;
              }}
              onFocus={event => {
                this._scrollToInput(findNodeHandle(event.target));
              }}
              onSubmitEditing={() => {
                this._password.focus();
              }}
              onChangeText={this.handleTextChange}
            />
            <TextInputComp
              placeholder={text.register.password}
              name="password"
              value={this.state.password}
              secureTextEntry={true}
              ref={ref => {
                this._password = ref;
              }}
              onFocus={event => {
                this._scrollToInput(findNodeHandle(event.target));
              }}
              onSubmitEditing={() => {
                this._confirm_password.focus();
              }}
              onChangeText={this.handleTextChange}
            />
            <TextInputComp
              placeholder={text.register.confirm_password}
              name="confirm_password"
              value={this.state.confirm_password}
              secureTextEntry={true}
              ref={ref => {
                this._confirm_password = ref;
              }}
              onFocus={event => {
                this._scrollToInput(findNodeHandle(event.target));
              }}
              onChangeText={this.handleTextChange}
            />
            <View style={styles.registerButtonContainer}>
              <Button
                style={styles.registerButton}
                rounded
                success
                onPress={() => {
                  this._mounted && signIn(this.state);
                }}
              >
                <Text style={styles.registerButtonText}>
                  {text.register.validated}
                </Text>
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  //No redux state needed here
});

const mapActionToProps = {
  signIn: register
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(RegisterForm);
