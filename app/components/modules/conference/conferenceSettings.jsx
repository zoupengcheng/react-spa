'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl'
import { Form, Checkbox, InputNumber, message, Tooltip } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item

class ConferenceSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            settings: {}
        }
    }
    componentDidMount() {
        this._getConferenceSettings()
    }
    _getConferenceSettings = () => {
        
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

        let settings = this.state.settings || {}

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG5097"})})

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG5097"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <Tooltip title={ <FormattedHTMLMessage id="LANG5099" /> }>
                                <span>{ formatMessage({id: "LANG5098"}) }</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('talk_detection_events', {
                            initialValue: settings.talk_detection_events
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <Tooltip title={ <FormattedHTMLMessage id="LANG5101" /> }>
                                <span>{ formatMessage({id: "LANG5100"}) }</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('dsp_talking_threshold', {
                            initialValue: settings.dsp_talking_threshold
                        })(
                            <InputNumber />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <Tooltip title={ <FormattedHTMLMessage id="LANG5103" /> }>
                                <span>{ formatMessage({id: "LANG5102"}) }</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('dsp_silence_threshold', {
                            initialValue: settings.dsp_silence_threshold
                        })(
                            <InputNumber />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(ConferenceSettings))