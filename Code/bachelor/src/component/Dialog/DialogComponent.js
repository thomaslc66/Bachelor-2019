/***************************************************************
 *
 * File      : DialogComponent.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Dialog component, used to display popup dialog
 *
 *********************************************************************/

import React, { Component } from "react";
import Dialog, {
  SlideAnimation,
  DialogContent,
  DialogFooter,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";

class DialogComponent extends Component {
  render() {
    const {
      title,
      buttonOk,
      buttonCancel,
      onPressOk,
      onPressCancel,
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
            textStyle={{ fontSize: 14 }}
            align={"left"}
            title={title}
          />
        }
        footer={
          <DialogFooter>
            <DialogButton
              textStyle={{ fontSize: 12 }}
              text={buttonCancel}
              onPress={() => onPressCancel()}
            />
            <DialogButton
              textStyle={{ fontSize: 12 }}
              text={buttonOk}
              onPress={() => onPressOk()}
            />
          </DialogFooter>
        }
      >
        <DialogContent style={styles.dialog}>{content}</DialogContent>
      </Dialog>
    );
  }
}

export default DialogComponent;
