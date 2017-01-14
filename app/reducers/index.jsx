import { combineReducers } from 'redux'
import {GET_STORAGEUSAGE, GET_RESOURCEUSAGE, DIFF_RESOURCEUSAGE, GET_PBXSTATUS, LISTAllTRUNK, GET_INTERFACESTATUS} from '../actions/'
import msg from './message'
import systemInfo from '../components/modules/systemInfo/reducers/getNetworkInformation'
import systemGeneralStatus from '../components/modules/systemInfo/reducers/getSystemGeneralStatus'
import systemStatus from '../components/modules/systemInfo/reducers/getSystemStatus'
// import ctiServer from '../components/modules/ctiServer/reducers/getCTIMidSettings'
// import serviceCheck from '../components/modules/serviceCheck/reducers/getServiceCheck'
import account from '../components/modules/extension/reducers/listAccount'

const storageUsage = (state = {}, action) => {
    switch (action.type) {
        case GET_STORAGEUSAGE:
            return action.storageUsage
        default:
            return state
    }
}

const resourceUsage = (state = {}, action) => {
    switch (action.type) {
        case GET_RESOURCEUSAGE:
            return action.resourceUsage
        case DIFF_RESOURCEUSAGE:
            return action.resourceUsage
        default:
            return state
    }
}

const pbxStatus = (state = {}, action) => {
    switch (action.type) {
        case GET_PBXSTATUS:
            return action.pbxStatus
        default:
            return state
    }
}

const trunksData = (state = [], action) => {
    switch (action.type) {
        case LISTAllTRUNK:
            return action.trunksData
        default:
            return state
    }
}

const interfaceStatus = (state = {}, action) => {
    switch (action.type) {
        case GET_INTERFACESTATUS:
            return action.interfaceStatus
        default:
            return state
    }
}

// ues redux's combineReducers
const rootReducer = combineReducers({
    msg,
    systemInfo,
    systemGeneralStatus,
    systemStatus,
    // ctiServer,
    // serviceCheck,
    storageUsage,
    resourceUsage,
    pbxStatus,
    trunksData,
    account,
    interfaceStatus

})

export default rootReducer
