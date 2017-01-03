'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
// import * as Actions from './actions/'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import { injectIntl } from 'react-intl'
import Validator from "../../api/validator"
import ExtensionList from './extensionList'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Badge, Button, Icon, Form, Input, message, Modal, Popconfirm, Popover, Table, Tag } from 'antd'

const FormItem = Form.Item

class Extension extends Component {
    constructor(props) {
        super(props)
        this.state = {
            extensionList: [],
            selectedRowKeys: []
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    _getExtensionList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listAccount',
                options: "extension,account_type,fullname,status,addr,out_of_service,email_to_user",
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response || {}

                this.setState({
                    extensionList: response.account || []
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _add = () => {
        browserHistory.push('/extension-trunk/extension/add')
    }
    _batchEdit = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _batchDelete = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _import = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _export = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    _email = () => {
        browserHistory.push('/extension-trunk/extension/batchEdit/' + this.state.selectedRowKeys.join(','))
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG622"})
                })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title
                    isDisplay='hidden'
                    headerTitle={ formatMessage({id: "LANG622"}) }
                />
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={ this._add }
                        >
                            { formatMessage({id: "LANG769"}) }
                        </Button>
                        <Button
                            icon="edit"
                            type="primary"
                            onClick={ this._batchEdit }
                        >
                            { formatMessage({id: "LANG738"}) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            onClick={ this._batchDelete }
                        >
                            { formatMessage({id: "LANG739"}) }
                        </Button>
                        <Button
                            icon="upload"
                            type="primary"
                            onClick={ this._import }
                        >
                            { formatMessage({id: "LANG2733"}) }
                        </Button>
                        <Button
                            icon="export"
                            type="primary"
                            onClick={ this._export }
                        >
                            { formatMessage({id: "LANG2734"}) }
                        </Button>
                        <Button
                            icon="mail"
                            type="primary"
                            onClick={ this._email }
                        >
                            { formatMessage({id: "LANG3495"}) }
                        </Button>
                        <Form>
                            <FormItem>
                                { getFieldDecorator('group_name', {
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }, {
                                        validator: (data, value, callback) => {
                                            Validator.minlength(data, value, callback, formatMessage, 2)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                        }
                                    }]
                                })(
                                    <Input 
                                        placeholder={ formatMessage({id: "LANG85"}) }
                                    />
                                ) }
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    { formatMessage({id: "LANG803"}) }
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                    <ExtensionList
                        dataSource={ this.state.extensionList }
                    />
                </div>
            </div>
        )
    }
}

Extension.defaultProps = {}

export default Form.create()(injectIntl(Extension))