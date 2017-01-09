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
import { Checkbox, Col, Form, Icon, Input, InputNumber, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class Media extends Component {
    constructor(props) {
        super(props)

        const alertinfo = this.props.settings.alertinfo
        const strategy_ipacl = this.props.settings.strategy_ipacl

        this.state = {
            alertinfo: alertinfo ? alertinfo : '',
            strategy_ipacl: strategy_ipacl ? strategy_ipacl : '0',
            targetKeys: ['ulaw', 'alaw', 'gsm', 'g726', 'g722', 'g729', 'h264', 'ilbc'],
            availableCodecs: [
                {
                    key: 'g726aal2', title: 'AAL2-G.726-32'
                }, {
                    key: 'adpcm', title: 'ADPCM'
                }, {
                    key: 'g723', title: 'G.723'
                }, {
                    key: 'h263', title: 'H.263'
                }, {
                    key: 'h263p', title: 'H.263p'
                }, {
                    key: 'vp8', title: 'VP8'
                }, {
                    key: 'opus', title: 'OPUS'
                }, {
                    key: 'ulaw', title: 'PCMU'
                }, {
                    key: 'alaw', title: 'PCMA'
                }, {
                    key: 'gsm', title: 'GSM'
                }, {
                    key: 'g726', title: 'G.726'
                }, {
                    key: 'g722', title: 'G.722'
                }, {
                    key: 'g729', title: 'G.729'
                }, {
                    key: 'h264', title: 'H.264'
                }, {
                    key: 'ilbc', title: 'iLBC'
                }
            ]
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _addLocalNetwork = () => {
        const { form } = this.props
        // can use data-binding to get
        const localNetworks = form.getFieldValue('localNetworks')
        const newLocalNetworks = localNetworks.concat(localNetworks.length + 2)

        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            localNetworks: newLocalNetworks
        })
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _handleTransferChange = (targetKeys, direction, moveKeys) => {
        if (!targetKeys.length) {
            this.setState({
                targetKeys: targetKeys
            })
        } else {
            this.setState({
                targetKeys: targetKeys
            })
        }

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        // this.setState({ targetContactKeys: nextTargetKeys })
        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
    _onChangeAlertInfo = (value) => {
        this.setState({
            alertinfo: value
        })
    }
    _onChangeStrategy = (value) => {
        this.setState({
            strategy_ipacl: value
        })
    }
    _onFocus = (e) => {
        e.preventDefault()

        const form = this.props.form

        form.validateFields([e.target.id], { force: true })
    }
    _renderItem = (item) => {
        if (item.key === 'opus' && this.props.extensionType === 'iax') {
            return false
        } else {
            return {
                label: item.key,  // for displayed item
                value: item.title   // for title and filter matching
            }
        }
    }
    _removeLocalNetwork = (k) => {
        const { form } = this.props
        // can use data-binding to get
        const localNetworks = form.getFieldValue('localNetworks')

        // can use data-binding to set
        form.setFieldsValue({
            localNetworks: localNetworks.filter(key => key !== k)
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const settings = this.props.settings || {}
        const extension_type = this.props.extensionType
        const current_mode = (this.props.currentMode === 'add')
        const { getFieldDecorator, getFieldValue } = this.props.form

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const formItemLayoutRow = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }

        const formItemLayoutTransfer = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        getFieldDecorator('localNetworks', { initialValue: [] })

        const localNetworks = getFieldValue('localNetworks')
        const localNetworkFormItems = localNetworks.map((k, index) => {
            return (
                <Col
                    span={ 12 }
                    key={ k }
                    className={ extension_type === 'fxs'
                                    ? 'hidden'
                                    : this.state.strategy_ipacl === '1'
                                        ? 'display-block'
                                        : 'hidden'
                                }
                >
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1145" /> }>
                                    <span>{ formatMessage({id: "LANG1146"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator(`local_network${k}`, {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }
                            ],
                            initialValue: settings[`local_network${k}`]
                        })(
                            <Input />
                        ) }
                        <Icon
                            type="minus-circle-o"
                            onClick={ () => this._removeLocalNetwork(k) }
                            className="dynamic-network-button"
                        />
                    </FormItem>
                </Col>
            )
        })

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
                    <Row>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3249" /> }>
                                            <span>{ formatMessage({id: "LANG3248"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('alertinfo', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.alertinfo
                                })(
                                    <Select onChange={ this._onChangeAlertInfo }>
                                        <Option value=''>{ formatMessage({id: "LANG133"}) }</Option>
                                        <Option value='ring1'>{ 'Ring 1' }</Option>
                                        <Option value='ring2'>{ 'Ring 2' }</Option>
                                        <Option value='ring3'>{ 'Ring 3' }</Option>
                                        <Option value='ring4'>{ 'Ring 4' }</Option>
                                        <Option value='ring5'>{ 'Ring 5' }</Option>
                                        <Option value='ring6'>{ 'Ring 6' }</Option>
                                        <Option value='ring7'>{ 'Ring 7' }</Option>
                                        <Option value='ring8'>{ 'Ring 8' }</Option>
                                        <Option value='ring9'>{ 'Ring 9' }</Option>
                                        <Option value='ring10'>{ 'Ring 10' }</Option>
                                        <Option value="Bellcore-dr1">{ 'Bellcore-dr1' }</Option>
                                        <Option value="Bellcore-dr2">{ 'Bellcore-dr2' }</Option>
                                        <Option value="Bellcore-dr3">{ 'Bellcore-dr3' }</Option>
                                        <Option value="Bellcore-dr4">{ 'Bellcore-dr4' }</Option>
                                        <Option value="Bellcore-dr5">{ 'Bellcore-dr5' }</Option>
                                        <Option value="custom">{ formatMessage({id: "LANG231"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' && this.state.alertinfo === 'custom'
                                            ? 'display-block'
                                            : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3250" /> }>
                                            <span>{ formatMessage({id: "LANG3250"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('custom_alert_info', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.custom_alert_info
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4199" /> }>
                                            <span>{ formatMessage({id: "LANG3871"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('faxmode', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.faxmode
                                })(
                                    <Select>
                                        <Option value='no'>{ formatMessage({id: "LANG133"}) }</Option>
                                        <Option value='detect'>{ formatMessage({id: "LANG1135"}) }</Option>
                                        <Option value="gateway">{ formatMessage({id: "LANG3554"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4224" /> }>
                                            <span>{ formatMessage({id: "LANG4225"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('t38_udptl', {
                                    rules: [],
                                    initialValue: settings.t38_udptl
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'fxs' ? 'hidden' : 'display-block' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1134" /> }>
                                            <span>{ 'SRTP' }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('encryption', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.encryption
                                })(
                                    <Select>
                                        <Option value='no'>{ formatMessage({id: "LANG4377"}) }</Option>
                                        <Option value="yes">{ formatMessage({id: "LANG4375"}) }</Option>
                                        <Option value='support'>{ formatMessage({id: "LANG4376"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'fxs' ? 'hidden' : 'display-block' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1138" /> }>
                                            <span>{ formatMessage({id: "LANG1137"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('strategy_ipacl', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.strategy_ipacl
                                })(
                                    <Select onChange={ this._onChangeStrategy }>
                                        <Option value='0'>{ formatMessage({id: "LANG1139"}) }</Option>
                                        <Option value="1">{ formatMessage({id: "LANG1140"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG1141"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'fxs'
                                            ? 'hidden'
                                            : this.state.strategy_ipacl === '2'
                                                ? 'display-block'
                                                : 'hidden'
                                        }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2346" /> }>
                                            <span>{ formatMessage({id: "LANG1144"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('specific_ip', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.specific_ip
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'fxs'
                                            ? 'hidden'
                                            : this.state.strategy_ipacl === '1'
                                                ? 'display-block'
                                                : 'hidden'
                                        }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1145" /> }>
                                            <span>{ formatMessage({id: "LANG1146"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('local_network1', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.local_network1
                                })(
                                    <Input />
                                ) }
                                <Icon
                                    type="plus-circle-o"
                                    onClick={ this._addLocalNetwork }
                                    className="dynamic-network-button"
                                />
                            </FormItem>
                        </Col>
                        { localNetworkFormItems }
                        <Col
                            span={ 24 }
                            className={ extension_type === 'fxs' ? 'hidden' : 'display-block' }
                        >
                            <FormItem
                                { ...formItemLayoutTransfer }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1150" /> }>
                                            <span>{ formatMessage({id: "LANG1149"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('available_codec', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.available_codec
                                })(
                                    <Transfer
                                        showSearch
                                        render={ this._renderItem }
                                        targetKeys={ this.state.targetKeys }
                                        dataSource={ this.state.availableCodecs }
                                        onChange={ this._handleTransferChange }
                                        filterOption={ this._filterTransferOption }
                                        notFoundContent={ formatMessage({id: "LANG133"}) }
                                        onSelectChange={ this._handleTransferSelectChange }
                                        searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                        titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                    />
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