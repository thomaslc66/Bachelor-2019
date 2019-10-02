/***************************************************************
 *
 * File      : IndiceComponent.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Dialog component, used to display indice popup dialog
 *
 *********************************************************************/

import React, { Component } from "react";
import Dialog, {
  SlideAnimation,
  DialogContent,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";
import { Text } from "native-base";

class IndiceComponent extends Component {
  render() {
    const {
      title,
      buttonOk,
      onPressOk,
      content,
      popupIsVisible,
      styles
    } = this.props;
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
            title={title}
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
            onPress={() => onPressOk()}
            key="button"
          />
        }
      >
        <DialogContent style={styles.dialog}>
          <Text style={styles.text}>{content}</Text>
        </DialogContent>
      </Dialog>
    );
  }
}

export default IndiceComponent;
