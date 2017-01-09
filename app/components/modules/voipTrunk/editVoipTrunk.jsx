'use strict'

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
            telUri: "disabled",
            enableCc: false
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
        } else {
            action["action"] = "getIAXTrunk"
            this._getTrunk(action)
        }
        // this._getNameList()
    }
    _getTrunk = (action) => {
        $.ajax({
            type: "post",
            url: api.apiHost,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
                // top.dialog.dialogMessage({
                //     type: 'error',
                //     content: errorThrown
                // });
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
    componentWillUnmount() {

    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'updateJBSettings'

                action.gs_jbenable = (action.service_check_enable ? 'yes' : 'no')

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(formatMessage({ id: "LANG815" }))
                        }
                    }.bind(this)
                })
            }
        })
    }
    _onChangeTelUri = (val) => {
        this.setState({
            telUri: val
        })  
    }
    _onChangeEnableCc = (val) => {
        this.setState({
            enableCc: val
        })  
    }
    _checkLdapPrefix = (rule, value, callback) => {
        // var default_ob = $('#ldap_outrt_prefix').val();

        // if (default_ob && default_ob == 'custom' && value == "") {
        //     return "prefix is required.";
        // }

        // return true;
    }
    _checkOpenPort(rule, value, callback) {
        // var ele;

        // if (val === loadValue) {
        //     return true;
        // }

        // for (var i = 0; i < openPort.length; i++) {
        //     ele = openPort[i];

        //     if (val == ele) {
        //         return "LANG3869";
        //     }
        // }

        // return true;
    }
    _transData = (res, cb) => {
        let arr = []

        for (var i = 0; i < res.length; i++) {
            arr.push(res[i]["trunk_name"])
        }

        if (cb && typeof cb === "function") {
            cb(arr)
        }

        return arr
    }
    _getNameList = () => {
        const { formatMessage } = this.props.intl
        let trunkList = UCMGUI.isExist.getList("getTrunkList", formatMessage)
        this.setState({
            trunkNameList: this._transData(trunkList)
        })
    }
    _trunkNameIsExist = (rule, value, callback, errMsg) => {
        if (_.find(this.state.trunkNameList, function (num) { 
            return num === value
        })) {
            callback(errMsg)
        }
        callback()
    }
    _isRightIP = (rule, value, callback, errMsg) => {
        let ipArr = value.split("."),
            ipDNSReg = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/
        
        if (ipDNSReg.test(value) && (ipArr[0] === "127" || ipArr[0] >= 224 || ipArr[3] === 0)) {
            callback(errMsg)
        } else {
            callback()
        }
    }
    _isSelfIP = (rule, value, callback, errMsg) => {
        let selfIp = window.location.hostname,
            inputIp = value.split(':')[0]
        
        if (inputIp === selfIp) {
            callback(errMsg)
        } else {
            callback()
        }
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
                <Title headerTitle={ headerTitle } onSubmit={ this._handleSubmit.bind(this) } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <Tabs defaultActiveKey="1" onChange={this._onChange}>
                        <TabPane tab={formatMessage({id: "LANG2217"})} key="1">
                            <BasicSettings form={ this.props.form }
                                trunk={ this.state.trunk }
                            />
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG542"})} key="2">
                            <AdvanceSettings form={ this.props.form }
                                trunk={ this.state.trunk }
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