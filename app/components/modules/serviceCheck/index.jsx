'use strict'

// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import * as Actions from './actions/getServiceCheck'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Button, Col, Checkbox, InputNumber, message, Popover } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item

class ServiceCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            serviceCheck: {}
        }
    }
    componentDidMount() {
        this._getServiceCheck()
    }
    _getServiceCheck = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getServiceCheck' },
            type: 'json',
            async: false,
            success: function(res) {
                let serviceCheck = res.response

                this.setState({
                    serviceCheck: serviceCheck,
                    enabled: (serviceCheck.service_check_enable === '1')
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleCancel = () => {
        browserHistory.push('/maintenance/serviceCheck')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'updateServiceCheck'

                action.service_check_enable = (action.service_check_enable ? '1' : '0')

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
                            message.success(formatMessage({ id: "LANG844" }))
                        }
                    }.bind(this)
                })
            }
        })
    }
    _onEnableChange = (e) => {
        this.setState({
            enabled: e.target.checked
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        let serviceCheck = this.state.serviceCheck || {}
        let count = serviceCheck.service_check_count ? parseInt(serviceCheck.service_check_count) : ''
        let timeout = serviceCheck.service_check_timeout ? parseInt(serviceCheck.service_check_timeout) : ''

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG3437"})})

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG3437"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG3438"}) } content={ formatMessage({id: "LANG3432"}) }><span>{ formatMessage({id: "LANG3438"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('service_check_enable', {
                            valuePropName: 'checked',
                            initialValue: this.state.enabled
                        })(
                            <Checkbox onChange={ this._onEnableChange } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG3433"}) } content={ formatMessage({id: "LANG3434"}) }><span>{ formatMessage({id: "LANG3433"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('service_check_timeout', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: timeout
                        })(
                            <InputNumber min={ 30 } max={ 86400 } disabled={ !this.state.enabled } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG3435"}) } content={ formatMessage({id: "LANG3436"}) }><span>{ formatMessage({id: "LANG3435"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('service_check_count', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: count
                        })(
                            <InputNumber min={ 1 } max={ 99 } disabled={ !this.state.enabled } />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(ServiceCheck))

// const mapStateToProps = (state) => ({
//     serviceCheck: state.serviceCheck
// })

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(Actions, dispatch)
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(injectIntl(serviceCheck)))