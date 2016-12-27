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
    const SIPGenSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 6 }
    }
    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover 
                            title={ formatMessage({id: "LANG1765"}) } 
                            content={ formatMessage({id: "LANG1766"}) }>
                            <span>{ formatMessage({id: "LANG1765"}) }</span>
                        </Popover>
                    </span>
                )}
            >
                { getFieldDecorator('realm', {
                    rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }
                    ],
                    initialValue: SIPGenSettings.realm
                })(
                    <Input type="text" defaultValue="asterisk"/>
                ) }
            </FormItem>
        </Form>
    )
}))

class General extends Component {
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
        let SIPGenSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={SIPGenSettings} />
            </div>
        )
    }
}

General.propTypes = {
}

export default injectIntl(General)