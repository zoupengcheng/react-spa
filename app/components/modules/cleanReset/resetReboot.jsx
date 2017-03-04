'use strict'

import $ from 'jquery'
import _ from 'underscore'
import moment from "moment"
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, DatePicker, TimePicker, Button, Modal, Row } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
const baseServerURl = api.apiHost

class ResetReboot extends Component {
    constructor(props) {
        super(props)

        this.state = {
            mtype: 'data',
            dateShow: "display-block",
            DataBox: {
                "record": false,
                "vfax": false,
                "voicemail_file": false,
                "hom_file": false,
                "prompt_tone": false,
                "cdr_log": false,
                "zeroconfig": false,
                "operation_log": false,
                "backup_file": false,
                "corefile": false,
                "troubleshooting": false,
                "qmail": false,
                "select_all": false
            }
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    _handleFormChange = (changedFields) => {
        _.extend(this.props.dataSource, changedFields)
    }
    _onMtypeChange = (value) => {
        this.setState({
            mtype: value
        })
    }
    _onAllChange = (e) => {
        let DataBox = this.state.DataBox

        if (e.target.checked) {
            DataBox.record = true
            DataBox.vfax = true
            DataBox.voicemail_file = true
            DataBox.hom_file = true
            DataBox.prompt_tone = true
            DataBox.cdr_log = true
            DataBox.zeroconfig = true
            DataBox.operation_log = true
            DataBox.backup_file = true
            DataBox.corefile = true
            DataBox.troubleshooting = true
            DataBox.qmail = true
        } else {
            DataBox.record = false
            DataBox.vfax = false
            DataBox.voicemail_file = false
            DataBox.hom_file = false
            DataBox.prompt_tone = false
            DataBox.cdr_log = false
            DataBox.zeroconfig = false
            DataBox.operation_log = false
            DataBox.backup_file = false
            DataBox.corefile = false
            DataBox.troubleshooting = false
            DataBox.qmail = false
        }

        this.setState({
            DataBox: DataBox
        })
    }
    _doReset = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

         let mtype = form.getFieldValue("mtype") 

            if (mtype === 'all') {
                UCMGUI.loginFunction.confirmReset(baseServerURl + 'action=factoryReset&type=' + mtype, formatMessage)
            } else {
                message.loading(formatMessage({ id: "LANG4830"}))

                let all = form.getFieldsValue() 

                let data = {
                    action: "updateModuleResetData"
                }

                _.each(all, function(num, key) {
                    if (key !== 'mtype' && key !== 'select_all') {
                        data[key] = num ? "yes" : "no"
                    }
                })

                // data["mod_reset_enable"] = $("#mod_reset_enable")[0].checked ? 1 : 0;
                data["mod_reset_enable"] = 1

                $.ajax({
                    url: baseServerURl,
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: data,
                    error: function(jqXHR, textStatus, errorThrown) {
                        message.error(errorThrown)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, formatMessage)

                        if (bool) {
                            $.ajax({
                                type: 'GET',
                                url: baseServerURl + 'action=ResetModuleData&module-reset=',
                                success: function(data) {
                                    const bool = UCMGUI.errorHandler(data, null, formatMessage)

                                    if (bool) {
                                        message.success(formatMessage({ id: "LANG4831"}))
                                    }
                                }
                            })
                        }
                    }
                })
            }
    }
    _reset = () => {
        const { formatMessage } = this.props.intl

        const typeName = {
            data: formatMessage({id: "LANG1488"}),
            all: formatMessage({id: "LANG104"}) 
        }

        const typeLabel = typeName[this.state.mtype]
        const content = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG837" }, {0: typeLabel})}}></span>

        Modal.confirm({
                title: 'Confirm',
                content: content,
                okText: formatMessage({id: "LANG727"}),
                cancelText: formatMessage({id: "LANG726"}),
                onOk: this._doReset.bind(this)
            })
    }
    _doReboot = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        UCMGUI.loginFunction.confirmReboot()
    }
    _reboot = () => {
        const { formatMessage } = this.props.intl

        Modal.confirm({
                title: 'Confirm',
                content: formatMessage({id: "LANG835"}),
                okText: formatMessage({id: "LANG727"}),
                cancelText: formatMessage({id: "LANG726"}),
                onOk: this._doReboot.bind(this)
            })
    }
    _resetCert = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            type: "GET",
            url: "../cgi?action=cerifyCertificateFile",
            error: function(jqXHR, textStatus, errorThrown) {
                message.error(errorThrown)
            },
            success: function(data) {
                var bool = data.status

                if (bool === 0) {
                    message.success(formatMessage({ id: "LANG4200"}))
                } else {
                    message.error(formatMessage({id: "LANG4202"}, { 0: formatMessage({id: 'LANG4200'}) }))
                }
            }
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG650"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2253" />}>
                                <span>{formatMessage({id: "LANG84"})}</span>
                            </Tooltip>
                        }
                    >
                        { getFieldDecorator('mtype', {
                            rules: [],
                            initialValue: this.state.mtype
                        })(
                            <Select onChange={this._onMtypeChange}>
                                 <Option value="data">{formatMessage({id: "LANG1488"})}</Option>
                                 <Option value="all">{formatMessage({id: "LANG104"})}</Option>
                             </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        className={ this.state.mtype === "all" ? "hidden" : "display-block" }
                        { ...formItemLayout }

                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG5293" />}>
                                <span>{formatMessage({id: "LANG4805"})}</span>
                            </Tooltip>
                        )}
                    >
                        <Col span={ 2 }>
                            { getFieldDecorator('record', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.record
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG2640"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('vfax', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.vfax
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG4773"}, { 0: formatMessage({id: 'LANG95'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('voicemail_file', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.voicemail_file
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG20"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('hom_file', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.hom_file
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG27"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('prompt_tone', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.prompt_tone
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG4752"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('cdr_log', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.cdr_log
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG4053"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('zeroconfig', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.zeroconfig
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG4773"}, { 0: formatMessage({id: 'LANG16'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('operation_log', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.operation_log
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG3908"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('backup_file', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.backup_file
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG4773"}, { 0: formatMessage({id: 'LANG62'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('corefile', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.corefile
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG4807"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('troubleshooting', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.troubleshooting
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 14 }>{formatMessage({id: "LANG4773"}, { 0: formatMessage({id: 'LANG68'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('qmail', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.qmail
                            })(
                                    <Checkbox />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG4773"}, { 0: formatMessage({id: 'LANG2032'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('select_all', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.DataBox.select_all
                            })(
                                    <Checkbox onChange={ this._onAllChange } />
                            ) }
                        </Col>
                        <Col span={ 6 }>{formatMessage({id: "LANG104"})}</Col>
                    </FormItem>
                    <div>
                        <Button type="primary" onClick={ this._reset }>{formatMessage({id: "LANG750"})}</Button>
                    </div>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG737"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div>
                        <Button type="primary" onClick={ this._reboot }>{formatMessage({id: "LANG737"})}</Button>
                    </div>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG4200"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div>
                        <Button type="primary" onClick={ this._resetCert }>{formatMessage({id: "LANG4200"})}</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

ResetReboot.propTypes = {
}

export default Form.create()(injectIntl(ResetReboot))