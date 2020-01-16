import NetInfo from "@react-native-community/netinfo";

class Connectivity {

    constructor() {

        this.firstChecked = false
        this.waitFirst = new Promise((resolve) => {
            this.firstResolver = resolve
        })
    }

    componentDidMount() {

        NetInfo.fetch()

        NetInfo.addEventListener((state) => {
            this.isConnected = state.isConnected
            if (!this.firstChecked) {
                this.firstResolver()
                this.firstChecked = true
            }
        })
    }

    async check() {
        await this.waitFirst
        return this.isConnected
    }
    
}

export default new Connectivity()