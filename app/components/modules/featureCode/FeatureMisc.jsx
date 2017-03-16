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
import { Checkbox, Col, Form, Input, message, Row, Select, Transfer, Tooltip, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class FeatureMisc extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount() {
        this._getInitData()
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        let mohNameList = UCMGUI.isExist.getList('getMohNameList', formatMessage)

        this.setState({
            mohNameList: mohNameList ? mohNameList : ['default', 'ringbacktone_default']
        })
    }
    _resetAll = () => {
        const { setFieldsValue } = this.props.form
        const featureMisc = this.props.dataSource || {}
        setFieldsValue({
            featuredigittimeout: featureMisc.featuredigittimeout,
            parkext: featureMisc.parkext,
            parkpos: featureMisc.parkpos,
            park_as_extension: featureMisc.park_as_extension === 'yes',
            parkingtime: featureMisc.parkingtime,
            parkedmusicclass: featureMisc.parkedmusicclass || ''
        })
        this.setState({
            park_as_extension: featureMisc.park_as_extension === 'yes'
        })
    }
    _resetDefault = () => {
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            featuredigittimeout: '1000',
            parkext: '700',
            parkpos: '701-720',
            park_as_extension: false,
            parkingtime: '300',
            parkedmusicclass: 'default'
        })
        this.setState({
            park_as_extension: false
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const featureMisc = this.props.dataSource || {}
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 10 }
        }

        return (
            <div className="content">
                <div className="top-button">
                    <Button type="primary" onClick={ this._resetAll }>{ formatMessage({id: "LANG751"}) }</Button>
                    <Button type="primary" onClick={ this._resetDefault }>{ formatMessage({id: "LANG749"}) }</Button>
                </div>
                <div className="ant-form">
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1235" /> }>
                                            <span>{ formatMessage({id: "LANG1234"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('featuredigittimeout', {
                                    initialValue: featureMisc.featuredigittimeout
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1245" /> }>
                                            <span>{ formatMessage({id: "LANG1244"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('parkext', {
                                    initialValue: featureMisc.parkext
                                })(
                                    <Input />
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1243" /> }>
                                            <span>{ formatMessage({id: "LANG1242"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('parkpos', {
                                    initialValue: featureMisc.parkpos
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3983" /> }>
                                            <span>{ formatMessage({id: "LANG3982"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('park_as_extension', {
                                    valuePropName: 'checked',
                                    initialValue: featureMisc.park_as_extension === 'yes'
                                })(
                                    <Checkbox />
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1251" /> }>
                                            <span>{ formatMessage({id: "LANG1250"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('parkingtime', {
                                    initialValue: featureMisc.parkingtime
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1603" /> }>
                                            <span>{ formatMessage({id: "LANG1603"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('parkedmusicclass', {
                                    initialValue: featureMisc.parkedmusicclass
                                })(
                                    <Select>
                                        {
                                            this.state.mohNameList.map(function(value) {
                                                return <Option key={ value } value={ value }>{ value }</Option>
                                            })
                                        }
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

export default injectIntl(FeatureMisc)