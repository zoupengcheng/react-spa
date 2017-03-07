'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Modal, Button, Row, Col, Checkbox, message, Tooltip, Select, Tabs, Spin } from 'antd'
import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import Validator from "../../api/validator"
import Title from '../../../views/title'
import UCMGUI from "../../api/ucmgui"

const FormItem = Form.Item
const Option = Select.Option
const baseServerURl = api.apiHost

class ExportLdapPhonebook extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this._handleSave = () => {
            this.props.handleOk()
        }
        this._handleCancel = () => {
            this.props.handleCancel()
        }
    }
    componentDidMount() {
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="content">
                <div className="section-title">{ formatMessage({ id: "LANG2741" })}</div>
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG573"}) }>
                        { getFieldDecorator('export_type', {
                            rules: [],
                            initialValue: "csv"
                        })(
                            <Select>
                                <Option value='csv'>CSV</Option>
                                <Option value='vcf'>VCF</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG576"}) }>
                        <span ref="phonebook_wrap"></span>
                    </FormItem>
                    <div className="app-ant-modal-footer">
                        <Button type="primary" onClick= { this._handleCancel }>
                            {formatMessage({id: "LANG726"})}
                        </Button>
                        <Button type="primary" onClick= { this._handleSave }>
                            {formatMessage({id: "LANG728"})}
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}

module.exports = Form.create()(injectIntl(ExportLdapPhonebook))