'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Popover, Select, Tabs } from 'antd'
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
        labelCol: { span: 3 },
        wrapperCol: { span: 6 }
    }

    let sessionTimers = sipSessiontimerSettings.session_timers,
        forceTimer = false,
        timer = false,
        disabled = false

    if (sessionTimers === "always") {
        forceTimer = true
        disabled = true
    } else {
        disabled = false
    }

    if (sessionTimers === "yes") {
        timer = true
    }

    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG4265"}) } 
                            content={ formatMessage({id: "LANG4266"}) }>
                            <span>{ formatMessage({id: "LANG4265"}) }</span>
                        </Popover>
                    </span>
                )}
            >
                { getFieldDecorator('force_timer', {
                    valuePropName: 'checked',
                    initialValue: forceTimer
                })(
                    <Checkbox />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG4267"}) } 
                            content={ formatMessage({id: "LANG4268"}) }>
                            <span>{ formatMessage({id: "LANG4267"}) }</span>
                        </Popover>
                    </span>
                )}
            >
                { getFieldDecorator('timer', {
                    valuePropName: 'checked',
                    initialValue: timer
                })(
                    <Checkbox disabled={disabled}/>
                ) }
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