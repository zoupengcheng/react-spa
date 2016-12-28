'use strict'

import React from 'react'
import { Route, IndexRoute, browserHistory } from 'react-router'
import App from '../views/Main'

// Login
import Login from '../components/modules/login/index'

// System Status
import Dashboard from '../components/modules/dashboard/index'
import SystemInformation from '../components/modules/systemInfo/index'
import ActivityCall from '../components/modules/activityCall/index'
import NetworkStatus from '../components/modules/networkStatus/index'

// Extension / Trunk
import Extension from '../components/modules/extension/index'
import CreateExtension from '../components/modules/extension/createExtension'
import EditExtension from '../components/modules/extension/editExtension'
import EditSelectedExtension from '../components/modules/extension/editSelectedExtension'
import ExtensionGroup from '../components/modules/extensionGroup/index'
import ExtensionGroupItem from '../components/modules/extensionGroup/extensionGroupItem'
import AnalogTrunk from '../components/modules/analogTrunk/'
import CreateAnalogTrunk from '../components/modules/analogTrunk/createAnalogTrunk'
import EditAnalogTrunk from '../components/modules/analogTrunk/editAnalogTrunk'
import DigitalTrunk from '../components/modules/digitalTrunk/index'
import DataTrunk from '../components/modules/dataTrunk/'
import EditDataTrunk from '../components/modules/dataTrunk/editDataTrunk'
import VoIPTrunk from '../components/modules/voipTrunk/index'
import SLAStation from '../components/modules/slaStation/index'
import SLAStationItem from '../components/modules/slaStation/slaStationItem'
import OutboundRoute from '../components/modules/outboundRoute/index'
import InboundRoute from '../components/modules/inboundRoute/index'

// Call Features
import Conference from '../components/modules/conference/index'
import IVR from '../components/modules/ivr/index'
import Voicemail from '../components/modules/voicemail/index'
import VoicemailEmailSettings from '../components/modules/voicemail/voicemailEmailSettings'
import RingGroup from '../components/modules/ringGroup/index'
import PagingIntercom from '../components/modules/pagingIntercom/index'
import CallQueue from '../components/modules/callQueue/index'
import CallQueueItem from '../components/modules/callQueue/queueItem'
import CallQueueStats from '../components/modules/callQueue/statistics'
import CallQueueCallCenter from '../components/modules/callQueue/callcenter'
import AgentLoginSettings from '../components/modules/callQueue/settings'
import PickupGroup from '../components/modules/pickupGroup/index'
import DialByName from '../components/modules/dialByName/index'
import SpeedDial from '../components/modules/speedDial/index'
import DISA from '../components/modules/disa/index'
import Callback from '../components/modules/callback/index'
import EventList from '../components/modules/eventList/index'
import FeatureCode from '../components/modules/featureCode/index'
import Fax from '../components/modules/fax/index'

// PBX Settings
import PBXGeneralSettings from '../components/modules/pbxGeneralSettings/index'
import SIPSettings from '../components/modules/sipSettings/index'
import IAXSettings from '../components/modules/iaxSettings/index'
import RTPSettings from '../components/modules/rtpSettings/index'
import MusicOnHold from '../components/modules/musicOnHold/index'
import VoicePrompt from '../components/modules/voicePrompt/index'
import JitterBuffer from '../components/modules/jitterBuffer/index'
import InterfaceSettings from '../components/modules/interfaceSettings/index'
import RecordingStorageSettings from '../components/modules/recordingStorageSettings/index'

// System Settings
import HTTPServer from '../components/modules/httpServer/index'
import NetworkSettings from '../components/modules/networkSettings/index'
import OpenVPN from '../components/modules/openVPN/index'
import DDNSSettings from '../components/modules/ddnsSettings/index'
import SecuritySettings from '../components/modules/securitySettings/index'
import LDAPServer from '../components/modules/ldapServer/index'
import TimeSettings from '../components/modules/timeSettings/index'
import EmailSettings from '../components/modules/emailSettings/index'

// Maintenance
import UserManagement from '../components/modules/userManagement/index'
import ChangePassword from '../components/modules/changePassword/index'
import OperationLog from '../components/modules/operationLog/index'
import SystemLog from '../components/modules/systemLog/index'
import SystemEvent from '../components/modules/systemEvent/index'
import Upgrade from '../components/modules/upgrade/index'
import Backup from '../components/modules/backup/index'
import CleanReset from '../components/modules/cleanReset/index'
import ServiceCheck from '../components/modules/serviceCheck/index'

// CDR
import CDR from '../components/modules/cdr/index'
import AutoDownload from '../components/modules/cdr/autoDownload'
import Statistics from '../components/modules/statistics/index'
import RecordingFile from '../components/modules/recordingFile/index'

// Value-added Features
import ZeroConfig from '../components/modules/zeroConfig/index'
import AMI from '../components/modules/ami/index'
import CTIServer from '../components/modules/ctiServer/index'
import CRM from '../components/modules/crm/index'
import PMS from '../components/modules/pms/index'
import WakeupService from '../components/modules/wakeupService/index'
import FAXSending from '../components/modules/faxSending/index'
import AnnouncementCenter from '../components/modules/announcementCenter/index'
import WebRTC from '../components/modules/webrtc/index'
import cookie from 'react-cookie'
import SubscribeEvent from '../components/api/subscribeEvent'

const routes = (state, currentLocaleData) => {
    function subscribeEvent(data) {
        if (data && data.location && data.location.pathname) {
            let arr = data.location.pathname.split("/")
            let path = arr[arr.length - 1]

            if (path && SubscribeEvent[path] && SubscribeEvent[path].subscribe) {
                SubscribeEvent[path].subscribe.map(function(item) {
                    window.socket.send(JSON.stringify(item))
                    console.log(JSON.stringify(item))
                })
            }
            window.LEAVEPAGE = path
        }
    }

    function unSubscribeEvent(data, LEAVEPAGE) {
        if (data && data.location && data.location.pathname) {
            if (LEAVEPAGE && SubscribeEvent[LEAVEPAGE] && SubscribeEvent[LEAVEPAGE].unsubscribe) {
                SubscribeEvent[LEAVEPAGE].unsubscribe.map(function(item) {
                    window.socket.send(JSON.stringify(item))
                    console.log(JSON.stringify(item))
                })
            }
            subscribeEvent(data)
        }
    }
    // Validate logon
    function requireAuth(data) {
        if (!localStorage.getItem('adminId')) {
            browserHistory.push('/login')
            return false
        }
        // unSubscribeEvent(data, window.LEAVEPAGE)
        // return state.isLogin
    }

    return (
        <div>
            <Route path="/" component={ Login }>
                {/* login */}
                <Route path="login" component={ Login } />
            </Route>

            <Route path="/" onEnter={ requireAuth } component={ App }>
                {/* System Status */}
                <Route path="system-status" onEnter={ requireAuth} breadcrumbName={ currentLocaleData["LANG585"] }>
                    <IndexRoute component={ Dashboard } />
                    <Route path="dashboard" onEnter={ requireAuth } component={ Dashboard } breadcrumbName={ currentLocaleData["LANG5261"] } />
                    <Route path="systemInformation" onEnter={ requireAuth } component={ SystemInformation } breadcrumbName={ currentLocaleData["LANG586"] } />
                    <Route path="activityCall" onEnter={ requireAuth } component={ ActivityCall } breadcrumbName={ currentLocaleData["LANG3006"] } />
                    <Route path="networkStatus" onEnter={ requireAuth } component={ NetworkStatus } breadcrumbName={ currentLocaleData["LANG4010"] } />
                </Route>

                {/* Extension / Trunk */}
                <Route path="extension-trunk" onEnter={ requireAuth } breadcrumbName={ currentLocaleData["LANG5263"] }>
                    <IndexRoute component={ Extension } />
                    <Route path="extension" onEnter={ requireAuth } breadcrumbName={ currentLocaleData["LANG87"] }>
                        <IndexRoute component={ Extension } />
                        <Route path="extension" onEnter={ requireAuth } component={ Extension } breadcrumbName={ currentLocaleData["LANG87"] } />
                        <Route path="createExtension" onEnter={ requireAuth } component={ CreateExtension } breadcrumbName={ currentLocaleData["LANG733"] } />
                        <Route path="editExtension" onEnter={ requireAuth } component={ EditExtension } breadcrumbName={ currentLocaleData["LANG733"] } /> 
                        <Route path="editSelectedExtension" onEnter={ requireAuth } component={ EditSelectedExtension } breadcrumbName={ currentLocaleData["LANG733"] } />
                    </Route>
                    <Route path="extensionGroup" onEnter={ requireAuth } breadcrumbName={ currentLocaleData["LANG2800"] }>
                        <IndexRoute component={ ExtensionGroup } />
                        <Route path="add" onEnter={ requireAuth } component={ ExtensionGroupItem } breadcrumbName={ currentLocaleData["LANG769"] } />
                        <Route path="edit/:id/:name" onEnter={ requireAuth } component={ ExtensionGroupItem } breadcrumbName={ currentLocaleData["LANG738"] } />
                    </Route>
                    <Route path="analogTrunk" onEnter={ requireAuth } breadcrumbName={ currentLocaleData["LANG639"] } >
                        <IndexRoute component={ AnalogTrunk } />
                        <Route path="analogTrunk" onEnter={ requireAuth } component={ AnalogTrunk } breadcrumbName={ currentLocaleData["LANG639"] } />
                        <Route path="createAnalogTrunk" onEnter={ requireAuth } component={ CreateAnalogTrunk } breadcrumbName={ currentLocaleData["LANG762"] } />
                        <Route path="editAnalogTrunk" onEnter={ requireAuth } component={ EditAnalogTrunk } breadcrumbName={ currentLocaleData["LANG640"] } />
                    </Route>
                    <Route path="digitalTrunk" onEnter={ requireAuth } component={ DigitalTrunk } breadcrumbName={ currentLocaleData["LANG3141"] } />
                    <Route path="dataTrunk" onEnter={ requireAuth } breadcrumbName={ currentLocaleData["LANG3573"] } >
                        <IndexRoute component={ DataTrunk } />
                        <Route path="dataTrunk" onEnter={ requireAuth } component={ DataTrunk } breadcrumbName={ currentLocaleData["LANG3573"] } />
                        <Route path="editDataTrunk" onEnter={ requireAuth } component={ EditDataTrunk } breadcrumbName={ currentLocaleData["LANG3573"] } />
                    </Route>
                    <Route path="voipTrunk" onEnter={ requireAuth } component={ VoIPTrunk } breadcrumbName={ currentLocaleData["LANG13"] } />
                    <Route path="slaStation" onEnter={ requireAuth } breadcrumbName={ currentLocaleData["LANG3225"] }>
                        <IndexRoute component={ SLAStation } />
                        <Route path="add" onEnter={ requireAuth } component={ SLAStationItem } breadcrumbName={ currentLocaleData["LANG769"] } />
                        <Route path="edit/:id/:name" onEnter={ requireAuth } component={ SLAStationItem } breadcrumbName={ currentLocaleData["LANG738"] } />
                    </Route>
                    <Route path="outboundRoute" onEnter={ requireAuth } component={ OutboundRoute } breadcrumbName={ currentLocaleData["LANG14"] } />
                    <Route path="inboundRoute" onEnter={ requireAuth } component={ InboundRoute } breadcrumbName={ currentLocaleData["LANG15"] } />
                </Route>

                {/* Call Features */}
                <Route path="call-features" onEnter={ requireAuth} breadcrumbName={ currentLocaleData["LANG17"] }>
                    <IndexRoute component={ Conference } />
                    <Route path="conference" onEnter={ requireAuth } component={ Conference } breadcrumbName={ currentLocaleData["LANG18"] } />
                    <Route path="ivr" onEnter={ requireAuth } component={ IVR } breadcrumbName={ currentLocaleData["LANG19"] } />
                    <Route path="voicemail" onEnter={ requireAuth } breadcrumbName={ currentLocaleData["LANG20"] }>
                        <IndexRoute component={ Voicemail } />
                        <Route path="voicemail" onEnter={ requireAuth } component={ Voicemail } breadcrumbName={ currentLocaleData["LANG20"] } />
                        <Route path="voicemailEmailSettings" onEnter={ requireAuth } component={ VoicemailEmailSettings } breadcrumbName={ currentLocaleData["LANG767"] } />
                    </Route>
                    <Route path="ringGroup" onEnter={ requireAuth } component={ RingGroup } breadcrumbName={ currentLocaleData["LANG22"] } />
                    <Route path="pagingIntercom" onEnter={ requireAuth } component={ PagingIntercom } breadcrumbName={ currentLocaleData["LANG23"] } />
                    <Route path="callQueue" onEnter={ requireAuth } breadcrumbName={ currentLocaleData["LANG24"] }>
                        <IndexRoute component={ CallQueue } />
                        <Route path="add" onEnter={ requireAuth } component={ CallQueueItem } breadcrumbName={ currentLocaleData["LANG769"] } />
                        <Route path="edit/:id" onEnter={ requireAuth } component={ CallQueueItem } breadcrumbName={ currentLocaleData["LANG738"] } />
                        <Route path="statistics" onEnter={ requireAuth } component={ CallQueueStats } breadcrumbName={ currentLocaleData["LANG8"] } />
                        <Route path="callcenter" onEnter={ requireAuth } component={ CallQueueCallCenter } breadcrumbName={ currentLocaleData["LANG5407"] } />
                        <Route path="settings" onEnter={ requireAuth } component={ AgentLoginSettings } breadcrumbName={ currentLocaleData["LANG748"] } />
                    </Route>
                    <Route path="pickupGroup" onEnter={ requireAuth } component={ PickupGroup } breadcrumbName={ currentLocaleData["LANG2510"] } />
                    <Route path="dialByName" onEnter={ requireAuth } component={ DialByName } breadcrumbName={ currentLocaleData["LANG2884"] } />
                    <Route path="speedDial" onEnter={ requireAuth } component={ SpeedDial } breadcrumbName={ currentLocaleData["LANG3501"] } />
                    <Route path="disa" onEnter={ requireAuth } component={ DISA } breadcrumbName={ currentLocaleData["LANG2353"] } />
                    <Route path="callback" onEnter={ requireAuth } component={ Callback } breadcrumbName={ currentLocaleData["LANG3741"] } />
                    <Route path="eventList" onEnter={ requireAuth } component={ EventList } breadcrumbName={ currentLocaleData["LANG2474"] } />
                    <Route path="featureCode" onEnter={ requireAuth } component={ FeatureCode } breadcrumbName={ currentLocaleData["LANG26"] } />
                    <Route path="fax" onEnter={ requireAuth } component={ Fax } breadcrumbName={ currentLocaleData["LANG29"] } />
                </Route>

                {/* PBX Settings */}
                <Route path="pbx-settings" onEnter={ requireAuth} breadcrumbName={ currentLocaleData["LANG5299"] }>
                    <IndexRoute component={ PBXGeneralSettings } />
                    <Route path="pbxGeneralSettings" onEnter={ requireAuth } component={ PBXGeneralSettings } breadcrumbName={ currentLocaleData["LANG3949"] } />
                    <Route path="sipSettings" onEnter={ requireAuth } component={ SIPSettings } breadcrumbName={ currentLocaleData["LANG39"] } />
                    <Route path="iaxSettings" onEnter={ requireAuth } component={ IAXSettings } breadcrumbName={ currentLocaleData["LANG34"] } />
                    <Route path="rtpSettings" onEnter={ requireAuth } component={ RTPSettings } breadcrumbName={ currentLocaleData["LANG30"] } />
                    <Route path="musicOnHold" onEnter={ requireAuth } component={ MusicOnHold } breadcrumbName={ currentLocaleData["LANG27"] } />
                    <Route path="voicePrompt" onEnter={ requireAuth } component={ VoicePrompt } breadcrumbName={ currentLocaleData["LANG4752"] } />
                    <Route path="jitterBuffer" onEnter={ requireAuth } component={ JitterBuffer } breadcrumbName={ currentLocaleData["LANG40"] } />
                    <Route path="interfaceSettings" onEnter={ requireAuth } component={ InterfaceSettings } breadcrumbName={ currentLocaleData["LANG5303"] } />
                    <Route path="recordingStorageSettings" onEnter={ requireAuth } component={ RecordingStorageSettings } breadcrumbName={ currentLocaleData["LANG5304"] } />
                </Route>

                {/* System Settings */}
                <Route path="system-settings" onEnter={ requireAuth} breadcrumbName={ currentLocaleData["LANG5300"] }>
                    <IndexRoute component={ HTTPServer } />
                    <Route path="httpServer" onEnter={ requireAuth } component={ HTTPServer } breadcrumbName={ currentLocaleData["LANG57"] } />
                    <Route path="networkSettings" onEnter={ requireAuth } component={ NetworkSettings } breadcrumbName={ currentLocaleData["LANG48"] } />
                    <Route path="openVPN" onEnter={ requireAuth } component={ OpenVPN } breadcrumbName={ currentLocaleData["LANG3990"] } />
                    <Route path="ddnsSettings" onEnter={ requireAuth } component={ DDNSSettings } breadcrumbName={ currentLocaleData["LANG4040"] } />
                    <Route path="securitySettings" onEnter={ requireAuth } component={ SecuritySettings } breadcrumbName={ currentLocaleData["LANG5301"] } />
                    <Route path="ldapServer" onEnter={ requireAuth } component={ LDAPServer } breadcrumbName={ currentLocaleData["LANG56"] } />
                    <Route path="timeSettings" onEnter={ requireAuth } component={ TimeSettings } breadcrumbName={ currentLocaleData["LANG718"] } />
                    <Route path="emailSettings" onEnter={ requireAuth } component={ EmailSettings } breadcrumbName={ currentLocaleData["LANG58"] } />
                </Route>

                {/* Maintenance */}
                <Route path="maintenance" onEnter={ requireAuth} breadcrumbName={ currentLocaleData["LANG60"] }>
                    <IndexRoute component={ UserManagement } />
                    <Route path="userManagement" onEnter={ requireAuth } component={ UserManagement } breadcrumbName={ currentLocaleData["LANG3859"] } />
                    <Route path="changePassword" onEnter={ requireAuth } component={ ChangePassword } breadcrumbName={ currentLocaleData["LANG55"] } />
                    <Route path="operationLog" onEnter={ requireAuth } component={ OperationLog } breadcrumbName={ currentLocaleData["LANG3908"] } />
                    <Route path="systemLog" onEnter={ requireAuth } component={ SystemLog } breadcrumbName={ currentLocaleData["LANG67"] } />
                    <Route path="systemEvent" onEnter={ requireAuth } component={ SystemEvent } breadcrumbName={ currentLocaleData["LANG2580"] } />
                    <Route path="upgrade" onEnter={ requireAuth } component={ Upgrade } breadcrumbName={ currentLocaleData["LANG61"] } />
                    <Route path="backup" onEnter={ requireAuth } component={ Backup } breadcrumbName={ currentLocaleData["LANG62"] } />
                    <Route path="cleanReset" onEnter={ requireAuth } component={ CleanReset } breadcrumbName={ currentLocaleData["LANG5302"] } />
                    <Route path="serviceCheck" onEnter={ requireAuth } component={ ServiceCheck } breadcrumbName={ currentLocaleData["LANG3437"] } />
                </Route>

                {/* CDR */}
                <Route path="cdr" onEnter={ requireAuth} breadcrumbName={ currentLocaleData["LANG7"] }>
                    <IndexRoute component={ CDR } />
                    <Route path="cdr" onEnter={ requireAuth } component={ CDR } breadcrumbName={ currentLocaleData["LANG7"] } />
                    <Route path="statistics" onEnter={ requireAuth } component={ Statistics } breadcrumbName={ currentLocaleData["LANG8"] } />
                    <Route path="recordingFile" onEnter={ requireAuth } component={ RecordingFile } breadcrumbName={ currentLocaleData["LANG2640"] } />
                    <Route path="autoDownload" onEnter={ requireAuth } component={ AutoDownload } breadcrumbName={ currentLocaleData["LANG3955"] } />
                </Route>

                {/* Value-added Features */}
                <Route path="value-added-features" onEnter={ requireAuth} breadcrumbName={ currentLocaleData["LANG4066"] }>
                    <IndexRoute component={ ZeroConfig } />
                    <Route path="zeroConfig" onEnter={ requireAuth } component={ ZeroConfig } breadcrumbName={ currentLocaleData["LANG16"] } />
                    <Route path="ami" onEnter={ requireAuth } component={ AMI } breadcrumbName={ currentLocaleData["LANG3525"] } />
                    <Route path="ctiServer" onEnter={ requireAuth } component={ CTIServer } breadcrumbName={ currentLocaleData["LANG4815"] } />
                    <Route path="crm" onEnter={ requireAuth } component={ CRM } breadcrumbName={ currentLocaleData["LANG5110"] } />
                    <Route path="pms" onEnter={ requireAuth } component={ PMS } breadcrumbName={ currentLocaleData["LANG4855"] } />
                    <Route path="wakeupService" onEnter={ requireAuth } component={ WakeupService } breadcrumbName={ currentLocaleData["LANG4858"] } />
                    <Route path="faxSending" onEnter={ requireAuth } component={ FAXSending } breadcrumbName={ currentLocaleData["LANG4067"] } />
                    <Route path="announcementCenter" onEnter={ requireAuth } component={ AnnouncementCenter } breadcrumbName={ currentLocaleData["LANG4338"] } />
                    <Route path="webrtc" onEnter={ requireAuth } component={ WebRTC } breadcrumbName={ currentLocaleData["LANG4263"] } />
                </Route>
            </Route>
        </div>
    )
}

export default routes