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
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, Upload, Icon, DatePicker, TimePicker, Button, Modal, Row } from 'antd'

const baseServerURl = api.apiHost
const FormItem = Form.Item
const confirm = Modal.confirm

class Network8021x extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lan1_mode_calss: {
                identity: 'hidden',
                cert: 'hidden'
            },
            lan2_mode_calss: {
                identity: 'hidden',
                cert: 'hidden'
            },
            network_pro_settings: {}
        }
    }
    componentWillMount() {
        this._initNetwork()
        this._getInitData()
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }

    _initNetwork = () => {
        const { formatMessage } = this.props.intl
        let method = ""
        let method_calss = {}
        let response = {}

        $.ajax({
            url: "../cgi",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                action: "getNetworkproSettings"
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    response = data.response
                    this._EAPChange()
                    this._EAPChange2()
                }
            }.bind(this)
        })

        let value = ""
        value = response.mode
        let mode1 = {}
        let mode2 = {}

        if (value === "0") {
            mode1 = {
                identity: 'hidden',
                cert: 'hidden'
            }
        } else if (value === "1") {
            mode1 = {
                identity: 'display-block',
                cert: 'hidden'
            }
        } else {
            mode1 = {
                identity: 'display-block',
                cert: 'display-block'
            }
        }
        value = response['lan2.802.1x.mode']

        if (value === "0") {
            mode2 = {
                identity: 'hidden',
                cert: 'hidden'
            }
        } else if (value === "1") {
            mode2 = {
                identity: 'display-block',
                cert: 'hidden'
            }
        } else {
            mode2 = {
                identity: 'display-block',
                cert: 'display-block'
            }
        }

        this.setState({
            network_pro_settings: response,
            lan1_mode_class: mode1,
            lan2_mode_class: mode2
        })
    }

    _onChangeMode = (key, value) => {
        let mode = {}

        if (value === "0") {
            mode = {
                identity: 'hidden',
                cert: 'hidden'
            }
        } else if (value === "1") {
            mode = {
                identity: 'display-block',
                cert: 'hidden'
            }
        } else {
            mode = {
                identity: 'display-block',
                cert: 'display-block'
            }
        }
        if (key === "mode") {
            this.setState({
                lan1_mode_class: mode
            })
        } else {
            this.setState({
                lan2_mode_class: mode
            })
        }
    }

    _getInitData = () => {

    }
    _EAPChange = () => {

    }
    _EAPChange2 = () => {

    }

    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const network_pro_settings = this.state.network_pro_settings
        const dhcp_settings = this.state.dhcp_settings
        const class8021x = this.props.class8021x
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <Row className={ class8021x.lan1title }>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG266"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <Row className={ class8021x.wantitle }>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG264"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div className={ class8021x.lan1 }>
                        <FormItem
                            { ...formItemLayout }
                            label={                            
                                <Tooltip title={<FormattedHTMLMessage id="LANG1934" />}>
                                    <span>{formatMessage({id: "LANG1933"})}</span>
                                </Tooltip>
                            }>
                            { getFieldDecorator('mode', {
                                rules: [],
                                initialValue: network_pro_settings.mode
                            })(
                                <Select onChange={ this._onChangeMode.bind(this, "mode") }>
                                     <Option value="0">{formatMessage({id: "LANG273"})}</Option>
                                     <Option value="1">{formatMessage({id: "LANG1969"})}</Option>
                                     <Option value="2">{formatMessage({id: "LANG1970"})}</Option>
                                     <Option value="3">{formatMessage({id: "LANG1971"})}</Option>
                                 </Select>
                            ) }
                        </FormItem>
                        <div className={ this.state.lan1_mode_class.identity }>
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1928" />}>
                                        <span>{formatMessage({id: "LANG1927"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('identity', {
                                    rules: [
                                        { required: true, message: formatMessage({id: "LANG2150"}) }
                                    ],
                                    initialValue: network_pro_settings.identity
                                })(
                                    <Input maxLength="15" />
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1930" />}>
                                        <span>{formatMessage({id: "LANG1929"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('md5_secret', {
                                    rules: [
                                        { required: true, message: formatMessage({id: "LANG2150"}) }
                                    ],
                                    initialValue: network_pro_settings.md5_secret
                                })(
                                    <Input maxLength="15" />
                                ) }
                            </FormItem>
                        </div>
                        <div className={ this.state.lan1_mode_class.cert} >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG1932"}) }>
                                            <span>{ formatMessage({id: "LANG1931"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('ca_cert_file', {
                                    valuePropName: 'fileList',
                                    normalize: this._normFile
                                })(
                                    <Upload name="logo" action="/upload.do" listType="picture" onChange={ this.handleUpload }>
                                        <Button type="ghost">
                                            <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                        </Button>
                                    </Upload>
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG1926"}) }>
                                            <span>{ formatMessage({id: "LANG1925"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('client_cert_file', {
                                    valuePropName: 'fileList',
                                    normalize: this._normFile
                                })(
                                    <Upload name="logo" action="/upload.do" listType="picture" onChange={ this.handleUpload }>
                                        <Button type="ghost">
                                            <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                        </Button>
                                    </Upload>
                                ) }
                            </FormItem>
                        </div>
                    </div>
                    <Row className={ class8021x.lan2title }>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG267"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <Row className={ class8021x.lantitle }>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG265"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div className={ class8021x.lan2 }>
                        <FormItem
                            { ...formItemLayout }
                            label={                            
                                <Tooltip title={<FormattedHTMLMessage id="LANG1934" />}>
                                    <span>{formatMessage({id: "LANG1933"})}</span>
                                </Tooltip>
                            }>
                            { getFieldDecorator('lan2.802.1x.mode', {
                                rules: [],
                                initialValue: network_pro_settings['lan2.802.1x.mode']
                            })(
                                <Select onChange={ this._onChangeMode.bind(this, "lan2.802.1x.mode") }>
                                     <Option value="0">{formatMessage({id: "LANG273"})}</Option>
                                     <Option value="1">{formatMessage({id: "LANG1969"})}</Option>
                                     <Option value="2">{formatMessage({id: "LANG1970"})}</Option>
                                     <Option value="3">{formatMessage({id: "LANG1971"})}</Option>
                                 </Select>
                            ) }
                        </FormItem>
                        <div className={ this.state.lan2_mode_class.identity }>
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1928" />}>
                                        <span>{formatMessage({id: "LANG1927"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('lan2.802.1x.identity', {
                                    rules: [
                                        { required: true, message: formatMessage({id: "LANG2150"}) }
                                    ],
                                    initialValue: network_pro_settings['lan2.802.1x.identity']
                                })(
                                    <Input maxLength="15" />
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1928" />}>
                                        <span>{formatMessage({id: "LANG1927"})}</span>
                                    </Tooltip>
                                }
                                className='hidden'
                            >
                                { getFieldDecorator('lan2.802.1x.username', {
                                    rules: [],
                                    initialValue: network_pro_settings['lan2.802.1x.username']
                                })(
                                    <Input maxLength="15" />
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1930" />}>
                                        <span>{formatMessage({id: "LANG1929"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('lan2.802.1x.password', {
                                    rules: [
                                        { required: true, message: formatMessage({id: "LANG2150"}) }
                                    ],
                                    initialValue: network_pro_settings['lan2.802.1x.password']
                                })(
                                    <Input maxLength="15" />
                                ) }
                            </FormItem>
                        </div>
                        <div className={ this.state.lan2_mode_class.cert} >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG1932"}) }>
                                            <span>{ formatMessage({id: "LANG1931"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('ca_cert_file2', {
                                    valuePropName: 'fileList',
                                    normalize: this._normFile
                                })(
                                    <Upload name="logo" action="/upload.do" listType="picture" onChange={ this.handleUpload }>
                                        <Button type="ghost">
                                            <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                        </Button>
                                    </Upload>
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG1926"}) }>
                                            <span>{ formatMessage({id: "LANG1925"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('client_cert_file2', {
                                    valuePropName: 'fileList',
                                    normalize: this._normFile
                                })(
                                    <Upload name="logo" action="/upload.do" listType="picture" onChange={ this.handleUpload }>
                                        <Button type="ghost">
                                            <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                        </Button>
                                    </Upload>
                                ) }
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}

Network8021x.propTypes = {
}

export default injectIntl(Network8021x)
