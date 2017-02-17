'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Tooltip, Button, message, Modal, Popconfirm, Popover, Table, Tag, Form, Row, Col, Input } from 'antd'

const confirm = Modal.confirm
const FormItem = Form.Item

class Fax extends Component {
    constructor(props) {
        super(props)
        this.state = {
            faxItem: [],
            faxFileItem: [],
            selectedRowKeys: [],
            selectedRowKeysFile: [],
            batchDeleteModalVisible: false
        }
    }
    componentDidMount() {
        this._getInitDate()
        this._getFaxFile()
    }
    _add = () => {
        browserHistory.push('/call-features/fax/add')
    }
    _clearSelectRows = () => {
        this.setState({
            selectedRowKeys: []
        })
    }
    _clearSelectRowsFile = () => {
        this.setState({
            selectedRowKeysFile: []
        })
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
                "action": "deleteFax",
                "fax": record.extension
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitDate()
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/call-features/fax/edit/' + record.extension + '/' + record.fax_name)
    }
    _batchdeleteCancel = () => {
        this.setState({
            batchDeleteModalVisible: false
        })
    }
    _batchdeleteOK = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        this.setState({
            batchDeleteModalVisible: false
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteFax",
                "fax": this.state.selectedRowKeys.join(',')
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getInitDate()
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _batchdelete = () => {
        this.setState({
            batchDeleteModalVisible: true
        })
    }
    _faxSetting = () => {
        browserHistory.push('/call-features/fax/setting')
    }
    _delete_file = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4763" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "removeFile",
                "type": "fax",
                "data": record.n
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getFaxFile()
                    this._clearSelectRowsFile()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _download_file = (record) => {
        const { formatMessage } = this.props.intl

        $.ajax({
                url: "../cgi?action=checkFile&type=fax&data=" + record.n,
                type: "GET",
                dataType: "json",
                async: false,
                success: function(res) {
                    var status = res.hasOwnProperty('status') ? res.status : null,
                        existed = false

                    if (status === 0) {
                        if (res.response.result === 0) {
                            existed = true
                        }

                        if (existed) {
                            window.open("/cgi?action=downloadFile&type=fax&data=" + record.n)
                        } else {
                            message.error(formatMessage({id: "LANG2684"}))
                        }
                    } else {
                        message.error(formatMessage({id: "LANG2684"}))
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
    }
    _getInitDate = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFax',
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const fax = response.fax || []

                    this.setState({
                        faxItem: fax
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getFaxFile = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFile',
                type: 'fax',
                filter: '{"list_dir":0,"list_file":1,"file_keyword":""}',
                sidx: 'd',
                sord: 'desc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const fax = response.fax || []

                    this.setState({
                        faxFileItem: fax
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _searchFile = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        let keyword = getFieldValue('file_keyword')
        let filter = '{"list_dir":0,"list_file":1,"file_keyword":""}'
        if (keyword && keyword !== "") {
            filter = '{"list_dir":0,"list_file":1,"file_keyword":"-' + keyword + '-"}'
        }

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFile',
                type: 'fax',
                filter: filter,
                sidx: 'd',
                sord: 'desc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const fax = response.fax || []

                    this.setState({
                        faxFileItem: fax
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ 
            selectedRowKeys: selectedRowKeys
        })
    }
    _onSelectChangeFile = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ 
            selectedRowKeysFile: selectedRowKeys
        })
    }
    _deleteAllSelectdFileOK = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4763" })}}></span>

        message.loading(loadingMessage)
        let removeSuccess = true
        for (let i = 0; i < this.state.selectedRowKeysFile.length; i++) {
            if (removeSuccess) {
                $.ajax({
                    url: api.apiHost,
                    method: 'post',
                    data: {
                        "action": "removeFile",
                        "type": "fax",
                        "data": this.state.selectedRowKeysFile[i]
                    },
                    type: 'json',
                    async: true,
                    success: function(res) {
                        const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)
                        } else {
                            removeSuccess = false
                        }
                    }.bind(this),
                    error: function(e) {
                        message.error(e.statusText)
                    }
                })
            }
        }
        if (removeSuccess) {
            this._getFaxFile()
            this._clearSelectRowsFile()
        }
    }
    _deleteAllSelectdFile = () => {
        const { formatMessage } = this.props.intl
        const __this = this
        if (this.state.selectedRowKeysFile.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG823"}, {0: formatMessage({id: "LANG4064"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML=
                                {{__html: formatMessage({id: "LANG818"}, {0: this.state.selectedRowKeysFile.join('  ')})}}
                            ></span>,
                onOk() {
                    __this._deleteAllSelectdFileOK()
                },
                onCancel() {}
            })
        }
    }
    _deleteAllFileOK = () => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4763" })}}></span>

        let keyword = getFieldValue('file_keyword')
        let filter = ''
        if (keyword && keyword !== "") {
            filter = '-' + keyword + '-'
        }

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "batchRemoveFile",
                "type": "fax",
                "data": filter
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._searchFile()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _deleteAllFile = () => {
        const { formatMessage } = this.props.intl
        const __this = this
        if (this.state.faxFileItem.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG129"}, {0: formatMessage({id: "LANG4064"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML=
                                {{__html: formatMessage({id: "LANG2794"})}}
                            ></span>,
                onOk() {
                    __this._deleteAllFileOK()
                },
                onCancel() {}
            })
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG85"}),
                sorter: (a, b) => a.extension.length - b.extension.length
            }, {
                key: 'fax_name',
                dataIndex: 'fax_name',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.fax_name.length - b.fax_name.length
            }, {
                key: 'email',
                dataIndex: 'email',
                title: formatMessage({id: "LANG126"}),
                sorter: (a, b) => a.email.length - b.email.length
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
                total: this.state.faxItem.length,
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
        const columns_file = [{
                key: 'n',
                dataIndex: 'n',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.n.length - b.n.length
            }, {
                key: 'd',
                dataIndex: 'd',
                title: formatMessage({id: "LANG203"}),
                sorter: (a, b) => a.d.length - b.d.length
            }, {
                key: 's',
                dataIndex: 's',
                title: formatMessage({id: "LANG2257"}),
                sorter: (a, b) => a.s.length - b.s.length
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-download"
                                onClick={ this._download_file.bind(this, record) }>
                            </span>
                            <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._delete_file.bind(this, record) }
                            >
                                <span className="sprite sprite-del"></span>
                            </Popconfirm>
                        </div>
                }
            }]
        const pagination_file = {
                total: this.state.faxFileItem.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }
        const rowSelection_file = {
                onChange: this._onSelectChangeFile,
                selectedRowKeys: this.state.selectedRowKeysFile
            }
        
        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG614"})
                })
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG614"}) }
                    isDisplay= "hidden"
                />
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._add }
                        >
                            { formatMessage({id: "LANG752"}) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._batchdelete }
                            disabled={ !this.state.selectedRowKeys.length }
                        >
                            { formatMessage({id: "LANG2924"}) }
                        </Button>
                        <Modal
                            onOk={ this._batchdeleteOK }
                            onCancel={ this._batchdeleteCancel }
                            title={ formatMessage({id: "LANG543"}) }
                            okText={ formatMessage({id: "LANG727"}) }
                            cancelText={ formatMessage({id: "LANG726"}) }
                            visible={ this.state.batchDeleteModalVisible }
                        >
                            <span dangerouslySetInnerHTML=
                                {{__html: formatMessage({id: "LANG818"}, {0: this.state.selectedRowKeys.join('  ')})}}
                            ></span>
                        </Modal>
                        <Button
                            icon="setting"
                            type="primary"
                            size='default'
                            onClick={ this._faxSetting }
                        >
                            { formatMessage({id: "LANG753"}) }
                        </Button>
                    </div>
                    <div>
                        <p><span>
                                { formatMessage({id: "LANG1258" })}
                            </span>
                        </p>
                    </div>
                    <Table
                        rowKey="extension"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.faxItem }
                        showHeader={ !!this.state.faxItem.length }
                    />
                    <div className='section-title section-title-specail'>
                        <p>
                            <span>
                                { formatMessage({id: "LANG2987" })}
                            </span>
                        </p>
                    </div>
                    <Row>
                        <Col span={ 6 } >
                            <FormItem
                                ref="div_file_keyword"
                                { ...formItemLayout }

                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2792" />}>
                                        <span>{formatMessage({id: "LANG2793"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('file_keyword', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength='127' />
                                ) }
                            </FormItem>
                        </Col>
                        <Col>
                            <Button
                                icon="search"
                                type="primary"
                                size='default'
                                onClick={ this._searchFile }
                            >
                                { formatMessage({id: "LANG803"}) }
                            </Button>
                        </Col>
                    </Row>
                    <div className="top-button">
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._deleteAllSelectdFile }
                        >
                            { formatMessage({id: "LANG2791"}) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._deleteAllFile }
                        >
                            { formatMessage({id: "LANG740"}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="n"
                        columns={ columns_file }
                        pagination={ pagination_file }
                        rowSelection={ rowSelection_file }
                        dataSource={ this.state.faxFileItem }
                        showHeader={ !!this.state.faxFileItem.length }
                    />
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(Fax))