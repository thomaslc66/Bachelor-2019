/***************************************************************
 *
 * File      : MapView.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Container for the game main view
 *
 *********************************************************************/
import React, { Component } from 'react';
import { Text, View, BackHandler } from 'react-native';
import { Button } from 'native-base';
import Map from './Map';
import { connect } from 'react-redux';
import styles from './Styles';
import DialogComponent from '../Dialog/DialogComponent';
import {
  gameIsStarted,
  gameIsStoped,
  updateGameInformation,
  getUserPosition,
  geofenceTracking,
  saveUserSession,
  openCloseIndicePopUp,
  openCloseEndDialog,
  updateGeofencesForDebug
} from '../../redux/actions/gameAction';
import { showToast } from '../../redux/actions/authAction';
import { publishMqttMessage } from '../../redux/actions/mqttAction';
import moment from 'moment';
import IndiceComponent from '../Dialog/IndiceComponent';
import RNLocation from 'react-native-location';
import text from '../../utils/text';
import screens from '../../utils/screens';
import DebugComponent from '../Dialog/DebugComponent';

class Mapview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupIsVisible: false,
      debugPopUpIsVisible: false,
      debug: false
    };
    this.unsubscribe;
  }

  static navigationOptions = {
    title: screens.map,
    header: null
  };

  /** *********************************************
   *
   * @name enableTracking
   * @abstract start the tracking and subscribe to GPS update
   *
   * **********************************************/
  enableTracking = () => {
    const { updateGameInformation, geofenceTracking } = this.props;

    RNLocation.checkPermission({
      android: {
        detail: 'fine' // 'coarse' or 'fine'
      }
    })
      .then(granted => {
        if (granted) {
          this.unsubscribe = RNLocation.subscribeToLocationUpdates(
            positions => {
              const { latitude, longitude, altitude, speed } = positions[0];
              //update the game information (distance, altitude, speed, etc...)
              updateGameInformation(latitude, longitude, altitude, speed);
              //check if we are in the circle
              geofenceTracking();
            }
          );
        } else {
          showToast(text.map.position_unavaliable, 2000, 'danger');
        }
      })
      .catch(rejected => {
        showToast(
          `Merci de vérifier les permission et l'état du GPS: ${JSON.stringify(
            rejected
          )}`,
          4000,
          'warning'
        );
      });
  };

  // On component mounting
  componentDidMount = () => {
    const { gameIsStarted } = this.props;
    // Start the game
    gameIsStarted();
    //start user tracking
    this.enableTracking();
    // backbutton press tracking
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
  };

  // On component unmounting
  componentWillUnmount = () => {
    this.backHandler.remove();
    // unsubscribe from location changes
    this.unsubscribe();
    this.props.gameIsStoped();
  };

  /** Manage the sate of the exit pop up **/
  _openClosePopUp = () => {
    this.setState(prevState => ({
      ...prevState,
      popupIsVisible: !prevState.popupIsVisible
    }));
  };

  /** handle the backpress button action **/
  handleBackPress = () => {
    this._openClosePopUp();
    return true;
  };

  // Render method of the component
  render() {
    const {
      average_speed,
      altitude,
      distance,
      indice,
      navigation,
      negativeAltitude,
      openCloseIndicePopUp,
      openCloseEndDialog,
      positiveAltitude,
      saveUserSession,
      isEndDialogOpen,
      isIndiceOpen,
      speed,
      totalPoint,
      updateGeofencesForDebug
    } = this.props;

    //Render Row by passing datas
    Row = ({ datas }) => {
      return (
        <View style={styles.column}>
          {datas.map((data, index) => {
            return (
              <View style={styles.rowDirection} key={index}>
                <Text style={styles.textColorWhite}>{data.text}</Text>
                <Text style={[styles.headerRow]}>{data.value}</Text>
              </View>
            );
          })}
        </View>
      );
    };

    // Render timer
    Timer = ({ time }) => {
      const duration = moment.duration(time);
      const subZero = n => (n < 10 ? '0' + n : n);
      return (
        <View style={styles.timerContainer}>
          <Text style={styles.totalPointText}>
            {text.map.points} {totalPoint}
          </Text>
          <Text style={styles.timerText}>
            {subZero(duration.minutes())}:{subZero(duration.seconds())}
          </Text>
          <Button
            onPress={() => {
              if (this.state.debug) {
                this.setState(prevState => ({
                  ...prevState,
                  debugPopUpIsVisible: !prevState.debugPopUpIsVisible
                }));
              } else {
                openCloseIndicePopUp();
              }
            }}
            style={styles.indiceButton}
          >
            <Text style={styles.indiceText}>{text.map.indice}</Text>
          </Button>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <View style={styles.row}>
            <Row
              datas={[
                {
                  text: text.map.distance,
                  value: `${distance.toFixed(1)} ${text.map.meter}`
                },
                {
                  text: text.map.speed,
                  value: `${speed.toFixed(1)} ${text.map.km_hour}`
                },
                {
                  text: text.map.avg_speed,
                  value: `${average_speed.toFixed(1)} ${text.map.km_hour}`
                }
              ]}
            ></Row>
            <Row
              datas={[
                {
                  text: text.map.altitude,
                  value: `${altitude.toFixed(1)} ${text.map.meter}`
                },
                {
                  text: text.map.asc_altitude,
                  value: `${positiveAltitude.toFixed(1)} ${text.map.meter}`
                },
                {
                  text: text.map.dsc_altitude,
                  value: `${negativeAltitude.toFixed(1)} ${text.map.meter}`
                }
              ]}
            ></Row>
          </View>
        </View>
        <Map />
        <View style={styles.backgroundButton}>
          <Timer time={this.props.time}></Timer>
          <Button
            style={styles.button}
            onPress={() => {
              this.setState({ popupIsVisible: true });
            }}
          >
            <Text style={styles.textButton}>{text.map.finish}</Text>
          </Button>
        </View>
        <DialogComponent
          title={text.dialog.quit_title}
          dismiss={false}
          buttonOk={text.dialog.yes}
          buttonCancel={text.dialog.no}
          onPressCancel={() => this._openClosePopUp()}
          onPressOk={() => {
            this._openClosePopUp();
            saveUserSession(() => navigation.goBack());
          }}
          popupIsVisible={this.state.popupIsVisible}
          styles={styles}
          content={<Text style={styles.dialogText}>{text.map.quit}</Text>}
        />
        <IndiceComponent
          title={text.map.indice}
          dismiss={true}
          buttonOk={text.map.button_ok}
          onPressOk={() => {
            openCloseIndicePopUp();
          }}
          popupIsVisible={isIndiceOpen}
          styles={styles}
          content={indice}
        />
        <IndiceComponent
          title={text.map.end_game}
          dismiss={true}
          buttonOk={text.map.button_ok}
          onPressOk={() => {
            openCloseEndDialog();
            saveUserSession(() => navigation.goBack());
          }}
          popupIsVisible={isEndDialogOpen}
          styles={styles}
          content={text.enigme3.end}
        />
        <DebugComponent
          popupIsVisible={this.state.debugPopUpIsVisible}
          buttonOk={'Validate'}
          styles={styles}
          openClose={value => {
            updateGeofencesForDebug(value);
            this.setState(prevState => ({
              ...prevState,
              debugPopUpIsVisible: !prevState.debugPopUpIsVisible
            }));
          }}
        />
      </View>
    );
  }
}

// REDUX STATE MANAGEMENT
const mapStateToProps = state => ({
  user: state.auth.me,
  speed: state.game.speed,
  average_speed: state.game.average_speed,
  altitude: state.game.altitude,
  positiveAltitude: state.game.positiveAltitude,
  negativeAltitude: state.game.negativeAltitude,
  distance: state.game.distance,
  time: state.game.time,
  geofences: state.game.geofences,
  isIndiceOpen: state.game.isPopUpIndiceOpen,
  isEndDialogOpen: state.game.isEndDialogOpen,
  indice: state.game.indice,
  totalPoint: state.game.totalPoint
});

const mapActionToProps = {
  //game action
  gameIsStarted: gameIsStarted,
  gameIsStoped: gameIsStoped,
  geofenceTracking: geofenceTracking,
  updateGameInformation: updateGameInformation,
  getUserPosition: getUserPosition,
  saveUserSession: saveUserSession,
  openCloseIndicePopUp: openCloseIndicePopUp,
  openCloseEndDialog: openCloseEndDialog,
  updateGeofencesForDebug: updateGeofencesForDebug,
  //auth action
  showToast: showToast,
  //mqtt action
  publishMqttMessage: publishMqttMessage
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(Mapview);
