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
            username: {
            }
        }
    }
})((props) => {
    const { getFieldDecorator } = props.form
    const { formatMessage } = props.intl
    const sipTcpSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 6 }
    }

    let tcpenable = sipTcpSettings.tcpenable

    // if (tcpenable == "yes") {
    //     tcpenable = true
    // } else {
    //     tcpenable = false
    // }

    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG1853"}) } 
                            content={ formatMessage({id: "LANG1854"}) }>
                            <span>{ formatMessage({id: "LANG1853"}) }</span>
                        </Popover>
                    </span>
                )}
            >
                { getFieldDecorator('tcpenable', {
                    valuePropName: 'checked',
                    initialValue: (tcpenable === "yes") ? true : false
                })(
                    <Checkbox />
                ) }
            </FormItem>
        </Form>
    )
}))

class TcpTls extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _handleFormChange = (changedFields) => {
        _.extend(this.props.dataSource, changedFields)
    }
    render() {
        const {formatMessage} = this.props.intl
        let sipTcpSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={sipTcpSettings} />
            </div>
        )
    }
}

TcpTls.propTypes = {
}

export default injectIntl(TcpTls)