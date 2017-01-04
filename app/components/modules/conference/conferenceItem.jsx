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
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item

class ConferenceItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conferenceItem: {}
        }
    }
    componentWillMount() {
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
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG595"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG597"}))

        const extensionGroupItem = this.state.extensionGroupItem || {}
        const name = extensionGroupItem.group_name

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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1030" /> }>
                                            <span>{ formatMessage({id: "LANG1029"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('extension', {
                                        rules: [],
                                        initialValue: this.state.conferenceItem.extension
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2432" /> }>
                                            <span>{ formatMessage({id: "LANG2431"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('public', {
                                        rules: [],
                                        initialValue: this.state.conferenceItem.public
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1037" /> }>
                                                <span>{ formatMessage({id: "LANG1041"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('wait_admin', {
                                        rules: [],
                                        initialValue: this.state.conferenceItem.wait_admin
                                    })(
                                        <Checkbox />
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

export default Form.create()(injectIntl(ConferenceItem))