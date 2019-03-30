SSAS App Core
===================


App core contains `React Native` code shared across apps that work in tandem with [SSAS Core Portals](https://github.com/swiftmade/ssas-core).

### Main Functionality

* 🔗 Domain selection.
* 👤 Facilitate/enforce user authentication.
* 📦 Connect to portal and download latest survey + survey assets.
* 📜 Integrates with [SSAS Enketo v2](https://github.com/swiftmade/ssas-enketo).
* 📱Customizable UI to collect and upload surveys.
* 📡 Ability to check for updates from the app.


### Usage

> Note: App Core is designed to work with React Native v0.59+.

1. Create a new React Native project.
2. You must have these packages installed and linked:

```js
{
    "react-native-fs": "^2.13.3",
    "react-native-message-bar": "^2.0.10",
    "react-native-vector-icons": "^6.4.2",
    "react-native-webview": "^5.4.6",
    "react-native-zip-archive": "^4.0.0",
    "react-navigation": "^1.5.8"
}
```

3. Add this package as a dependency: `yarn add ssas-app-core`

Rest of the documentation: WIP