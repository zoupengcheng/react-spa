'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'

const CustomizedForm = injectIntl(Form.create({
    onFieldsChange(props, changedFields) {
        // this.props.dataSource["form"] = this.props.form
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        return {
        }
    }
})((props) => {
    const { getFieldDecorator } = props.form
    const { formatMessage } = props.intl
    const IAXSecSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }

    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <Tooltip title={ <FormattedHTMLMessage id="LANG1682" /> }>
                        <span>{ formatMessage({id: "LANG1681"}) }</span>
                    </Tooltip>
                )}>
                { getFieldDecorator('calltokenoptionalr', {
                    rules: [],
                    initialValue: IAXSecSettings.iax_security_settings.calltokenoptional
                })(
                    <Input maxLength="60" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={
                    <Tooltip title={ <FormattedHTMLMessage id="LANG1684" /> }>
                        <span>{ formatMessage({id: "LANG1683"}) }</span>
                    </Tooltip>
                  }>
                { getFieldDecorator('maxcallnumbers', {
                    rules: [{ 
                                required: true
                            }],
                    initialValue: IAXSecSettings.iax_security_settings.maxcallnumbers
                })(
                    <Input maxLength="6" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={
                    <Tooltip title={ formatMessage({id: "LANG1686"}) }>
                        {formatMessage({id: "LANG1685"})}
                    </Tooltip>
                }>
                { getFieldDecorator('maxcallnumbers_nonvalidated', {
                    rules: [{ 
                                required: true
                            }],
                    initialValue: IAXSecSettings.iax_security_settings.maxcallnumbers_nonvalidated
                })(
                    <Input maxLength="6" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={
                    <Tooltip title={ formatMessage({id: "LANG1688"}) }>
                        {formatMessage({id: "LANG1687"})}
                    </Tooltip>
                }>
                { getFieldDecorator('iax_security_calllimit_settings', {
                    rules: [],
                    initialValue: IAXSecSettings.iax_security_settings.iax_security_calllimit_settings
                })(
                    <Input type="textarea" maxLength="6" />
                )}
            </FormItem>
        </Form>
    )
}))

class SessionTimer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timer: false
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _handleFormChange = (changedFields) => {
        if (changedFields.force_timer) {
            if (changedFields.force_timer.value === false) {
                this.props.dataSource.session_timers = "no"
            } else {
                this.props.dataSource.session_timers = "always"
            }
        } else if (changedFields.timer) {
            if (changedFields.timer.value === false) {
                this.props.dataSource.session_timers = "no"
            } else {
                this.props.dataSource.session_timers = "yes"
            }            
        } else {
            _.extend(this.props.dataSource, changedFields)  
        }
        this.forceUpdate()  
    }
    render() {
        const {formatMessage} = this.props.intl
        let IAXSecSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={IAXSecSettings} customizedForm={this} />
            </div>
        )
    }
}

SessionTimer.propTypes = {
}

export default injectIntl(SessionTimer)
