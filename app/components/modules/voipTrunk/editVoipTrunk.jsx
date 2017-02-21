'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Transfer, Tabs } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import BasicSettings from "./basicSettings"
import AdvanceSettings from "./advanceSettings"
import _ from 'underscore'
import Title from '../../../views/title'
const TabPane = Tabs.TabPane
import Validator from "../../api/validator"

class EditVoipTrunk extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openPort: [],
            telUri: "disabled",
            enableCc: false,
            refs: {}
        }
    }
    componentDidMount() {
        let trunkId = this.props.params.trunkId,
            technology = this.props.params.technology,
            trunkType = this.props.params.trunkType,
            action = {
                trunk: trunkId
            }

        if (technology.toLowerCase() === "sip") {
            action["action"] = "getSIPTrunk"

            this._getTrunk(action)
            // this._tectFax()
        } else {
            action["action"] = "getIAXTrunk"
            this._getTrunk(action)
        }
        // this._getNameList()
        this._getOpenPort()
    }
    componentWillUnmount() {
    }
    // _tectFax = () => {
    //     let accountList = UCMGUI.isExist.getList("listAccount").account,
    //         faxList = UCMGUI.isExist.getList("listFax").fax,
    //         str = '',
    //         ele;

    //     for (let i = 0; i < accountList.length; i++) {
    //         ele = accountList[i];

    //         if (ele.account_type.match(/FXS/i)) {
    //             str += '<option value="' + ele.extension + '">' + ele.extension + '</option>';
    //         }
    //     }

    //     for (let i = 0; i < faxList.length; i++) {
    //         ele = faxList[i];

    //         str += '<option value="' + ele.extension + '">' + ele.extension + '</option>';

    //     }

    //     $('#fax_intelligent_route_destination').append(str);
    //     $('#faxmode').on('change', function() {
    //         if ($(this).val() === 'detect') {
    //             $('#detect_div').show();
    //         } else {
    //             $('#detect_div').hide();
    //         }
    //     });
    //     enableCheckBox({
    //         enableCheckBox: 'fax_intelligent_route',
    //         enableList: ['fax_intelligent_route_destination']
    //     }, doc);
    //     enableCheckBox({
    //         enableCheckBox: 'need_register',
    //         enableList: ['allow_outgoing_calls_if_reg_failed']
    //     }, doc);
    // }
    _getOpenPort = () => {
        let openPort = []

        $.ajax({
            url: api.apiHost,
            method: "post",
            data: {
                action: "getNetstatInfo"
            },
            async: true,
            dataType: "json",
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let netstat = data.response.netstat,
                        currentPort = ''

                    for (let i = 0, length = netstat.length; i < length; i++) {
                        currentPort = netstat[i]['port']

                        if (openPort.length !== 0 && _.find(openPort, function (num) { 
                                return num !== currentPort
                            })) {
                            openPort.push(currentPort)
                        } else {
                            openPort.push(currentPort)
                        }
                    }
                    this.setState({
                        openPort: this.state.openPort.concat(openPort)
                    })
                }
            }.bind(this)
        })

        $.ajax({
            url: api.apiHost,
            method: "post",
            data: {
                action: "getSIPTCPSettings"
            },
            // async: false,
            dataType: "json",
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data)

                if (bool) {
                    let tlsbindaddr = data.response.sip_tcp_settings.tlsbindaddr,
                        tcpbindaddr = data.response.sip_tcp_settings.tcpbindaddr

                    if (tlsbindaddr) {
                        let tlsPort = tlsbindaddr.split(":")[1]

                        if (openPort.length !== 0 && tlsPort && _.find(openPort, function (num) { 
                                return num !== tlsPort
                            })) {
                            openPort.push(tlsPort)
                        } else {
                            openPort.push(tlsPort)
                        }
                    }

                    if (tcpbindaddr) {
                        let tcpPort = tcpbindaddr.split(":")[1]

                        if (openPort.length !== 0 && tcpPort && _.find(openPort, function (num) { 
                                return num !== tcpPort
                            })) {
                            openPort.push(tcpPort)
                        } else {
                            openPort.push(tcpPort)
                        }
                    }
                    this.setState({
                        openPort: this.state.openPort.concat(openPort)
                    })
                }
            }.bind(this)
        })
    }
    _getTrunk = (action) => {
        $.ajax({
            type: "post",
            url: api.apiHost,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        trunk = res.trunk
                    this.setState({
                        trunk: trunk
                    })
                }
            }.bind(this)
        })
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        let trunkId = this.props.params.trunkId,
            technology = this.props.params.technology,
            trunkType = this.props.params.trunkType,
            action = {}

        if (technology.toLowerCase() === "sip") {
            action["action"] = "updateSIPTrunk"
        } else {
            action["action"] = "updateIAXTrunk"
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            let me = this
            let refs = me.state.refs

            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    let divKey = refs["div_" + key]
                    if (divKey && 
                       divKey.props &&
                        ((divKey.props.className &&
                        divKey.props.className.indexOf("hidden") === -1) ||
                        typeof divKey.props.className === "undefined")) {
                        if (!err || (err && typeof err[key] === "undefined")) {
                            action[key] = UCMGUI.transCheckboxVal(values[key])   
                        } else {
                            return
                        }
                    }
                }
            }
            action = me._transAction(action)
            // if ((action["action"].toLowerCase().indexOf('sip') > -1) && /[a-zA-Z]/g.test(action['host']) && !UCMGUI.isIPv6(action['host'])) {
            //     confirmStr = $P.lang("LANG4163")
            // } else if ((action["action"].toLowerCase().indexOf('iax') > -1) &&
            //     (/[a-zA-Z]/g.test(action['host']) || /:\d*$/.test(action['host'])) && !UCMGUI.isIPv6(action['host'])) {
            //     confirmStr = $P.lang("LANG4469")
            // }
            // if (confirmStr) {
            //     top.dialog.dialogConfirm({
            //         confirmStr: confirmStr,
            //         buttons: {
            //             ok: function() {
            //                 this._doUpdateTrunksInfo(action)
            //             },
            //             cancel: function() {
            //                 top.dialog.container.show();
            //                 top.dialog.shadeDiv.show();
            //             }
            //         }
            //     })
            // } else {
            //     this._doUpdateTrunksInfo(action)
            // }
            this._doUpdateTrunksInfo(action)
        })
    }
    _doUpdateTrunksInfo = (action) => {
        const { formatMessage } = this.props.intl
        message.loading(formatMessage({ id: "LANG826" }), 0)

        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                    browserHistory.push('/extension-trunk/voipTrunk')
                }
            }.bind(this)
        })
    }
    _transAction = (action) => {
        const form = this.props.form

        let trunkId = this.props.params.trunkId,
            technology = this.props.params.technology,
            trunkType = this.props.params.trunkType

        let fax = form.getFieldValue("faxmode")

        if (fax === "no") {
            action['faxdetect'] = "no"
            action['fax_gateway'] = "no"
        } else if (fax === "detect") {
            action['faxdetect'] = "yes"
            action['fax_gateway'] = "no"
        }
        delete action['faxmode']

        if (technology.toLowerCase() === "sip") {
            if (form.getFieldValue('enable_cc')) {
                action['cc_agent_policy'] = "native"
                action['cc_monitor_policy'] = "native"
                action['cc_max_agents'] = form.getFieldValue('cc_max_agents')
                action['cc_max_monitors'] = form.getFieldValue('cc_max_monitors')
                action['cc_offer_timer'] = "120"
                action['ccnr_available_timer'] = "3600"
                action['ccbs_available_timer'] = "3600"
            } else {
                action['cc_agent_policy'] = "never"
                action['cc_monitor_policy'] = "never"
            }

            if (form.getFieldValue("send_ppi")) {
                action['send_ppi'] = "yes"
                action['pai_number'] = ""
            } else if (form.getFieldValue("send_pai")) {
                action['send_ppi'] = "pai"
                action['use_dod_in_ppi'] = "no"
            } else {
                action['send_ppi'] = "no"
                action['pai_number'] = ""
                action['use_dod_in_ppi'] = "no"
            }
        }
        delete action['enable_cc']
        delete action['send_pai']
        delete action['send_ppi']

        if (technology.toLowerCase() === "sip") {
            if (fax === "detect") {
                let bEnableRoute = form.getFieldValue('fax_intelligent_route')
                action['fax_intelligent_route'] = bEnableRoute ? 'yes' : 'no'

                if (bEnableRoute) {
                    action['fax_intelligent_route_destination'] = form.getFieldValue('fax_intelligent_route_destination')
                }
            } else {
                delete action['fax_intelligent_route']
                delete action['fax_intelligent_route_destination']
            }
            if (trunkType.toLowerCase() === "peer" && form.getFieldValue("ldap_sync_enable")) {
                let outrtVal = form.getFieldValue("ldap_default_outrt"),
                    prefixVal = form.getFieldValue("ldap_outrt_prefix")

                if (outrtVal !== "custom") {
                    action["ldap_default_outrt"] = outrtVal
                    action["ldap_default_outrt_prefix"] = prefixVal
                    action["ldap_custom_prefix"] = ""
                } else {
                    action["ldap_default_outrt"] = ""
                    action["ldap_default_outrt_prefix"] = ""
                    action["ldap_custom_prefix"] = prefixVal
                }
            } else if (trunkType.toLowerCase() === "register") {
                if (!form.getFieldValue("chkOutboundproxy")) {
                    action["outboundproxy"] = ""
                    action["rmv_obp_from_route"] = "no"
                }
                if (form.getFieldValue("tel_uri") !== "disabled") {
                    action["rmv_obp_from_route"] = "no"
                }
            }
        }
        delete action['ldap_default_outrt']
        delete action['ldap_outrt_prefix']
        delete action['chkOutboundproxy']
        // let rightArr = []

        // $.each($("#rightSelect").children(), function(index, item) {
        //     rightArr.push($(item).val())
        // })

        // action["allow"] = rightArr.toString()
        action["trunk"] = trunkId
        delete action["trunk_index"]

        if (action["user_name"]) {
            action["username"] = action["user_name"]
            delete action["user_name"]
        }

        if (action["password"]) {
            action["secret"] = action["password"]
            delete action["password"]
        }
        return action
    }
    _handleCancel = (e) => {
        browserHistory.push('/extension-trunk/voipTrunk')
    }
    _getRefs = (refs) => {
        this.setState({
            refs: _.extend(this.state.refs, refs)
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        let trunkId = this.props.params.trunkId,
            technology = this.props.params.technology,
            trunkType = this.props.params.trunkType,
            trunkName = this.props.params.trunkName
        
        let headerTitle = formatMessage({
            id: "LANG222"
        }, {
            0: technology === "SIP" ? formatMessage({id: "LANG5017"}) : formatMessage({id: "LANG5018"}),
            1: trunkName
        })
        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ headerTitle } 
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel } 
                    isDisplay='display-block' 
                />
                <Form>
                    <Tabs defaultActiveKey="1" onChange={this._onChange}>
                        <TabPane tab={formatMessage({id: "LANG2217"})} key="1">
                            <BasicSettings form={ this.props.form }
                                getRefs={ this._getRefs.bind(this) }
                                trunk={ this.state.trunk }
                                trunkType = {trunkType}
                                technology = {technology}
                                telUri={ this.state.telUri }
                            />
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG542"})} key="2">
                            <AdvanceSettings form={ this.props.form }
                                getRefs={ this._getRefs.bind(this) }
                                trunk={ this.state.trunk }
                                trunkType = {trunkType}
                                technology = {technology}
                                openPort = { this.state.openPort }
                                telUri={ this.state.telUri }
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

EditVoipTrunk.propTypes = {
}

export default Form.create()(injectIntl(EditVoipTrunk))