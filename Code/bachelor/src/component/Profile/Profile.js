/***************************************************************
 *
 * File      : Profile.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : User profile container
 *
 *********************************************************************/
import React, { Component } from 'react';
import { Button, Item, Label, Input, Content } from 'native-base';
import { connect } from 'react-redux';
import {
  logout,
  showToast,
  updateAvatar
} from '../../redux/actions/authAction';
import {
  Image,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import MQTT from 'sp-react-native-mqtt';
import DistancePoint from './DistancePoint';
import styles from './Styles';
import {
  getGeofencesFromDb,
  getUserPosition
} from '../../redux/actions/gameAction';
import {
  registerMqttClient,
  onMqttConnected,
  onMqttMessage
} from '../../redux/actions/mqttAction';
import DialogComponent from '../Dialog/DialogComponent';
import moment from 'moment';
import fr from 'moment/locale/fr-ch';
import SessionRow from './SessionRow';
import text from '../../utils/text';
import screens from '../../utils/screens';
import RNLocation from 'react-native-location';

class Profile extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.unsubscribe;

    this.state = {
      popupIsVisible: false,
      url: '',
      urlError: false,
      isConnected: false,
      client: null,
      message: 'No message',
      dataTest: ''
    };
  }

  /* Navigation options, header */
  static navigationOptions = ({ navigation }) => {
    // access navigation params
    const logout = navigation.getParam('logout');

    return {
      headerLeft: navigation.getParam('headerLeft'),
      headerVisible: true,
      headerRight: (
        <Text
          style={{ color: '#fff', marginRight: 10 }}
          onPress={() => logout()}
        >
          {text.profile.logout}
        </Text>
      ),
      BackgroundColor: '#1B5E20'
    };
  };

  // Change header base on the mqtt connexion
  changeHeaderLeft = () => {
    this.props.navigation.setParams({
      headerLeft: (
        <Image
          style={{
            marginLeft: 10,
            width: 40,
            height: 40
          }}
          source={require('../../img/connected.png')}
        />
      )
    });
  };

  // methods passed to the navigation bar
  _propsToNavigation = () => {
    const { logout } = this.props;
    this.props.navigation.setParams({ logout });
  };

  // handle the backpressed button
  handleBackPress = () => {
    this.props.logout();
    return true;
  };

  // component mounting method
  componentWillMount = () => {
    const { client } = this.props;
    this._isMounted = true;
    if (client) {
      this.setState({ isConnected: false });
      client.disconnect();
    }
  };

  // component unmounting method
  componentWillUnmount = () => {
    const { client } = this.props.client;
    this._isMounted = false;
    if (client) {
      client.disconnect();
    }
  };

  // component finished mounting method
  componentDidMount = () => {
    const {
      broker,
      showToast,
      registerMqttClient,
      onMqttConnected,
      onMqttMessage,
      getUserPosition
    } = this.props;

    // backbutton press tracking
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );

    /* create mqtt client */
    this._isMounted &&
      MQTT.createClient(broker)
        .then(client => {
          if (client) {
            registerMqttClient(client);
          }

          client.on('connect', onMqttConnected(() => this.changeHeaderLeft()));
          client.on('message', message => onMqttMessage(message));

          client.on('closed', () => {
            //showToast(text.profile.connection.close, 2000, 'warning');
            this._isMounted && this.setState({ isConnected: false });
          });

          client.on('error', msg => {
            showToast(text.profile.connection.error, 2000, 'warning');
            this._isMounted && this.setState({ isConnected: false });
          });

          client.connect();
        })
        .catch(error => {
          showToast(error.message, 4000);
          this.setState({
            isConnected: false
          });
        });

    // ******* GEOLOCATION CONFIGURATION ***************/
    // Tweak here if you want to change precision and duration between updates
    RNLocation.configure({
      distanceFilter: 2.0,
      interval: 3000,
      fastestInterval: 2000,
      maxWaitTime: 4000,
      desiredAccuracy: {
        android: 'highAccuracy' //balancedPowerAccuracy, highAccuracy, lowPower, or noPower
      },
      headingOrientation: 'portrait'
    }).then(() => {
      RNLocation.requestPermission({
        android: {
          detail: 'fine', // 'coarse' or 'fine'
          rationale: {
            title: text.rationale.title,
            message: text.rationale.message,
            buttonPositive: text.rationale.buttonPositive,
            buttonNegative: text.rationale.buttonNegative
          }
        }
      })
        .then(granted => {
          if (granted) {
            getUserPosition(() =>
              showToast('Error retriving user position', 2000, 'warning')
            );
          } else {
            showToast(text.map.position_unavaliable, 2000, 'danger');
          }
        })
        .catch(rejected => {
          showToast(
            `Please check location status and permission first: ${JSON.stringify(
              rejected
            )}`,
            4000,
            'warning'
          );
        });
    });

    this._propsToNavigation();
  };

  /*** Manage the sate of the pop up for the gravatar ***/
  _openPhotoUpdater = () => {
    this.setState(prevState => ({
      ...prevState,
      popupIsVisible: !prevState.popupIsVisible
    }));
  };

  /** Validate the photo url */
  _validatePhotoUrl = () => {
    const { showToast } = this.props;
    let re = /^(http(s?):\/\/)(www.)?[\s\S]*(.(jpg|png|jpeg|gif))$/g;

    if (this.state.url && re.test(this.state.url)) {
      this.props.updateAvatar(this.state.url, this.props.me.uid);
      this._openPhotoUpdater(); //manage popup opening
      showToast(text.profile.image, 3000);
    } else {
      this.setState({ urlError: true });
    }
  };

  // Render method for the header of the profile view
  renderContactHeader = () => {
    const { avatar, me, getGeofencesFromDb } = this.props;
    getGeofencesFromDb();

    return (
      <View>
        <View style={styles.userColumn}>
          <DistancePoint
            value={me ? me.totalDistance / 1000 : 0}
            text={text.profile.kilometers}
          />
          <TouchableHighlight onPress={() => this._openPhotoUpdater()}>
            <Image
              style={styles.userImage}
              source={{ uri: me ? me.photoURL : avatar }}
            />
          </TouchableHighlight>
          <DistancePoint
            value={me ? me.totalPoint : 0}
            text={text.profile.points}
          />
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.userRow}>
            <View style={styles.userNameRow}>
              <Text style={styles.userNameText}>
                {me ? me.displayName : text.profile.no_name}
              </Text>
            </View>
            <View style={styles.userBioRow}>
              <Text style={styles.userBioText} onPress={() => {}}>
                {me ? me.email : text.profile.no_email}
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <DialogComponent
              title={text.profile.update_gravatar}
              buttonOk={text.profile.buttonPositive}
              buttonCancel={text.profile.buttonNegative}
              onPressCancel={() => {
                this._openPhotoUpdater();
                this.setState({ urlError: false });
              }}
              onPressOk={this._validatePhotoUrl}
              popupIsVisible={this.state.popupIsVisible}
              styles={styles}
              content={
                <Item floatingLabel>
                  <Label style={this.state.urlError ? { color: 'red' } : {}}>
                    {text.profile.image_url}
                  </Label>
                  <Input
                    style={styles.text}
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={url =>
                      this.setState(prevState => ({
                        ...prevState,
                        url
                      }))
                    }
                  />
                </Item>
              }
            />
          </View>
        </View>
      </View>
    );
  };

  // Main Render method of the profile component
  render() {
    const {
      me,
      geofencesLoaded,
      showToast,
      mqttConnected,
      navigation
    } = this.props;
    return (
      <View style={[styles.container, styles.customBorder]}>
        <View style={styles.cardContainer}>{this.renderContactHeader()}</View>
        <FlatList
          ListHeaderComponent={
            <Text style={styles.header}>{text.profile.sessions_historic}</Text>
          }
          stickyHeaderIndices={[0]}
          indicatorStyle={'white'}
          initialNumToRender={6}
          style={styles.listContainer}
          data={me ? me.sessions : null}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.row}
                onPress={() =>
                  navigation.navigate(screens.resume, { session: item })
                }
              >
                <View style={styles.rowFlexDirection}>
                  <Text style={styles.sessionRowTitleText}>
                    {moment
                      .unix(item.date.seconds)
                      .locale('fr', fr)
                      .format('LLLL')}
                  </Text>
                </View>
                <View style={styles.rowFlexDirection}>
                  <View
                    style={{
                      padding: 10,
                      flexDirection: 'column'
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: 'grey',
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        textAlignVertical: 'center',
                        textAlign: 'center'
                      }}
                    >{`${Math.round(item.totalPoint) ||
                      text.profile.zero}\npts`}</Text>
                  </View>
                  <View style={styles.sessionsRow}>
                    <SessionRow
                      text={`${item.totalTime || text.profile.no_time} min`}
                      iconName='clock'
                    />
                    <SessionRow
                      text={`${(item.distance / 1000).toFixed(2) ||
                        text.profile.zero} km`}
                      iconName='map-marked-alt'
                    />
                  </View>
                  {/*second column*/}
                  <View style={styles.sessionsRow}>
                    <SessionRow
                      text={`${item.altitudeUp.toFixed(2) ||
                        text.profile.zero} m`}
                      iconName='mountain'
                    />
                    <SessionRow
                      text={`${item.altitudeDown.toFixed(2) ||
                        text.profile.zero} m`}
                      iconName='mountain'
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.rowFlexDirection}>
              <Text style={styles.sessionRowTitleText}>
                {text.profile.no_sessions_avaliable}
              </Text>
            </View>
          )}
        />
        <View style={styles.centeredButton}>
          <Button
            style={styles.startGame}
            block
            onPress={() => {
              if (geofencesLoaded && mqttConnected) {
                navigation.navigate(screens.map);
              } else {
                showToast(text.profile.wait, 2000, 'default');
              }
            }}
          >
            <Text style={styles.logout_text}>{text.profile.play}</Text>
          </Button>
        </View>
      </View>
    );
  }
}

// REDUX STATE MANAGEMENT
const mapStateToProps = state => ({
  me: state.auth.me,
  avatar: state.auth.avatar,
  geofencesLoaded: state.game.geofencesLoaded,
  //mqtt state
  client: state.mqtt.client,
  mqttConnected: state.mqtt.mqttConnected,
  broker: state.mqtt.broker
});

const mapActionToProps = {
  logout: logout,
  showToast: showToast,
  updateAvatar: updateAvatar,
  getGeofencesFromDb: getGeofencesFromDb,
  //game reducer
  getUserPosition: getUserPosition,
  //mqtt reducer
  onMqttConnected: onMqttConnected,
  onMqttMessage: onMqttMessage,
  registerMqttClient: registerMqttClient
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(Profile);
