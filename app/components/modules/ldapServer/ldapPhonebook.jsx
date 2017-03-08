'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Table, Form, Input, Modal, Button, Row, Col, Checkbox, message, Tooltip, Select, Tabs, Popconfirm } from 'antd'
import { FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import CreateLdapPhonebook from "./createLdapPhonebook"
import EditLdapPhonebook from "./editLdapPhonebook"
import ImportLdapPhonebook from "./importLdapPhonebook"
import ExportLdapPhonebook from "./exportLdapPhonebook"

const baseServerURl = api.apiHost

class LdapPhonebook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ldapPhonebooks: [],
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            sorter: {
                field: "dn",
                order: "asc"
            },
            firstLoad: true
        }
        this._showCreateModal = () => {
            this.setState({
                createVisible: true
            })
        }
        this._showImportModal = () => {
            this.setState({
                importVisible: true
            })
        }
        this._showExportModal = () => {
            this.setState({
                exportVisible: true
            })
        }
        this._handleCreateOk = (e) => {
            this.setState({
                createVisible: false
            })
        }
        this._handleCreateCancel = (e) => {
            this.setState({
                createVisible: false
            })
        }
        this._handleImportOk = (e) => {
            this.setState({
                importVisible: false
            })
        }
        this._handleImportCancel = (e) => {
            this.setState({
                importVisible: false
            })
        }
        this._handleExportOk = (e) => {
            this.setState({
                exportVisible: false
            })
        }
        this._handleExportCancel = (e) => {
            this.setState({
                exportVisible: false
            })
        }
        this._ldapClientConf = (e) => {
            browserHistory.push({
                pathname: '/system-settings/ldapServer/ldapClientConf'
            })
        }
        this._editLdapPhonebook = (e) => {
            browserHistory.push({
                pathname: '/system-settings/ldapServer/edit'
            })
        }
    }
    // componentDidMount() {
    //     this._listPhonebookDn()
    // }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    _handleTableChange = (pagination, filters, sorter) => {
        const pager = this.state.pagination

        pager.current = pagination.current

        this.setState({
            pagination: pager,
            sorter: sorter
        })

        this._listPhonebookDn({
            item_num: pagination.pageSize,
            page: pagination.current,
            sidx: sorter.field,
            sord: sorter.order === "ascend" ? "asc" : "desc",
            ...filters
        })
    }
    _listPhonebookDn = (
        params = {                
            item_num: 10,
            sidx: "dn",
            sord: "asc",
            page: 1 
        }) => {
        $.ajax({
            url: baseServerURl,
            method: 'post',
            data: {
                action: 'listPhonebookDn',
                ...params
            },
            type: 'json',
            async: true,
            success: function(res) {
                let ldapPhonebooks = res.response.ldap_phonebooks
                const pagination = this.state.pagination
                // Read total count from server
                pagination.total = res.response.total_item

                this.setState({
                    firstLoad: false,
                    ldapPhonebooks: ldapPhonebooks,
                    pagination
                })
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    _deleteLdapPhonebook = (data) => {
        const { formatMessage } = this.props.intl

        let phonebookdn = data.dn
        message.loading(formatMessage({id: "LANG825"}, {0: "LANG11"}), 0)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deletePhonebook",
                "ldap_phonebooks": phonebookdn
            },
            type: 'json',
            async: true,
            success: function(res) {
                let bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    // message.success(formatMessage({id: "LANG816"}))
                    let cmd_action = {
                        "action": "phonebookDel",
                        "phonebook_del": phonebookdn
                    }

                    $.ajax({
                        type: "post",
                        url: baseServerURl,
                        async: false,
                        data: cmd_action,
                        error: function(jqXHR, textStatus, errorThrown) {
                            message.destroy()
                            message.error(errorThrown)
                        }.bind(this),
                        success: function(data) {
                            this._listPhonebookDn()
                        }.bind(this)
                    })
                }
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    render() {
        const {formatMessage} = this.props.intl
        const state = this.state
        const props = this.props
        const columns = [
            {
                title: formatMessage({id: "LANG2003"}),
                dataIndex: 'dn',
                sorter: true
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => {
                    return <span>
                        <span className="sprite sprite-edit" title={ formatMessage({ id: "LANG738"})} onClick={this._editLdapPhonebook.bind(this, record)}></span>
                        <Popconfirm title={
                            <FormattedHTMLMessage
                                id='LANG952'
                            />} 
                            onConfirm={() => this._deleteLdapPhonebook(record)}>
                            <span className="sprite sprite-del" title={ formatMessage({ id: "LANG739"})} ></span>
                        </Popconfirm>
                    </span>
                } 
            }
        ]
        
        let ldapPhonebooks = state.ldapPhonebooks
        if (props.firstLoad && state.firstLoad) {
            this._listPhonebookDn()
        }
        if (!props.firstLoad && !state.firstLoad) {
            this.setState({
                firstLoad: true
            })
        }
        const pagination = {
            total: ldapPhonebooks.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange(current) {
                console.log('Current: ', current)
            }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button icon="plus" type="primary" size="default" onClick={ this._showCreateModal } >
                            {formatMessage({id: "LANG769"})}
                        </Button>
                        <Button icon="setting" type="primary" size="default" onClick={ this._ldapClientConf } >
                            {formatMessage({id: "LANG713"})}
                        </Button>
                        <Button icon="upload" type="primary" size="default" onClick={ this._showImportModal } >
                            {formatMessage({id: "LANG3914"})}
                        </Button>
                        <Button icon="export" type="primary" size="default" onClick={ this._showExportModal } >
                            {formatMessage({id: "LANG3915"})}
                        </Button>
                    </div>
                    <div className="lite-desc">{ formatMessage({ id: "LANG1997" }) }</div>
                    <Table
                        rowSelection={ undefined } 
                        columns={ columns }
                        rowKey={ record => record.dn }
                        dataSource={ state.ldapPhonebooks }
                        pagination={ state.pagination }
                        onChange={ this._handleTableChange }
                    />
                    <Modal
                        className="app-content-ldapPhonebook"
                        title={ formatMessage({ id: "LANG955" })}
                        visible={ state.createVisible }
                        onOk={ this._handleCreateOk } 
                        onCancel={ this._handleCreateCancel }
                    >
                        { 
                            <CreateLdapPhonebook 
                                handleOk = { this._handleCreateOk }
                                handleCancel = { this._handleCreateCancel }
                            /> 
                        }
                    </Modal>
                    <Modal
                        className="app-content-ldapPhonebook"
                        title={ formatMessage({ id: "LANG3914" })}
                        visible={ state.importVisible }
                        onOk={ this._handleImportOk } 
                        onCancel={ this._handleImportCancel }
                    >
                        { 
                            <ImportLdapPhonebook 
                                handleOk = { this._handleImportOk }
                                handleCancel = { this._handleImportCancel }
                            /> 
                        }
                    </Modal>
                    <Modal
                        className="app-content-ldapPhonebook"
                        title={ formatMessage({ id: "LANG3915" })}
                        visible={ state.exportVisible }
                        onOk={ this._handleExportOk } 
                        onCancel={ this._handleExportCancel }
                    >
                        { 
                            <ExportLdapPhonebook 
                                handleOk = { this._handleExportOk }
                                handleCancel = { this._handleExportCancel }
                            /> 
                        }
                    </Modal>
                </div>
            </div>
        )
    }
}

LdapPhonebook.defaultProps = {
}

export default injectIntl(LdapPhonebook)