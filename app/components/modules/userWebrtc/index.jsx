'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Input, Row, Col, Icon, Table, Button, message, Modal, Menu, Dropdown, Popconfirm, Select, Tooltip } from 'antd'
import { FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl'
import Title from '../../../views/title'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'

const FormItem = Form.Item
const baseServerURl = api.apiHost

global.checkPingTimer = null
global.oSipStack = null
global.oSipSessionRegister = null
global.oSipSessionCall = null
global.oSipSessionTransferCall = null
global.sipUnRegisterFlag = true
// var sTransferNumber
// var oRingTone, oRingbackTone
// var videoRemote, videoLocal, audioRemote
// var bFullScreen = false
// var oNotifICall
// var bDisableVideo = false
// var viewVideoLocal, viewVideoRemote, viewLocalScreencast // <video> (webrtc) or <div> (webrtc4all)
// var oConfigCall
// var oReadyStateTimer

class UserWebrtc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            txtRegStatusMsg: "",
            oWebrtcInputConf: {},
            SIPWebRTCHttpSettings: {}
        }
        this._handleSubmit = (e) => {
            const { formatMessage } = this.props.intl
            const form = this.props.form 

            let action = {}

            this.props.form.validateFieldsAndScroll((err, values) => {
                let me = this
                let refs = this.refs

                for (let key in values) {
                    if (values.hasOwnProperty(key)) {
                        let divKey = refs["div_" + key]

                        if (!err || (err && typeof err[key] === "undefined")) {
                            action[key] = values[key]  
                        } else {
                            return
                        }
                    }
                }
            })
        }
        this._handleCancel = () => {
            browserHistory.push('/user-value-added-features/userWebrtc')
        }
    }
    componentDidMount() {
        if (window.console) {
            window.console.info("location=" + window.location)
        }
        this._loadEnableWebrtcDefault()
        this._loadWebrtcInputConf()
    }
    componentWillUnmount() {

    }
    _loadEnableWebrtcDefault = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        let ucm_user_name = localStorage.getItem("username")

        $.ajax({
            url: baseServerURl,
            type: "POST",
            dataType: "json",
            data: {
                action: "listAccount",
                options: "account_type"
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    let res = data.response

                    if (res) {
                        let account = res.account,
                            extType = account[0] ? account[0].account_type.slice(0, 3) : ""

                        if (extType.toLowerCase() !== 'sip') {
                            message.error(formatMessage({ id: "LANG4450" }))
                        } else {
                            $.ajax({
                                type: "POST",
                                url: baseServerURl,
                                data: {
                                    action: "getSIPAccount",
                                    extension: ucm_user_name
                                },
                                success: function(data) {
                                    let bool = UCMGUI.errorHandler(data, null, formatMessage)

                                    if (bool) {
                                        let res = data.response.extension,
                                            enable_webrtc = res.enable_webrtc,
                                            secret = res.secret

                                        // txtPassword.value = secret

                                        if (enable_webrtc === 'yes') {
                                            // loadWebrtcInputConf()

                                            if (getFieldValue("txtPrivateIdentity") === '' || getFieldValue("txtWebsocketServerUrl") === '') {
                                                $.ajax({
                                                    type: "POST",
                                                    url: baseServerURl,
                                                    data: {
                                                        action: "getSIPWebRTCHttpSettings"
                                                    },
                                                    success: function(data) {
                                                        let bool = UCMGUI.errorHandler(data, null, formatMessage)

                                                        if (bool) {
                                                            let res = data.response.webrtc_http_settings,
                                                                bindaddr = ((res.bindaddr === '0.0.0.0' || res.bindaddr === null) ? location.hostname : res.bindaddr),
                                                                bindport = (res.bindport === null ? '8088' : res.bindport),
                                                                SIPWebRTCHttpSettings = {}

                                                            SIPWebRTCHttpSettings["txtDisplayName"] = ucm_user_name
                                                            SIPWebRTCHttpSettings["txtPrivateIdentity"] = ucm_user_name 
                                                            SIPWebRTCHttpSettings["txtPublicIdentity"] = 'sip:' + ucm_user_name + '@' + bindaddr
                                                            SIPWebRTCHttpSettings["txtPassword"] = secret
                                                            SIPWebRTCHttpSettings["txtWebsocketServerUrl"] = 'ws://' + bindaddr + ':' + bindport + '/ws'
                                                            
                                                            this.setState({
                                                                SIPWebRTCHttpSettings: SIPWebRTCHttpSettings
                                                            })
                                                        }
                                                    }.bind(this)
                                                })
                                            }
                                        } else {
                                            message.error(formatMessage({ id: "LANG4450" }))
                                        }
                                    }
                                }.bind(this)
                            })
                        }
                    }
                }
            }.bind(this)
        })
    }
    _loadWebrtcInputConf = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        let ucm_user_name = localStorage.getItem("username")

        $.ajax({
            url: baseServerURl,
            data: {
                action: "getWebRTCUserLogins",
                user_name: ucm_user_name
            },
            type: 'POST',
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    let oWebrtcInputConf = data.response.user_name

                    // $('#txtDisplayName').val(oWebrtcInputConf.register_account_name || '')
                    // $('#txtPrivateIdentity').val(oWebrtcInputConf.register_extension || '')
                    // $('#txtPublicIdentity').val(oWebrtcInputConf.register_public_id || '')
                    // $('#txtPassword').val(oWebrtcInputConf.register_password || '')
                    // $('#txtWebsocketServerUrl').val(oWebrtcInputConf.register_server_url || '')
                    // $('#txtPhoneNumber').val(oWebrtcInputConf.dial_number || '')

                    this.setState({
                        oWebrtcInputConf: oWebrtcInputConf,
                        SIPWebRTCHttpSettings: oWebrtcInputConf
                    })
                }
            }.bind(this)
        })
    }
    _advanceSettings = () => {
        browserHistory.push({
            pathname: '/user-value-added-features/userWebrtc/settings',
            state: this.state.oWebrtcInputConf
        })
    }
    _saveCredentials = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        let ucm_user_name = localStorage.getItem("username")

        let action = {
            'action': 'updateWebRTCUserLogins',
            'user_name': ucm_user_name,
            'register_account_name': getFieldValue('txtDisplayName'),
            'register_extension': getFieldValue('txtPrivateIdentity'),
            'register_public_id': getFieldValue('txtPublicIdentity'),
            'register_password': getFieldValue('txtPassword'),
            'register_server_url': getFieldValue('txtWebsocketServerUrl'),
            'dial_number': getFieldValue('txtPhoneNumber')
        }

        $.ajax({
            type: "post",
            url: "../cgi",
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {}
            }
        })
    }
    // sends SIP REGISTER request to login
    _sipRegister = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        let ucm_user_name = localStorage.getItem("username")

        // catch exception for IE (DOM not ready)
        try {
            this.setState({
                isBtnRegisterDisabled: true
            })
            if (!getFieldValue("txtPrivateIdentity") || !getFieldValue("txtPublicIdentity")) {
                this.setState({
                    txtRegStatusMsg: "<b>Please fill madatory fields (*)</b>",
                    isBtnRegisterDisabled: false
                })
                return
            }
            let o_impu = tsip_uri.prototype.Parse(getFieldValue("txtPublicIdentity"))
            if (!o_impu || !o_impu.s_user_name || !o_impu.s_host) {
                this.setState({
                    txtRegStatusMsg: "<b>[" + getFieldValue("txtPublicIdentity") + "] is not a valid Public identity</b>",
                    isBtnRegisterDisabled: false
                })
                return
            }

            // enable notifications if not already done
            if (window.webkitNotifications && window.webkitNotifications.checkPermission() !== 0) {
                window.webkitNotifications.requestPermission()
            }

            // save credentials
            this._saveCredentials()

            let oWebrtcInputConf = this.state.oWebrtcInputConf
            // update debug level to be sure new values will be used if the user haven't updated the page
            SIPml.setDebugLevel((oWebrtcInputConf.disable_debug_messages === "yes") ? "error" : "info")

            // create SIP stack
            global.oSipStack = new SIPml.Stack({
                realm: 'grandstream',
                impi: getFieldValue("txtPrivateIdentity"),
                impu: getFieldValue("txtPublicIdentity"),
                password: getFieldValue("txtPassword"),
                display_name: getFieldValue("txtDisplayName"),
                websocket_proxy_url: getFieldValue("txtWebsocketServerUrl"),
                outbound_proxy_url: oWebrtcInputConf.sip_outbound_proxy_url,
                ice_servers: tsk_string_to_object(oWebrtcInputConf.ice_service),
                enable_rtcweb_breaker: oWebrtcInputConf.enable_webrtc_breaker === "yes",
                events_listener: {
                    events: '*',
                    listener: this._onSipEventStack
                },
                enable_early_ims: oWebrtcInputConf.disable_3gpp_early_ims !== "yes", // Must be true unless you're using a real IMS network
                enable_media_stream_cache: oWebrtcInputConf.cache_media_stream === "yes",
                bandwidth: tsk_string_to_object(oWebrtcInputConf.max_bandwidth), // could be redefined a session-level
                video_size: tsk_string_to_object(oWebrtcInputConf.video_size), // could be redefined a session-level
                sip_headers: [{
                    name: 'User-Agent',
                    value: 'IM-client/OMA1.0 sipML5-v1.2015.03.18'
                }, {
                    name: 'Organization',
                    value: 'Doubango Telecom'
                }]
            })
            if (global.oSipStack.start() !== 0) {
                this.state({
                    txtRegStatusMsg: '<b>Failed to start the SIP stack</b>'
                })
            } else return
        } catch (e) {
                this.state({
                    txtRegStatusMsg: "<b>2:" + e + "</b>"
                })
        }
        this.state({
            isBtnRegisterDisabled: false
        })
    }
    // sends SIP REGISTER (expires=0) to logout
    _sipUnRegister = () => {
        // sipUnRegisterFlag = false
        // if (oSipStack) {
        //     oSipStack.stop() // shutdown all sessions
        // }
    }
    _sipHangUp = () => {

    }
    // Callback function for SIP Stacks
    _onSipEventStack = (e) => { /* SIPml.Stack.Event */ 
        tsk_utils_log_info('==stack event = ' + e.type)
        let oSipSessionCall = global.oSipSessionCall,
            oSipSessionRegister = global.oSipSessionRegister,
            sipUnRegisterFlag = global.sipUnRegisterFlag,
            oConfigCall = global.oConfigCall

        switch (e.type) {
            case 'started':
                {
                    // catch exception for IE (DOM not ready)
                    try {
                        // LogIn (REGISTER) as soon as the stack finish starting
                        oSipSessionRegister = this.newSession('register', {
                            expires: 200,
                            events_listener: {
                                events: '*',
                                listener: this._onSipEventSession
                            },
                            sip_caps: [{
                                    name: '+g.oma.sip-im',
                                    value: null
                                },
                                // { name: '+sip.ice' }, // rfc5768: FIXME doesn't work with Polycom TelePresence
                                {
                                    name: '+audio',
                                    value: null
                                }, {
                                    name: 'language',
                                    value: '\"en,fr\"'
                                }
                            ]
                        })
                        oSipSessionRegister.register()
                    } catch (e) {
                        this.setState({
                            txtRegStatusMsg: "<b>1:" + e + "</b>",
                            isBtnRegisterDisabled: false
                        })
                    }
                    break
                }
            case 'stopping':
            case 'stopped':
            case 'failed_to_start':
            case 'failed_to_stop':
                {
                    window.clearInterval(global.checkPingTimer)
                    let bFailure = (e.type === 'failed_to_start') || (e.type === 'failed_to_stop')
                    // oSipStack = null
                    oSipSessionRegister = null
                    oSipSessionCall = null

                    // uiOnConnectionEvent(false, false)
                    // stopRingbackTone()
                    // stopRingTone()
                    // uiVideoDisplayShowHide(false)

                    // divCallOptions.style.display = 'none'
                    // btnHoldResume.disabled = false
                    // btnTransfer.disabled = false
                    // txtCallStatus.innerHTML = ''
                    this.setState({
                        txtRegStatusMsg: bFailure ? "<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>"
                    })
                    if (sipUnRegisterFlag) {
                        this._sipUnRegister()
                    }
                    break
                }

            case 'i_new_call':
                {
                    if (oSipSessionCall) {
                        // do not accept the incoming call if we're already 'in call'
                        e.newSession.hangup() // comment this line for multi-line support
                    } else {
                        oSipSessionCall = e.newSession
                        // start listening for events
                        oSipSessionCall.setConfiguration(oConfigCall)

                        // scroll to bottom before answer a call
                        // scrollToBottom()
                        // uiBtnCallSetText('Answer')
                        // btnHangUp.value = 'Reject'
                        // btnCall.disabled = false
                        // btnHangUp.disabled = false

                        // startRingTone()

                        // let sRemoteNumber = (oSipSessionCall.getRemoteFriendlyName() || 'unknown')
                        // txtCallStatus.innerHTML = "<i>Incoming call from <b>" + (sRemoteCalleeName ? (sRemoteCalleeName + ' ') : '')  + '[' + sRemoteNumber + "]</b></i>"
                        // txtPhoneNumber.value = sRemoteNumber
                        // showNotifICall(sRemoteNumber)
                    }
                    break
                }

            case 'm_permission_requested':
                {
                    // divGlassPanel.style.visibility = 'visible'
                    break
                }
            case 'm_permission_accepted':
            case 'm_permission_refused':
                {
                    // divGlassPanel.style.visibility = 'hidden'
                    // if (e.type == 'm_permission_refused') {
                    //     uiCallTerminated('Media stream permission denied')
                    // }
                    break
                }

            case 'starting':
            default:
                break
        }
    }
    // Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
    _onSipEventSession = (e) => { /* SIPml.Session.Event */
        tsk_utils_log_info('==session event = ' + e.type)

        // switch (e.type) {
        //     case 'connecting':
        //     case 'connected':
        //         {
        //             var bConnected = (e.type == 'connected')
        //             if (e.session == oSipSessionRegister) {
        //                 uiOnConnectionEvent(bConnected, !bConnected)
        //                 txtRegStatus.innerHTML = "<i>" + e.description + "</i>"
        //             } else if (e.session == oSipSessionCall) {
        //                 btnHangUp.value = 'HangUp'
        //                 btnCall.disabled = true
        //                 btnHangUp.disabled = false
        //                 btnTransfer.disabled = false

        //                 if (window.btnBFCP) window.btnBFCP.disabled = false

        //                 if (bConnected) {
        //                     stopRingbackTone()
        //                     stopRingTone()

        //                     if (oNotifICall) {
        //                         oNotifICall.cancel()
        //                         oNotifICall = null
        //                     }
        //                 }

        //                 txtCallStatus.innerHTML = "<i>" + e.description + "</i>"

        //                 if (e.session.o_session.o_uri_to.s_user_name !== txtPrivateIdentity.value) {
        //                     divCallOptions.style.display = bConnected ? 'inline-block' : 'none'
        //                     if (btnHangUp.disabled) {
        //                         divCallOptions.style.display = "none"
        //                     }
        //                     if (bConnected) {
        //                         btnHoldResume.disabled = false
        //                         btnTransfer.disabled = false
        //                     }
        //                 }

        //                 if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback
        //                     uiVideoDisplayEvent(false, true)
        //                     uiVideoDisplayEvent(true, true)
        //                 }
        //             }
        //             break
        //         } // 'connecting' | 'connected'
        //     case 'terminating':
        //     case 'terminated':
        //         {
        //             if (e.session == oSipSessionRegister) {
        //                 uiOnConnectionEvent(false, false)

        //                 oSipSessionCall = null
        //                 oSipSessionRegister = null

        //                 txtRegStatus.innerHTML = "<i>" + e.description + "</i>"
        //             } else if (e.session == oSipSessionCall) {
        //                 if (e.description === 'Request Cancelled') {
        //                     divGlassPanel.style.visibility = 'hidden'
        //                 }

        //                 uiCallTerminated(e.description)
        //             }
        //             break
        //         } // 'terminating' | 'terminated'

        //     case 'm_stream_video_local_added':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 uiVideoDisplayEvent(true, true)
        //             }
        //             break
        //         }
        //     case 'm_stream_video_local_removed':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 uiVideoDisplayEvent(true, false)
        //             }
        //             break
        //         }
        //     case 'm_stream_video_remote_added':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 uiVideoDisplayEvent(false, true)
        //             }
        //             break
        //         }
        //     case 'm_stream_video_remote_removed':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 uiVideoDisplayEvent(false, false)
        //             }
        //             break
        //         }

        //     case 'm_stream_audio_local_added':
        //     case 'm_stream_audio_local_removed':
        //     case 'm_stream_audio_remote_added':
        //     case 'm_stream_audio_remote_removed':
        //         {
        //             break
        //         }

        //     case 'i_ect_new_call':
        //         {
        //             oSipSessionTransferCall = e.session
        //             break
        //         }

        //     case 'i_ao_request':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 var iSipResponseCode = e.getSipResponseCode()
        //                 if (iSipResponseCode == 180 || iSipResponseCode == 183) {
        //                     startRingbackTone()
        //                     txtCallStatus.innerHTML = '<i>Remote ringing...</i>'
        //                 }
        //             }
        //             break
        //         }

        //     case 'm_early_media':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 stopRingbackTone()
        //                 stopRingTone()
        //                 txtCallStatus.innerHTML = '<i>Early media started</i>'
        //             }
        //             break
        //         }

        //     case 'm_local_hold_ok':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 if (oSipSessionCall.bTransfering) {
        //                     oSipSessionCall.bTransfering = false
        //                     // this.AVSession.TransferCall(this.transferUri)
        //                 }
        //                 btnHoldResume.value = 'Resume'
        //                 btnHoldResume.disabled = false
        //                 txtCallStatus.innerHTML = '<i>Call placed on hold</i>'
        //                 oSipSessionCall.bHeld = true
        //             }
        //             break
        //         }
        //     case 'm_local_hold_nok':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 oSipSessionCall.bTransfering = false
        //                 btnHoldResume.value = 'Hold'
        //                 btnHoldResume.disabled = false
        //                 txtCallStatus.innerHTML = '<i>Failed to place remote party on hold</i>'
        //             }
        //             break
        //         }
        //     case 'm_local_resume_ok':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 oSipSessionCall.bTransfering = false
        //                 btnHoldResume.value = 'Hold'
        //                 btnHoldResume.disabled = false
        //                 txtCallStatus.innerHTML = '<i>Call taken off hold</i>'
        //                 oSipSessionCall.bHeld = false

        //                 if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback yet
        //                     uiVideoDisplayEvent(false, true)
        //                     uiVideoDisplayEvent(true, true)
        //                 }
        //             }
        //             break
        //         }
        //     case 'm_local_resume_nok':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 oSipSessionCall.bTransfering = false
        //                 btnHoldResume.disabled = false
        //                 txtCallStatus.innerHTML = '<i>Failed to unhold call</i>'
        //             }
        //             break
        //         }
        //     case 'm_remote_hold':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 txtCallStatus.innerHTML = '<i>Placed on hold by remote party</i>'
        //             }
        //             break
        //         }
        //     case 'm_remote_resume':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 txtCallStatus.innerHTML = '<i>Taken off hold by remote party</i>'
        //             }
        //             break
        //         }
        //     case 'm_bfcp_info':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 txtCallStatus.innerHTML = 'BFCP Info: <i>' + e.description + '</i>'
        //             }
        //             break
        //         }

        //     case 'o_ect_trying':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 txtCallStatus.innerHTML = '<i>Call transfer in progress...</i>'
        //             }
        //             break
        //         }
        //     case 'o_ect_accepted':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 txtCallStatus.innerHTML = '<i>Call transfer accepted</i>'
        //             }
        //             break
        //         }
        //     case 'o_ect_completed':
        //     case 'i_ect_completed':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 txtCallStatus.innerHTML = '<i>Call transfer completed</i>'
        //                 btnTransfer.disabled = false
        //                 if (oSipSessionTransferCall) {
        //                     oSipSessionCall = oSipSessionTransferCall
        //                 }
        //                 oSipSessionTransferCall = null
        //             }
        //             break
        //         }
        //     case 'o_ect_failed':
        //     case 'i_ect_failed':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 txtCallStatus.innerHTML = '<i>Call transfer failed</i>'
        //                 btnTransfer.disabled = false
        //             }
        //             break
        //         }
        //     case 'o_ect_notify':
        //     case 'i_ect_notify':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 txtCallStatus.innerHTML = "<i>Call Transfer: <b>" + e.getSipResponseCode() + " " + e.description + "</b></i>"
        //                 if (e.getSipResponseCode() >= 300) {
        //                     if (oSipSessionCall.bHeld) {
        //                         oSipSessionCall.resume()
        //                     }
        //                     btnTransfer.disabled = false
        //                 }
        //             }
        //             break
        //         }
        //     case 'i_ect_requested':
        //         {
        //             if (e.session == oSipSessionCall) {
        //                 var s_message = "Do you accept call transfer to [" + e.getTransferDestinationFriendlyName() + "]?" //FIXME
        //                 if (confirm(s_message)) {
        //                     txtCallStatus.innerHTML = "<i>Call transfer in progress...</i>"
        //                     oSipSessionCall.acceptTransfer()
        //                     break
        //                 }
        //                 oSipSessionCall.rejectTransfer()
        //             }
        //             break
        //         }
        // }
    }
    render() {
        const {formatMessage} = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const state = this.state
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }
        let SIPWebRTCHttpSettings = state.SIPWebRTCHttpSettings

        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG4263"})
        })
        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG4263"}) }  
                    isDisplay='hidden' 
                />
                <div className="content">
                    <div className="top-button">
                        <Button icon="setting" type="primary" size="default" onClick={ this._advanceSettings }>
                            { formatMessage({id: "LANG229"}) }
                        </Button>
                    </div>
                    <Form>
                        <div className={ "display-block" }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG3015"}) }</span>
                            </div>
                            <div className="section-body">
                                {/* 是否注册 */}
                                <FormItem
                                    { ...formItemLayout }
                                    label="">
                                    <span ref="txtRegStatus" dangerouslySetInnerHTML={{__html: state.txtRegStatusMsg}}></span>
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG4231" />}>
                                            <span>{ formatMessage({id: "LANG4230"}) }</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('txtDisplayName', {
                                        rules: [],
                                        initialValue: SIPWebRTCHttpSettings.txtDisplayName || ""
                                    })(
                                        <Input></Input>
                                    )}
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1064" />}>
                                            <span>{ formatMessage({id: "LANG85"}) }</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('txtPrivateIdentity', {
                                        rules: [],
                                        initialValue: SIPWebRTCHttpSettings.txtPrivateIdentity || ""
                                    })(
                                        <Input></Input>
                                    )}
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG4233" />}>
                                            <span>{ formatMessage({id: "LANG4232"}) }</span>
                                        </Tooltip>
                                    )}>
                                    <Input name="txtPublicIdentity" className="hidden"></Input>
                                    { getFieldDecorator('txtPublicIdentity', {
                                        rules: [],
                                        initialValue: SIPWebRTCHttpSettings.txtPublicIdentity || ""
                                    })(
                                        <Input></Input>
                                    )}
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1076" />}>
                                            <span>{ formatMessage({id: "LANG73"}) }</span>
                                        </Tooltip>
                                    )}>
                                    <Input type="password" name="txtPassword" className="hidden"></Input>
                                    { getFieldDecorator('txtPassword', {
                                        rules: [],
                                        initialValue: SIPWebRTCHttpSettings.txtPassword || ""
                                    })(
                                        <Input type="password"></Input>
                                    )}
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG4244" />}>
                                            <span>{ formatMessage({id: "LANG4243"}) }</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('txtWebsocketServerUrl', {
                                        rules: [],
                                        initialValue: SIPWebRTCHttpSettings.txtWebsocketServerUrl || ""
                                    })(
                                        <Input></Input>
                                    )}
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                >
                                    <Button type="primary" size="default" ref="btnUnRegister" onClick={ this._sipUnRegister }>
                                        { formatMessage({id: "LANG4451"}) }
                                    </Button>
                                    <Button type="primary" size="default" ref="btnRegister" onClick={ this._sipRegister } disabled={ state.isBtnRegisterDisabled ? true : false}>
                                        { formatMessage({id: "LANG1892"}) }
                                    </Button>
                                </FormItem>
                                {/* /是否注册 */}                                               
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG4228"}) }</span>
                                </div>
                                <div className="section-body">
                                    <FormItem
                                        { ...formItemLayout }
                                        label="">
                                        { getFieldDecorator('txtCallStatus')(
                                            <span></span>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={(
                                            <Tooltip title={<FormattedHTMLMessage id="LANG4237" />}>
                                                <span>{ formatMessage({id: "LANG4236"}) }</span>
                                            </Tooltip>
                                        )}>
                                        { getFieldDecorator('txtPhoneNumber', {
                                            rules: [],
                                            initialValue: ""
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        { ...formItemLayout }
                                    >
                                        <Button type="primary" size="default" ref="btnUnRegister" onClick={ this._sipHangUp }>
                                            { formatMessage({id: "LANG97"}) }
                                        </Button>
                                        <Button type="primary" size="default" ref="btnRegister">
                                            { formatMessage({id: "LANG1892"}) }
                                        </Button>
                                    </FormItem>
                                    {/* 
<!--呼叫控制-->
            <div class="section-title mt10" locale="LANG4228"></div>
            <div class="field-cell">
                <div class="field-label">&nbsp</div>
                <div class="field-content">
                    <div class="btn-group">
                        <button type="button" id="btnHangUp" class="btn btn-primary" locale="LANG97" onclick='sipHangUp()' disabled></button>
                    </div>&nbsp&nbsp
                    <div id="divBtnCallGroup" class="btn-group">
                        <button id="btnCall" disabled class="btn btn-primary" data-toggle="dropdown">Call</button>
                    </div>
                </div>
            </div>
            <!--/呼叫控制-->
            <!--四个按钮-->
            <div class="field-cell">
                <div class="field-label">&nbsp</div>
                <div class="field-content">
                    <div id='divCallOptions' class='call-options' style='display: none margin-top: 0px z-index: 10 position: relative '>
                        <!-- <input type="button" class="btn" style="" id="btnFullScreen" value="FullScreen" disabled onclick='toggleFullScreen()' /> &nbsp -->
                        <input type="button" class="btn" style="" id="btnMute" value="Mute" onclick='sipToggleMute()' /> &nbsp
                        <input type="button" class="btn" style="" id="btnHoldResume" value="Hold" onclick='sipToggleHoldResume()' /> &nbsp
                        <input type="button" class="btn" style="" id="btnTransfer" value="Transfer" onclick='sipTransfer()' /> &nbsp
                        <input type="button" class="btn" style="" id="btnKeyPad" value="KeyPad" onclick='openKeyPad()' />
                    </div>
                </div>
            </div>
            <!--/四个按钮-->
            <div id="divCallCtrl">
                <table style='width: 100%'>
                    <tr>
                        <td id="tdVideo" class='tab-video'>
                            <div id="divVideo" class='div-video'>
                                <div id="divVideoRemote" style='position:relative border:0px solid #009 height:100% width:100% z-index: auto'>
                                    <video class="video" width="100%" height="100%" id="video_remote" autoplay="autoplay" style="opacity: 0 background-color: #000000 -webkit-transition-property: opacity -webkit-transition-duration: 2s">
                                    </video>
                                </div>
                                <div id="divVideoLocalWrapper" style="margin-left: 0px border:0px solid #009 z-index: 1000">
                                    <iframe class="previewvideo" style="border:0px solid #009 z-index: 1000"> </iframe>
                                    <div id="divVideoLocal" class="previewvideo" style=' border:0px solid #009 z-index: 1000'>
                                        <video class="video" width="100%" height="100%" id="video_local" autoplay="autoplay" muted="true" style="opacity: 0 background-color: #000000 -webkit-transition-property: opacity
                                            -webkit-transition-duration: 2s">
                                        </video>
                                    </div>
                                </div>
                                <div id="divScreencastLocalWrapper" style="margin-left: 90px border:0px solid #009 z-index: 1000">
                                    <iframe class="previewvideo" style="border:0px solid #009 z-index: 1000"> </iframe>
                                    <div id="divScreencastLocal" class="previewvideo" style=' border:0px solid #009 z-index: 1000'>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
                                    */}                      
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

module.exports = Form.create()(injectIntl(UserWebrtc))