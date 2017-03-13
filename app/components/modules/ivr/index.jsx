'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Modal, Popconfirm, Popover, Table, Tag } from 'antd'

class Ivr extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IVR: []
        }
    }
    componentDidMount() {
        this._getIvr()
    }
    componentWillUnmount() {
        
    }
    _getIvr = () => {
        const { formatMessage } = this.props.intl
        let IVR = {}

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listIVR',
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const IVR = response.ivr || []

                    this.setState({
                        IVR: IVR
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _createIvr = () => {
        browserHistory.push('/call-features/ivr/add')
    }
    _edit = (record) => {
        browserHistory.push('/call-features/ivr/edit/' + record.ivr_id + '/' + record.ivr_name)
    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteIVR",
                "ivr": record.ivr_id
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getIvr()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    render() {
        const {formatMessage} = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG647"})
        })

        const columns = [{
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG85"}),
                sorter: (a, b) => a.extension.length - b.extension.length
            }, {
                key: 'ivr_name',
                dataIndex: 'ivr_name',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.ivr_name.length - b.ivr_name.length
            }, {
                key: 'dial_extension',
                dataIndex: 'dial_extension',
                title: formatMessage({id: "LANG1445"}),
                sorter: (a, b) => a.dial_extension.length - b.dial_extension.length
            }, {
                key: 'dial_trunk',
                dataIndex: 'dial_trunk',
                title: formatMessage({id: "LANG1447"}),
                sorter: (a, b) => a.dial_trunk.length - b.dial_trunk.length
            }, {
                key: 'response_timeout',
                dataIndex: 'response_timeout',
                title: formatMessage({id: "LANG2540"}),
                sorter: (a, b) => a.response_timeout.length - b.response_timeout.length
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-edit"
                                title={ formatMessage({id: "LANG738"}) }
                                onClick={ this._edit.bind(this, record) }>
                            </span>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._delete.bind(this, record) }
                            >
                                <span className="sprite sprite-del" title={ formatMessage({id: "LANG739"}) }></span>
                            </Popconfirm>
                        </div>
                }
            }]
        const pagination = {
                total: this.state.IVR.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG647"}) }
                    isDisplay= "hidden"
                />
                <div className="content">
                    <div className="top-button">
                        <Button 
                            icon="plus"
                            type="primary"
                            size="default"
                            onClick={this._createIvr} >
                            {formatMessage({id: "LANG766"})}
                        </Button>
                    </div>
                    <div className="content">
                        <p >
                            <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG2320"})}} >
                            </span>
                        </p>
                    </div>
                    <Table
                        rowKey="extension"
                        columns={ columns }
                        pagination={ pagination }
                        dataSource={ this.state.IVR }
                        showHeader={ !!this.state.IVR.length }
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(Ivr)