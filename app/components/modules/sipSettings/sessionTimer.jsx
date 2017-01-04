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
    const sipSessiontimerSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }

    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG4266" /> }>
                            <span>{ formatMessage({id: "LANG4265"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('force_timer', {
                    valuePropName: 'checked',
                    initialValue: sipSessiontimerSettings.session_timers === "always" ? true : false
                })(
                    <Checkbox />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG4268" /> }>
                            <span>{ formatMessage({id: "LANG4267"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('timer', {
                    valuePropName: 'checked',
                    initialValue: sipSessiontimerSettings.session_timers === "yes" ? true : false
                })(
                    <Checkbox disabled={sipSessiontimerSettings.session_timers === "always" ? true : false}/>
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1872" /> }>
                            <span>{ formatMessage({id: "LANG1871"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('session_expires', {
                    rules: [],
                    initialValue: sipSessiontimerSettings.session_expires
                })(
                    <Input maxLength="15" />
                )}
            </FormItem>                
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1874" /> }>
                            <span>{ formatMessage({id: "LANG1873"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('session_minse', {
                    rules: [],
                    initialValue: sipSessiontimerSettings.session_minse
                })(
                    <Input maxLength="15" />
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
        let sipSessiontimerSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={sipSessiontimerSettings} customizedForm={this} />
            </div>
        )
    }
}

SessionTimer.propTypes = {
}

export default injectIntl(SessionTimer)
