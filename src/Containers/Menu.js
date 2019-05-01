import React, { Component } from "react";
import Colors from "../Constants/Colors";
import Images from '../Constants/Images'
import Text from "../Components/Text";
import PortalLogo from "../Components/PortalLogo";
import Button from "../Components/Button";
import Session from "../Lib/Session";
import ConnectFlow from "../Flows/ConnectFlow";
import Alerts from "../Lib/Alerts";
import { View, Image, ActivityIndicator, StyleSheet, ImageBackground } from "react-native";
import {NavigationActions} from 'react-navigation'

import {Container, Content, Header, Footer} from 'native-base'

import {AppCore} from '../'
import CurrentUser from '../Components/CurrentUser'

class Menu extends Component {

	constructor(props) {
		super(props)
		this.state = {
			title: '',
			version: '',
			updating: false,
			sponsors: [],
		}

		this.exit = this.exit.bind(this)
		this.login = this.login.bind(this)
		this.logout = this.logout.bind(this)
		this.newSubmission = this.newSubmission.bind(this)
		this.checkForUpdates = this.checkForUpdates.bind(this)
		this.uploadSubmissions = this.uploadSubmissions.bind(this)
	}

	componentWillMount() {
		this.setState({
			title: Session.get("settings.title.en", "School Safety Self-Assessment Portal"),
			version: Session.get('survey.version'),
		})

		const sponsorLogos = Images.sponsors().map(sponsor => {
			return new Promise((resolve) => {
				Image.getSize(sponsor.uri, (width, height) => {
					return resolve({sponsor, ratio: width / height})
				})
			})
		})

		Promise.all(sponsorLogos).then((all) => {
			this.setState({
				sponsors: all
			})
		})
	}

	newSubmission() {
		this.props.navigation.navigate('Survey', {title: 'New Submission'})
	}

	uploadSubmissions() {
		this.props.navigation.navigate('Upload', {title: 'Upload Submissions'})
	}

	async checkForUpdates() {
		this.setState({updating: true})
		
		const preserve ={
			auth: Session.get('auth'),
			survey_downloaded: Session.get('survey_downloaded')
		}

		try {
			await ConnectFlow.handle(Session.get('domain'))
			await Session.update(preserve)
			this.reset()
		} catch(error) {
			Alerts.error("Oops", error.toString());
			this.setState({ updating: false });
		}
	}

	async logout() {
		await Session.logout()
		this.reset()
	}

	async exit() {
		await Session.destroy()
		this.reset()
	}

	reset(to = 'Launch', params = {}) {
		this.props.navigation.dispatch(
			NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({routeName: to, params})],
			})
		)
	}

	login() {
		this.reset('Login', {optional: true})
	}

	renderAuthButton() {
		if (Session.isAuthenticated()) {
			return  <Button link title="Sign Out" icon="sign-out" style={styles.exitButton} onPress={this.logout} />
		}
		return <Button link title="Sign In" icon="sign-in" style={styles.exitButton} onPress={this.login} />
	}

	renderMenu() {

		const {background} = AppCore.get('theme')
		
		return <Container style={{backgroundColor:'white'}}>
			<Header style={{backgroundColor:'white', alignItems:'center'}}>
			<View style={{flex:1}}>
				<CurrentUser />
			</View>
			<View>
				{this.renderAuthButton()}
			</View>
			</Header>
			<ImageBackground source={background} style={{flex:1}} opacity={0.4}>
			<Content contentContainerStyle={{ alignItems:'center', padding:16}}>

				<View style={{flexDirection:'row', alignItems:'center',}}>
				<PortalLogo />
				<Text wrapTitle style={{marginLeft:16}}>{this.state.title}</Text>
				</View>
				
				{this._renderButtons()}

				<View style={styles.footer}>
				<View style={styles.sponsors}>
					{this.renderSponsorLogos()}
				</View>
				</View>
			</Content>
			</ImageBackground>
			<Footer style={{backgroundColor: 'white', flexDirection:'column', alignItems:'center'}}>
				<Text style={styles.footerText}>
					Survey version: {this.state.version}
				</Text>
				{this._renderExitButton()}
			</Footer>
		</Container>
	}

	_renderExitButton() {
		if (AppCore.has('domainLock')) {
			return null
		}
		return <Button link title="Connect to other domain" icon="chevron-circle-left" style={styles.exitButton} onPress={this.exit} />
	}

	_renderButtons() {
		const {buttonStyles} = AppCore.get('theme')
		const titles = this._buttonTitles()
		return <View style={styles.buttons}>
			<Button menu theme={buttonStyles.primary} title={titles.NEW} icon="plus" onPress={this.newSubmission} />
			<Button menu theme={buttonStyles.secondary} title={titles.UPLOAD} icon="upload" onPress={this.uploadSubmissions} />
			<Button menu theme={buttonStyles.other} title={titles.UPDATE} icon="refresh" style={{ marginTop: 32 }} onPress={this.checkForUpdates} />
		</View>
	}

	_buttonTitles() {
		const titles = {
			NEW: 'New Submission',
			UPLOAD: 'Upload Submissions',
			UPDATE: 'Check for Updates',
		}
		if (Session.get('domain') === 'fijifsp') {
			titles.NEW = 'Start our Plan'
			titles.UPLOAD = 'Upload our Plan'
		}
		return titles
	}

	renderLoading() {
		return <Container>
			<Content contentContainerStyle={{ alignItems:'center', padding:16}}>
				<ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: 15 }} />
				<Text>Updating...</Text>
			</Content>
		</Container>
	}

	renderSponsorLogos() {
		return this.state.sponsors.map((item, index) => {
			return <Image key={index} source={item.sponsor} style={[styles.sponsor, {aspectRatio: item.ratio, height: 50}]} />
		})
	}

	render() {
		return <View style={{flex:1}}>
			{this.state.updating ? this.renderLoading() : this.renderMenu()}
		</View>
	}
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sponsors: {
	marginTop:32,
	maxWidth:340,
    flexDirection: "row",
	alignItems: "stretch",
	justifyContent:'center',
    flexWrap: 'wrap',
  },
  sponsor: {
    marginTop: 8,
    marginRight: 4,
    marginLeft: 4,
    marginBottom: 8
  },
  exitButton: {
    marginBottom: 0,
    padding: 0,
    textAlign: 'right',
  },
  footerText: {
    flex: 1,
    textAlign: "center",
    color: Colors.textMute
  }
});

export default Menu;
