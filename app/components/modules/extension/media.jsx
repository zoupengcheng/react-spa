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
import { Form, Input, message, Transfer, Tooltip } from 'antd'

const FormItem = Form.Item

class Media extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _onFocus = (e) => {
        e.preventDefault()

        const form = this.props.form

        form.validateFields([e.target.id], { force: true })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const dataSource = this.props.dataSource || {}
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="content">
                <div className="ant-form">
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1193" defaultMessage="LANG1193" /> }>
                                    <span>{ formatMessage({id: "LANG1192"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('bbbb', {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }
                            ],
                            initialValue: dataSource.queuelogin
                        })(
                            <Input onFocus={ this._onFocus } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1193" defaultMessage="LANG1193" /> }>
                                    <span>{ formatMessage({id: "LANG1194"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator('bbb', {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }
                            ],
                            initialValue: dataSource.queuelogout
                        })(
                            <Input onFocus={ this._onFocus } />
                        ) }
                    </FormItem>
                </div>
            </div>
        )
    }
}

export default injectIntl(Media)