import NetInfo, { NetInfoState} from "@react-native-community/netinfo";

class Connectivity {

    constructor() {

        this.firstChecked = false
        this.waitFirst = new Promise((resolve) => {
            this.firstResolver = resolve
        })
    }

    componentDidMount() {
        NetInfo.addEventListener((state: NetInfoState) => {
            this.isConnected = NetInfoState.isConnected
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