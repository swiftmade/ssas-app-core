import axios from "axios";
import RNFS from "react-native-fs";

import Session from "./Session";
import {AppCore} from "../";

class Api {
    
    constructor() {
        this.baseUrl = null
    }

    _configure() {
        axios.defaults.baseURL = this.baseUrl
    }

    setDomain(domain) {
        this.baseUrl = AppCore.get('endpoint').replace(
            '%domain%',
            domain
        )
        this._configure()
    }

    configureFromSession() {
        this.setDomain(Session.get('domain'))
    }

    meta() {
        return axios.get('meta').then((response) => {
            return response.data
        })
    }

    surveyZipUrl() {
        return axios.defaults.baseURL + '/survey_zip_download'
    }

    login(credentials) {
        if (!credentials.email || !credentials.password) {
            throw new Error('Fill in both e-mail and password fields!')
        }
        return axios.post('login', credentials)
            .then((response) => {
                return response.data
            })
            .catch(() => {
                throw new Error('Invalid e-mail or password.')
            })
    }

    refreshToken() {
        return axios.get('refresh_token?token=' + Session.get('auth.token'))
            .then((response) => {
                return response.data.token.replace('Bearer ', '')
            })
            .catch(() => {
                throw new Error('Session expired!')
            })
    }

    requestHeaders() {
        const headers = {}
        if(Session.get('auth.token')) {
            headers['Authorization'] = 'Bearer ' + Session.get('auth.token')
        }
        return headers
    }

    async downloadSurveyZip(destination, onProgress) {
        // TODO: Add token if found

        const fromUrl = this.surveyZipUrl()
        console.log(`Downloading zip from ${fromUrl} to ${destination}...`)
        
        const result = await RNFS.downloadFile({
            fromUrl,
            toFile: destination,
            progress: (progress) => {
                onProgress(progress.bytesWritten / progress.contentLength)
            },
            headers: this.requestHeaders(),
        }).promise

        if (result.statusCode !== 200) {
            throw new Error('Survey could not be downloaded. Code: ' + result.statusCode)
        }
    }
}

export default new Api()