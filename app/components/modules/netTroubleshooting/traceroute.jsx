'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class Traceroute extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        return (
            <div className="content">
                <div className="ant-form">
                    <Form></Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(Traceroute))