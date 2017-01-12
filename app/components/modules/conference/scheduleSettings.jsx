'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Tooltip, Modal, DatePicker, Popconfirm } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class ScheduleSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scheduleSettings: {}
        }
    }
    componentDidMount() {
    }
    _getInitData = () => {
        
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/conference')
    }
    _handleSubmit = () => {
        
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG3775"}),
                    1: this.props.params.id
                })
                : formatMessage({id: "LANG3776"}))

        const scheduleSettings = this.state.scheduleSettings || {}

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'/>
                <div className="content">
                    <Form>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4455" /> }>
                                            <span>{ formatMessage({id: "LANG3783"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('confname', {
                                        initialValue: scheduleSettings.confname
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4456" /> }>
                                                <span>{ formatMessage({id: "LANG3777"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('confno', {
                                        initialValue: scheduleSettings.confno
                                    })(
                                        <Select></Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4460" /> }>
                                            <span>{ formatMessage({id: "LANG4309"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('con_admin', {
                                        initialValue: scheduleSettings.con_admin
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4457" /> }>
                                                <span>{ formatMessage({id: "LANG4281"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('kickall_time', {
                                        initialValue: scheduleSettings.kickall_time
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3808" /> }>
                                            <span>{ formatMessage({id: "LANG3807"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('starttime', {
                                        initialValue: scheduleSettings.starttime
                                    })(
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2230" /> }>
                                                <span>{ formatMessage({id: "LANG2230"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('endtime', {
                                        initialValue: scheduleSettings.endtime
                                    })(
                                        <Select></Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3801" /> }>
                                            <span>{ formatMessage({id: "LANG3791"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('open_calendar', {
                                        initialValue: scheduleSettings.open_calendar
                                    })(
                                        <Checkbox />
                                    ) }
                                    <Popconfirm
                                        onConfirm={ this._emailConfirm }
                                        okText={ formatMessage({id: "LANG136"}) }
                                        cancelText={ formatMessage({id: "LANG137"}) }
                                        title={ formatMessage({id: "LANG843"}, {0: formatMessage({id: "LANG3513"})}) }
                                    >
                                        <a href="#">{ formatMessage({id: "LANG3513"}) }</a>
                                    </Popconfirm>
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4459" /> }>
                                                <span>{ formatMessage({id: "LANG3803"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('recurringevent', {
                                        initialValue: scheduleSettings.recurringevent
                                    })(
                                        <Select></Select>
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4462" /> }>
                                                <span>{ formatMessage({id: "LANG2479"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('localeRightSelect', {
                                        initialValue: scheduleSettings.localeRightSelect
                                    })(
                                        <Select multiple></Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                                <span>{ formatMessage({id: "LANG3782"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('locale_send_email', {
                                        initialValue: scheduleSettings.locale_send_email
                                    })(
                                        <Checkbox />
                                    ) }
                                    <Popconfirm
                                        onConfirm={ this._emailConfirm }
                                        okText={ formatMessage({id: "LANG136"}) }
                                        cancelText={ formatMessage({id: "LANG137"}) }
                                        title={ formatMessage({id: "LANG843"}, {0: formatMessage({id: "LANG4572"})}) }
                                    >
                                        <a href="#">{ formatMessage({id: "LANG4572"}) }</a>
                                    </Popconfirm>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2531" /> }>
                                                <span>{ formatMessage({id: "LANG2480"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('remoteRightSelect', {
                                        initialValue: scheduleSettings.remoteRightSelect
                                    })(
                                        <Select multiple></Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                                <span>{ formatMessage({id: "LANG3782"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('remote_send_email', {
                                        initialValue: scheduleSettings.remote_send_email
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={ 6 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4461" /> }>
                                                <span>{ formatMessage({id: "LANG3778"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('member_name', {
                                        initialValue: scheduleSettings.member_name
                                    })(
                                        <Input style={{ width: 200 }} />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>
                                <FormItem>
                                    { getFieldDecorator('member_tel', {
                                        initialValue: scheduleSettings.member_tel
                                    })(
                                        <Input style={{ width: 200 }} />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>
                                <FormItem>
                                    { getFieldDecorator('member_mail', {
                                        initialValue: scheduleSettings.member_mail
                                    })(
                                        <Input style={{ width: 200 }} />
                                    ) }
                                </FormItem>
                            </Col>
                             <Col span={ 6 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                                <span>{ formatMessage({id: "LANG3782"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('remote_send_email', {
                                        initialValue: scheduleSettings.remote_send_email
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 24 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4458" /> }>
                                                <span>{ formatMessage({id: "LANG3799"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('description', {
                                        initialValue: scheduleSettings.description
                                    })(
                                        <Input type="textarea" />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(ScheduleSettings))