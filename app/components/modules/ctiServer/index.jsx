'use strict'

// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import * as Actions from './actions/getCTIMidSettings'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, InputNumber, message, Popover } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item

class CTIServer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ctimidSettings: {}
        }
    }
    componentWillMount() {}
    componentDidMount() {
        this._getCRMSettings()
    }
    _getCRMSettings = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getCTIMidSettings' },
            type: 'json',
            async: true,
            success: function(res) {
                let ctimidSettings = res.response.ctimid_settings || {}

                this.setState({
                    ctimidSettings: ctimidSettings
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/ctiServer')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'updateCTIMidSettings'

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
    _validatePortFormate = (rule, value, callback) => {
        if (/^[0-9+]*x*.{0,1}$/i.test(value)) {
            callback()
        } else {
            callback('no match')
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        let ctimidSettings = this.state.ctimidSettings || {}
        let port = ctimidSettings.port ? parseInt(ctimidSettings.port) : ''

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG4815"})})
        
        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG4815"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG1103"}) } content={ formatMessage({id: "LANG4827"}) }><span>{ formatMessage({id: "LANG1103"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('port', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._validatePortFormate }
                            ],
                            initialValue: port
                        })(
                            <InputNumber min={ 1 } max={ 65535 } />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(CTIServer))

// const mapStateToProps = (state) => ({
//     ctimidSettings: state.ctiServer
// })

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(Actions, dispatch)
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(injectIntl(CTIServer)))