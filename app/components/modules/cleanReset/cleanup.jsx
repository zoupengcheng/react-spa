'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Tooltip, Select, Table, Popconfirm } from 'antd'

const FormItem = Form.Item

class Cleanup extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG2916"}) }</span>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

Cleanup.propTypes = {
}

export default Form.create()(injectIntl(Cleanup))