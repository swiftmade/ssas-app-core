import RNFS from 'react-native-fs'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

import Api from './Api'
import Themes from '../Constants/Themes'

const sessionKey = '@SSAS:Session'

class Session {

    constructor() {
        this.session = null
    }

    async restoreSession() {
        this.session = await this.load()
    }

    hasValidSession() {
        return this.session !== null
    }

    /**
     * Checks if the connected portal instance requires authentication
     * If that's the case, checks if the user is currently authenticated.
     */
    needsAuthentication() {
        if (!this.session) {
            return false
        }
        return this.get("settings.requires_authentication") && !this.isAuthenticated();
    }

    isAuthenticated() {
        if (!this.session) {
            return false
        }
        return this.session.auth
    }

    needsToDownloadSurvey() {
        return this.get('survey_downloaded', false) !== this.get('survey.version')
    }

    async load() {
        const value = await AsyncStorage.getItem(sessionKey)
        if (value !== null){
            // We have data!!
            return JSON.parse(value)
        }
        return null
    }

    async set(session) {
        this.session = session
        await AsyncStorage.setItem(sessionKey, JSON.stringify(session))
    }

    async update(data) {
        return await this.set({...this.session, ...data})
    }

    async destroy() {
        this.session = null
        await AsyncStorage.removeItem(sessionKey)
    }

    get(key, def = null) {
        return deepGet(this.session, key, def)
    }

    async login(credentials) {
        const user = await Api.login(credentials)
        await this.update({auth: user})
    }

    async refreshToken() {
        const token = await Api.refreshToken()
        await this.update({
            auth: {
                ...this.session.auth,
                token: token
            }
        })
    }

    async logout() {
        await this.update({auth: null})
    }

    getTheme() {
		if (this.get('domain') === 'philippines') {
		    return Themes.philippines
		}
		return Themes.default
    }

    bgPath() {
        const filename = this.get('domain') + '.png'
        if (Platform.OS === 'android') {
            return 'file:///android_asset/' + filename
        }
        // For iOS
        return 'file://' + RNFS.MainBundlePath + '/' + filename
    }
}

const deepGet = (object, path, def = null) => {
    if (path === null) {
        return object
    }
    if (object.hasOwnProperty(path)) {
        return object[path]
    }
    let segments = path.split('.')
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i]
        if (object == null || (typeof object !== 'object') || !object.hasOwnProperty(segment)) {
            return def
        }
        object = object[segment]
    }
    return object
}

export default new Session()