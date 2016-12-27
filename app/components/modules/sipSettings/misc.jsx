'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Popover, Select, Tabs } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'

class Misc extends Component {
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
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                
            }
        })
        _.extend(this.props.dataSource, changedFields)
    }
    render() {
        const {formatMessage} = this.props.intl
        let sipMiscSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange} dataSource={sipMiscSettings} />
            </div>
        )
    }
}

Misc.propTypes = {
}

const CustomizedForm = injectIntl(Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        return {
        }
    }
})((props) => {
    const { getFieldDecorator } = props.form
    const { formatMessage } = props.intl
    const sipMiscSettings = props.dataSource
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
                            title={ formatMessage({id: "LANG1893"}) } 
                            content={ formatMessage({id: "LANG1894"}) }>
                            <span>{ formatMessage({id: "LANG1893"}) }</span>
                        </Popover>
                    </span>
                )}
            >
                { getFieldDecorator('registertimeout', {
                    rules: [{ 
                            required: true, 
                            message: formatMessage({id: "LANG2150"})
                        }
                    ],
                    initialValue: sipMiscSettings.registertimeout
                })(
                    <Input type="text" defaultValue="20"/>
                ) }
            </FormItem>
        </Form>
    )
}))

export default Form.create()(injectIntl(Misc))