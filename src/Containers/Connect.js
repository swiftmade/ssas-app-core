import {
    Image,
    TextInput,
    View,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import React, { Component } from "react";
import {NavigationActions} from 'react-navigation';

import AppCore from "../AppCore";
import Alerts from "../Lib/Alerts";
import Text from "../Components/Text";
import Colors from "../Constants/Colors";
import Button from "../Components/Button";
import ConnectFlow from "../Flows/ConnectFlow";
import Container from "../Components/Container";

class Connect extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            busy: false,
            domain: '',
        }
    }

    async componentDidMount() {
        if (AppCore.has('domainLock')) {
            await this.connect(AppCore.get('domainLock'))
        }
    }

    async connect(domain) {

        if ( ! domain.trim()) {
            Alerts.error('Domain is empty', 'Please enter your domain before pressing connect.')
            return
        }        

        this.setState({busy: true})

        try {
            await ConnectFlow.handle(domain)
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: "Launch",})],
                })
            )
        } catch (error) {
            Alerts.error('Oops', error.toString())
            // TODO: Show error
            this.setState({busy: false})
        }
    }
    
    render() {
        if (AppCore.has('domainLock')) {
            return this._renderSplash()
        }
        return this._renderConnect()
    }

    _renderSplash() {
        return <Container center>
            <Image source={AppCore.get('defaultLaunchLogo')} />
            <Text title>{AppCore.get('defaultLaunchName')}</Text>
        </Container>
    }

    _renderConnect() {
        return <Container center>
            <Image source={AppCore.get('defaultLaunchLogo')} />
            <Text title>{AppCore.get('defaultLaunchName')}</Text>

            <View style={styles.inputWrapper}>
                
                <TextInput editable={!this.state.busy}
                value={this.state.domain}
                onChangeText={(text) => this.setState({domain: text})}
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.5)"
                underlineColorAndroid="transparent"
                placeholder="enter domain"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false} />
                
                <Text style={styles.domain}>.riskrapps.net</Text>
            </View>
            {this._renderButton()}
        </Container>
    }

    _renderButton() {
        if (this.state.busy) {
            return <ActivityIndicator size="large" color={Colors.darkBlue} style={styles.indicator} />
        }
        return <Button login title="Connect" onPress={() => this.connect(this.state.domain)} />
    }    
}


const styles = StyleSheet.create({
  indicator: {
    marginTop: 15
  },
  inputWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    flexDirection: "row",
    marginTop: 32,
    marginBottom: 8,
    maxWidth: 340,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 22,
    textAlign: "center",
    marginRight: 4,
    backgroundColor: Colors.lightBlue,
  },
  domain: {
    fontSize: 22,
    color: Colors.darkBlue,
    margin: 8,
  }
});

export default Connect