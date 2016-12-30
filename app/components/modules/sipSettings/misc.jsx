'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Tabs } from 'antd'
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
            <div className="section-title">
                <span>{ formatMessage({id: "LANG699"}) }</span>
            </div>
            <div className="section-body">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ formatMessage({id: "LANG1894"}) }>
                                <span>{formatMessage({id: "LANG1893"})}</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('registertimeout', {
                        rules: [{ 
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }
                        ],
                        initialValue: sipMiscSettings.registertimeout
                    })(
                        <Input type="text" />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ formatMessage({id: "LANG1894"}) }>
                                <span>{formatMessage({id: "LANG1893"})}</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('registertimeout', {
                        rules: [{ 
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }
                        ],
                        initialValue: sipMiscSettings.registertimeout
                    })(
                        <Input type="text" />
                    )}
                </FormItem>
            </div>
            <div className="section-title">
                <span>{ formatMessage({id: "LANG700"}) }</span>
            </div>
            <div className="section-body">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ formatMessage({id: "LANG1894"}) }>
                                <span>{formatMessage({id: "LANG1893"})}</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('registertimeout', {
                        rules: [{ 
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }
                        ],
                        initialValue: sipMiscSettings.registertimeout
                    })(
                        <Input type="text" />
                    )}
                </FormItem>
            </div>
            <div className="section-title">
                <span>{ formatMessage({id: "LANG4550"}) }</span>
            </div>
            <div className="section-body">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ formatMessage({id: "LANG1894"}) }>
                                <span>{formatMessage({id: "LANG1893"})}</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('registertimeout', {
                        rules: [{ 
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }
                        ],
                        initialValue: sipMiscSettings.registertimeout
                    })(
                        <Input type="text" />
                    )}
                </FormItem>
            </div>
            <div className="section-title">
                <span>{ formatMessage({id: "LANG4774"}) }</span>
            </div>
            <div className="section-body">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ formatMessage({id: "LANG1894"}) }>
                                <span>{formatMessage({id: "LANG1893"})}</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('registertimeout', {
                        rules: [{ 
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }
                        ],
                        initialValue: sipMiscSettings.registertimeout
                    })(
                        <Input type="text" />
                    )}
                </FormItem>
            </div>
            <div className="section-title hidden">
                <span>{ formatMessage({id: "LANG5041"}) }</span>
            </div>
            <div className="section-body hidden">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ formatMessage({id: "LANG1894"}) }>
                                <span>{formatMessage({id: "LANG1893"})}</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('registertimeout', {
                        rules: [{ 
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }
                        ],
                        initialValue: sipMiscSettings.registertimeout
                    })(
                        <Input type="text" />
                    )}
                </FormItem>
            </div>
        </Form>
    )
}))

export default Form.create()(injectIntl(Misc))