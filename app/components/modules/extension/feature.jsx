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

class Feature extends Component {
    constructor(props) {
        super(props)

        const dnd = this.props.settings.dnd === 'yes' ? true : false
        const enable_cc = this.props.settings.enable_cc === 'yes' ? true : false
        const strategy_ipacl = this.props.settings.strategy_ipacl

        this.state = {
            dnd: dnd,
            enable_cc: enable_cc,
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
    _addWhiteList = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl

        // can use data-binding to get
        const whiteLists = form.getFieldValue('whiteLists')

        if (whiteLists.length <= 8) {
            const newWhiteLists = whiteLists.concat(this._generateWhiteListID(whiteLists))

            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                whiteLists: newWhiteLists
            })
        } else {
            message.warning(formatMessage({id: "LANG809"}, {
                    0: '',
                    1: 10
                }))

            return false
        }
    }
    _filterCodecsSource = () => {
        if (this.props.extensionType === 'iax') {
            return _.filter(this.state.availableCodecs, function(item) {
                    return item.key !== 'opus'
                })
        } else {
            return this.state.availableCodecs
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _generateWhiteListID = (existIDs) => {
        let newID = 2

        if (existIDs && existIDs.length) {
            newID = _.find([2, 3, 4, 5, 6, 7, 8, 9, 10], function(key) {
                    return !_.contains(existIDs, key)
                })
        }

        return newID
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
    _onChangeDND = (e) => {
        this.setState({
            dnd: e.target.checked
        })
    }
    _onChangeEnableCC = (e) => {
        this.setState({
            enable_cc: e.target.checked
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
    _removeWhiteList = (k) => {
        const { form } = this.props
        // can use data-binding to get
        const whiteLists = form.getFieldValue('whiteLists')

        // can use data-binding to set
        form.setFieldsValue({
            whiteLists: whiteLists.filter(key => key !== k)
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

        getFieldDecorator('whiteLists', { initialValue: [] })

        const whiteLists = getFieldValue('whiteLists')
        const whiteListFormItems = whiteLists.map((k, index) => {
            return (
                <Col
                    key={ k }
                    span={ 12 }
                    className={ this.state.dnd ? 'display-block' : 'hidden' }
                >
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG5177" /> }>
                                    <span>{ formatMessage({id: "LANG5178"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator(`whitelist${k}`, {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }
                            ],
                            initialValue: settings[`whitelist${k}`]
                        })(
                            <Input />
                        ) }
                        <Icon
                            type="minus-circle-o"
                            onClick={ () => this._removeWhiteList(k) }
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
                                <span>{ formatMessage({id: "LANG3887"}) }</span>
                            </div>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1084" /> }>
                                            <span>{ formatMessage({id: "LANG1083"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfu', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cfu
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3374" /> }>
                                            <span>{ formatMessage({id: "LANG3371"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfu_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cfu_timetype
                                })(
                                    <Select>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1086" /> }>
                                            <span>{ formatMessage({id: "LANG1085"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfn', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cfn
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3374" /> }>
                                            <span>{ formatMessage({id: "LANG3371"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfu_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cfu_timetype
                                })(
                                    <Select>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1088" /> }>
                                            <span>{ formatMessage({id: "LANG1087"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfb', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cfb
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3376" /> }>
                                            <span>{ formatMessage({id: "LANG3373"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cfb_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cfb_timetype
                                })(
                                    <Select>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5179" /> }>
                                            <span>{ formatMessage({id: "LANG4768"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('dnd', {
                                    rules: [],
                                    initialValue: settings.dnd === 'yes'
                                })(
                                    <Checkbox onChange={ this._onChangeDND } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5180" /> }>
                                            <span>{ formatMessage({id: "LANG4769"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('dnd_timetype', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.dnd_timetype
                                })(
                                    <Select disabled={ !this.state.dnd }>
                                        <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                        <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                        <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                        <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                        <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                        <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                        <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ this.state.dnd ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5177" /> }>
                                            <span>{ formatMessage({id: "LANG5178"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('whitelist1', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.whitelist1
                                })(
                                    <Input />
                                ) }
                                <Icon
                                    type="plus-circle-o"
                                    onClick={ this._addWhiteList }
                                    className="dynamic-network-button"
                                />
                            </FormItem>
                        </Col>
                        { whiteListFormItems }
                    </Row>
                    <Row
                        className={ extension_type === 'iax' ? 'hidden' : 'display-block' }
                    >
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG3725"}) }</span>
                            </div>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3727" /> }>
                                            <span>{ formatMessage({id: "LANG3726"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('enable_cc', {
                                    rules: [],
                                    initialValue: settings.enable_cc === 'yes'
                                })(
                                    <Checkbox onChange={ this._onChangeEnableCC } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ this.state.enable_cc && extension_type === 'sip'
                                            ? 'display-block'
                                            : 'hidden'
                                        }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3729" /> }>
                                            <span>{ formatMessage({id: "LANG3728"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cc_mode', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cc_mode
                                })(
                                    <Select>
                                        <Option value='normal'>Normal</Option>
                                        <Option value='trunk'>For Trunk</Option>
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3734" /> }>
                                            <span>{ formatMessage({id: "LANG3733"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cc_max_agents', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cc_max_agents
                                })(
                                    <InputNumber />
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3740" /> }>
                                            <span>{ formatMessage({id: "LANG3739"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('cc_max_monitors', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.cc_max_monitors
                                })(
                                    <InputNumber />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
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
                                <Transfer
                                    showSearch
                                    render={ item => item.title }
                                    targetKeys={ this.state.targetKeys }
                                    dataSource={ this._filterCodecsSource() }
                                    onChange={ this._handleTransferChange }
                                    filterOption={ this._filterTransferOption }
                                    notFoundContent={ formatMessage({id: "LANG133"}) }
                                    onSelectChange={ this._handleTransferSelectChange }
                                    searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                    titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(Feature)