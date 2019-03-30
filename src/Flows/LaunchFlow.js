import RNFS from "react-native-fs"
import {NavigationActions} from 'react-navigation'
import { unzip } from 'react-native-zip-archive'

import Api from '../Lib/Api'
import Files from '../Lib/Files'
import Alerts from '../Lib/Alerts'
import Session from '../Lib/Session'
import Connectivity from '../Lib/Connectivity'

export default async (navigation, onProgress) => {

    // Resets the navigation stack
    const resetTo = (screenName) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: screenName }),
            ]
        })
        navigation.dispatch(resetAction)            
    }

    const cleanExtractedSurveyFiles = async () => {
        try {
            await RNFS.unlink(Files.surveyFolder())
        } catch (e) {
            // Folder not found... Skip silently...
        }
    }

    const downloadSurveyZipIfNeeded = async () => {
        if ( ! Session.needsToDownloadSurvey()) {
            return
        }
        await cleanExtractedSurveyFiles()
        await Api.downloadSurveyZip(
            Files.surveyZip(),
            progress => onProgress(progress)
        )
        await Session.update({
            survey_downloaded: Session.get('survey.version')
        })
    }

    const extractSurveyZipIfFound = async () => {
        const zipFound = await RNFS.exists(
            Files.surveyZip()
        )
        if (zipFound) {
            await unzip(
                Files.surveyZip(),
                Files.surveyFolder()
            )
            await RNFS.unlink(Files.surveyZip())
        }
    }

    const continueToApplication = async () => {

        try {
            await downloadSurveyZipIfNeeded()
            await extractSurveyZipIfFound()
        } catch(error) {
            Alerts.error('Oops!', error.toString())
            Session.destroy()
            return resetTo("Launch");
        }

        return resetTo('Menu')
    }

    const refreshTokenAndStart = async () => {
        
        if ( ! await Connectivity.check()) {
            return await continueToApplication() // Do nothing, because there's no connection
        }

        try {
            await Session.refreshToken()
        } catch(error) {
            Alerts.error("Oops", error.toString())
            // TODO: Only logout if it's a token issue.
            await Session.logout()
            // If after logging out, login is required, go to login page.
            if (Session.needsAuthentication()) {
                return resetTo("Login")
            }
        }

        return await continueToApplication()
    }

    console.log('restoring session...')
    await Session.restoreSession()

    // Check the current session
    if (!Session.hasValidSession()) {
        // There's no session.
        // Go to the initial connection page.
        return resetTo("Connect")
    }
    
    // Sets the active domain, and if exists, token
    Api.configureFromSession()

    // If the session indicates that authentication is necessary
    // And the user is not currently authenticated, authenticate first.
    if (Session.needsAuthentication()) {
        return resetTo("Login")
    }

    if (Session.isAuthenticated()) {
        // Check internet connectivity...
        return await refreshTokenAndStart()
    }

    // Otherwise, just go to the menu.
    return await continueToApplication()
}