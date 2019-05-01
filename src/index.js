import Defaults from './Defaults'
import AppCoreFactory from './AppCore'

export {default as App} from "./App/Main"

export const AppCore = new AppCoreFactory(Defaults)
