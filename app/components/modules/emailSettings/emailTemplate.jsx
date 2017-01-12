'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"

class EmailTemplate extends Component {
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
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
                <div className="app-content-main" id="app-content-main">
                    <Form>
                    </Form>
                </div>
            )
    }
}

EmailTemplate.propTypes = {
}

export default Form.create()(injectIntl(EmailTemplate))
