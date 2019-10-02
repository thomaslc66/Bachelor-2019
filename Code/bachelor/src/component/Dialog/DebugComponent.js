/***************************************************************
 *
 * File      : DebugComponent.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : 08-09 2019
 * Goal      : Debug Component for debug purpose only
 *
 *
 *********************************************************************/

import React, { Component } from "react";
import Dialog, {
  SlideAnimation,
  DialogContent,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";
import { Text, Input, View, Item, Label } from "native-base";
import TextInputComp from "../Form/TextInputComp/TextInputComp";

class DebugComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  onClose = () => {
    openClose(this.state.value);
  };

  changeData = text => {
    this.setState({
      value: text
    });
  };

  render() {
    const { buttonOk, popupIsVisible, styles, openClose } = this.props;
    return (
      <Dialog
        width={0.85}
        visible={popupIsVisible}
        dialogAnimation={
          new SlideAnimation({
            slideFrom: "bottom"
          })
        }
        dialogTitle={
          <DialogTitle
            textStyle={{ fontSize: 15 }}
            align={"left"}
            title={"Select the enigme you want to validate"}
          />
        }
        footer={
          <DialogButton
            bordered={true}
            textStyle={{ fontSize: 12 }}
            style={{
              borderColor: "rgba(203, 217, 231, 0.4)",
              borderWidth: 0.9
            }}
            text={buttonOk}
            onPress={() => openClose(this.state.value)}
            key="button"
          />
        }
      >
        <DialogContent style={styles.dialog}>
          <Item floatingLabel>
            <Label>{"Index of the geofence"}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={text => this.changeData(text)}
              value={this.state.value}
            />
          </Item>
        </DialogContent>
      </Dialog>
    );
  }
}

export default DebugComponent;
