'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class Media extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _onFocus = (e) => {
        e.preventDefault()

        const form = this.props.form

        form.validateFields([e.target.id], { force: true })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const settings = this.props.settings || {}
        const { getFieldDecorator } = this.props.form
        const extension_type = this.props.extension_type
        const current_mode = (this.props.currentMode === 'add')

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const formItemLayoutRow = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="content">
                <div className="ant-form">
                    <Row
                        className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG626"}) }</span>
                            </div>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1093" /> }>
                                            <span>{ 'NAT' }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('nat', {
                                    rules: [],
                                    initialValue: settings.nat === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1095" /> }>
                                            <span>{ formatMessage({id: "LANG1094"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('directmedia', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.directmedia
                                })(
                                    <Select>
                                        <Option value='yes'>{ formatMessage({id: "LANG136"}) }</Option>
                                        <Option value='no'>{ formatMessage({id: "LANG137"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1098" /> }>
                                            <span>{ formatMessage({id: "LANG1097"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('dtmfmode', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.dtmfmode
                                })(
                                    <Select>
                                        <Option value='rfc2833'>{ 'RFC2833' }</Option>
                                        <Option value='info'>{ formatMessage({id: "LANG1099"}) }</Option>
                                        <Option value='inband'>{ formatMessage({id: "LANG1100"}) }</Option>
                                        <Option value='auto'>{ formatMessage({id: "LANG138"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        {/* <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ 'TIP_USERS_33' }>
                                            <span>{ 'MWI from' }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('mwifrom', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.mwifrom
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col> */}
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2769" /> }>
                                            <span>{ formatMessage({id: "LANG2768"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('tel_uri', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.tel_uri
                                })(
                                    <Select>
                                        <Option value='disabled'>{ formatMessage({id: "LANG2770"}) }</Option>
                                        <Option value='user_phone'>{ formatMessage({id: "LANG2771"}) }</Option>
                                        <Option value='enabled'>{ formatMessage({id: "LANG2772"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row
                        className={ extension_type === 'fxs' ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG628"}) }</span>
                            </div>
                        </Col>
                        {/* <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ 'TIP_USERS_9' }>
                                            <span>{ 'In Directory' }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('inDirectory', {
                                    rules: [],
                                    initialValue: settings.inDirectory === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col> */}
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1110" /> }>
                                            <span>{ formatMessage({id: "LANG1109"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('callwaiting', {
                                    rules: [],
                                    initialValue: settings.callwaiting === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1112" /> }>
                                            <span>{ formatMessage({id: "LANG1111"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('sharpissendkey', {
                                    rules: [],
                                    initialValue: settings.sharpissendkey === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1114" /> }>
                                            <span>{ formatMessage({id: "LANG1113"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('rxgain', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.rxgain
                                })(
                                    <InputNumber />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1116" /> }>
                                            <span>{ formatMessage({id: "LANG1115"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('txgain', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.txgain
                                })(
                                    <InputNumber />
                                ) }
                            </FormItem>
                        </Col>
                        {/* <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG1118"}) }>
                                            <span>{ formatMessage({id: "LANG1117"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('flash', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.flash
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col> */}
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1118" /> }>
                                            <span>{ formatMessage({id: "LANG1117"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('rxflash_min', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.rxflash_min
                                })(
                                    <InputNumber />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1120" /> }>
                                            <span>{ formatMessage({id: "LANG1119"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('rxflash', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.rxflash
                                })(
                                    <InputNumber />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1122" /> }>
                                            <span>{ formatMessage({id: "LANG1121"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('answeronpolarityswitch', {
                                    rules: [],
                                    initialValue: settings.answeronpolarityswitch === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        {/* <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ formatMessage({id: "LANG1124"}) }>
                                            <span>{ formatMessage({id: "LANG1123"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cidsignalling', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cidsignalling
                                })(
                                    <Select>
                                        <Option value='bell'>{ formatMessage({id: "LANG1125"}) }</Option>
                                        <Option value='dtmf'>{ 'DTMF' }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col> */}
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1127" /> }>
                                            <span>{ formatMessage({id: "LANG1126"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('echocancel', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.echocancel
                                })(
                                    <Select>
                                        <Option value='yes'>{ formatMessage({id: "LANG139"}) }</Option>
                                        <Option value='no'>{ formatMessage({id: "LANG140"}) }</Option>
                                        <Option value='32'>{ '32' }</Option>
                                        <Option value='64'>{ '64' }</Option>
                                        <Option value='128'>{ '128' }</Option>
                                        <Option value='256'>{ '256' }</Option>
                                        <Option value='512'>{ '512' }</Option>
                                        <Option value='1024'>{ '1024' }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1129" /> }>
                                            <span>{ formatMessage({id: "LANG1128"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('threewaycalling', {
                                    rules: [],
                                    initialValue: settings.threewaycalling === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2688" /> }>
                                            <span>{ formatMessage({id: "LANG2687"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('sendcalleridafter', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.sendcalleridafter
                                })(
                                    <Select>
                                        <Option value='1'>{ '1' }</Option>
                                        <Option value='2'>{ '2' }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row
                        className={ extension_type === 'iax' ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG627"}) }</span>
                            </div>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1131" /> }>
                                            <span>{ formatMessage({id: "LANG1130"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('maxcallnumbers', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.maxcallnumbers === 'yes'
                                })(
                                    <InputNumber />
                                ) }
                            </FormItem>
                        </Col>
                        {/* <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ 'TIP_USERS_20' }>
                                            <span>{ 'Transport' }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('transport', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.transport
                                })(
                                    <Select>
                                        <Option value='udp'>{ 'UDP Only' }</Option>
                                        <Option value='tcp'>{ 'TCP Only' }</Option>
                                        <Option value='tls'>{ 'TLS Only' }</Option>
                                        <Option value='udp,tcp,tls'>{ 'All - UDP Primary' }</Option>
                                        <Option value='tcp,udp,tls'>{ 'All - TCP Primary' }</Option>
                                        <Option value='tls,udp,tcp'>{ 'All - TLS Primary' }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col> */}
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1133" /> }>
                                            <span>{ formatMessage({id: "LANG1132"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('requirecalltoken', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.requirecalltoken
                                })(
                                    <Select>
                                        <Option value='yes'>{ formatMessage({id: "LANG136"}) }</Option>
                                        <Option value='no'>{ formatMessage({id: "LANG137"}) }</Option>
                                        <Option value='auto'>{ formatMessage({id: "LANG138"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(Media)