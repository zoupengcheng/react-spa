'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl, formatMessage } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, DatePicker, message, Tooltip, Select } from 'antd'
import Validator from "../../api/validator"

const FormItem = Form.Item

class ChangeTime extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    componentWillUnmount() {

    }
    _getInitData = () => {
        
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const email_settings = this.state.email_settings
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <FormItem
                        ref="div_setsystime"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2532" />}>
                                <span>{formatMessage({id: "LANG2501"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('setsystime', {
                            rules: [],
                            initialValue: ""
                        })(
                            <DatePicker showTime placeholder={ formatMessage({id: "LANG5373"}) } format="YYYY-MM-DD HH:mm:ss" />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default injectIntl(ChangeTime)