import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated
} from "react-native";
import React from "react";
import { connect } from "react-redux";
import { Card, Button, Icon, Divider } from "react-native-elements";
import { Notifications } from "expo";
import { AsyncStorage } from "react-native";

const DeckItem = props => {
  // console.log(props);
  const { deck, navigation } = props;
  return (
    <Card key={deck.id} title={deck.title}>
      <Text style={{ marginBottom: 10 }}>{deck.description}</Text>
      <Text style={{ marginBottom: 10 }}>
        Number of cards: {deck.cardlist.length}
      </Text>
      <Button
        title="View Now"
        type="outline"
        onPress={() => navigation.navigate("DeckDetail", { deckObj: deck })}
      />
    </Card>
  );
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    // AsyncStorage.removeItem("NOTIFICATION");

    this.state = {
      notification: false,
      opacity: new Animated.Value(0)
    };
    this.handleNotification = this.handleNotification.bind(this);
  }

  componentDidMount() {
    Notifications.cancelAllScheduledNotificationsAsync();
    // setLocalNotification();
    const { opacity } = this.state;
    Animated.timing(opacity, { toValue: 1, duration: 2000 }).start();
  }
  handleNotification(listenter) {
    // this.props.dispatch({ type: "RECEIVE_HISTORY", history: {} });
    // console.log(listenter);
    AsyncStorage.getItem("NOTIFICATION")
      .then(JSON.parse)
      .then(data => {
        if (data === true) {
          this.setState({ notification: true });
        }
      });
  }
  render() {
    const { decks, navigation } = this.props;
    Notifications.addListener(listenter => this.handleNotification(listenter));
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[styles.notification, { opacity: this.state.opacity }]}
        >
          <Text>Notification Area</Text>
          {/* <Text>
            {this.props.history.length > 0 ? (
              <Text>You already did Quiz today !</Text>
            ) : (
              <Text>"Remember to do quiz today"</Text>
            )}
          </Text> */}
          <Divider style={{ backgroundColor: "blue" }} />
          {this.state.notification || this.props.history.length <= 0 ? (
            <Animated.View style={{ opacity: this.state.opacity }}>
              <Text style={{ fontSize: 20, color: "red" }}>
                Dont forget to do your Quiz today
              </Text>
            </Animated.View>
          ) : (
            <Text></Text>
          )}
        </Animated.View>
        <Animated.View style={[{ opacity: this.state.opacity }]}>
          <Button
            icon={<Icon name="add" color="#ffffff" />}
            buttonStyle={{
              borderRadius: 0,
              marginTop: 10
            }}
            title="ADD NEW DECK"
            onPress={() => this.props.navigation.navigate("AddNewDeck")}
          />
        </Animated.View>
        {decks.length > 0 ? (
          <Animated.View style={[{ opacity: this.state.opacity }]}>
            <FlatList
              data={decks}
              renderItem={({ item }) => (
                <DeckItem deck={item} navigation={navigation} />
              )}
              keyExtractor={item => item.id}
            />
          </Animated.View>
        ) : (
          <View>
            <Text>You don't have any decks</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  notification: {
    height: 100
  }
});

function mapStateToProps({ decks, history }) {
  return {
    decks: Object.values(decks),
    history: Object.keys(history)
  };
}

export default connect(mapStateToProps)(HomeScreen);
