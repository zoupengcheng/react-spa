'use strict'

import $ from 'jquery'
import React, { Component, PropTypes } from 'react'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Tooltip, Select, Table, Popconfirm } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'

class BackupRestore extends Component {
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
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
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
                                <span>{ formatMessage({id: "LANG637"}) }</span>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

BackupRestore.propTypes = {
}

export default Form.create()(injectIntl(BackupRestore))
