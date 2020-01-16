import NetInfo from "@react-native-community/netinfo";

class Connectivity {

    constructor() {

        this.firstChecked = false
        this.waitFirst = new Promise((resolve) => {
            this.firstResolver = resolve
        })
    }

    componentDidMount() {

        NetInfo.fetch().then(state => {
            console.log('Is connected?: ' + state.isConnected);
        });

        NetInfo.addEventListener((state) => {
            this.isConnected = state.isConnected
            if (!this.firstChecked) {
                this.firstResolver()
                this.firstChecked = true
            }
            console.log(state.isConnected);
        })
    }

    async check() {
        await this.waitFirst
        return this.isConnected
    }
    
}

export default new Connectivity()