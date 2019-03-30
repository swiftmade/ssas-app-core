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

##### 1. Create a new React Native project.
##### 2. You must have these packages installed and linked:

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

 Add this package as a dependency:

```bash
yarn add ssas-app-core
```

##### 4. Link `ssas-enketo` with your Android and iOS projects.

###### Android

```bash
# Creates symlink for Android.
# Run this in the root folder of your project.

cd android/app/src/main/assets
ln -s ../../../../../node_modules/ssas-enketo/www www
```

###### iOS

- Open your app's iOS project in XCode.
- Open your app's root directory in Finder and go to `node_modules/ssas-enketo`
- Drag and drop www folder to your XCode project. (As a reference. Don't copy)


##### 5. Integrating SSAS App Core with your React Native App

###### Android

First, make sure your `android/app/src/main/AndroidManifest.xml` contains the following permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Rest of the documentation: WIP