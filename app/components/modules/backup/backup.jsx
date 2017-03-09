'use strict'

import $ from 'jquery'
import React, { Component, PropTypes } from 'react'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Button, Modal, Row, Col, Checkbox, message, Tooltip, Upload, Icon, Select, Table, Popconfirm } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'

const Option = Select.Option
const confirm = Modal.confirm
const host = api.apiHost
const addZero = UCMGUI.addZero

class BackupRestore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            selectedRowKeys: [],
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            loading: false,
            visible: false,
            type: "upload",
            fileName: "",
            selectedRows: [],
            download_visible: false,
            initPackName: '',
            isRestoreComplete: false
        }
    }
    componentDidMount() {
        this._getLocalFileList()
    }
    componentWillUnmount() {

    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    _showModal = (type, record) => {
        if (typeof record !== "undefined") {
            this.setState({
                visible: true,
                type: type,
                fileName: record.n
            })
        } else {
            this.setState({
                visible: true,
                type: type
            })   
        }
    }
    _clearSelectRows = () => {
        this.setState({
            selectedRowKeys: []
        })
    }
    _createNew = (record) => {
        browserHistory.push('/maintenance/backup/create')
    }
    _upload = (record) => {
        this._showModal("upload")
    }
    _regularBackup = (record) => {
        browserHistory.push('/maintenance/backup/regular')
    }
    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }
    _getLocalFileList = (
        params = {
            item_num: 10,
            sidx: 'd',
            sord: 'asc',
            page: 1
        }
        ) => {
        const { formatMessage } = this.props.intl
        this.setState({loading: true})

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFile',
                type: 'backup',
                filter: '{"list_dir":0,"list_file":1,"file_suffix":["tar"]}',
                ...params
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const fileList = response.backup || []
                    const pagination = this.state.pagination
                    // Read total count from server
                    pagination.total = response.total_item

                    this.setState({
                        loading: false,
                        fileList: fileList,
                        pagination
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _download = (record) => {
        const { formatMessage } = this.props.intl

        let filename = record.n

        $.ajax({
            type: "post",
            url: "../cgi",
            data: {
                "action": "checkFile",
                "type": "backup",
                "data": filename // 1005-1.gsm
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    window.open("/cgi?action=downloadFile&type=backup&data=" + encodeURIComponent(filename), '_self')
                } else {
                    message.error(formatMessage({ id: "LANG3868" }))
                }
            }
        })
    }
    _reload = (record) => {
        const { formatMessage } = this.props.intl
        let isRestoreComplete = this.status.isRestoreComplete || false
        let filename = record.n
        let loadingMessage = ''
        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG832" })}}></span>

        $.ajax({
            type: "post",
            url: "../cgi",
            data: {
                "action": "getInfo"
            },
            error: function(jqXHR, textStatus, errorThrown) {
                setTimeout(this._reload, 5000)

                if (!isRestoreComplete) {
                    isRestoreComplete = true
                    this.setState({
                        isRestoreComplete: isRestoreComplete
                    })
                    message.loading(loadingMessage)
                }
            },
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0) && isRestoreComplete) {
                    message.destroy()
                    UCMGUI.logoutFunction.doLogout()
                } else {
                    setTimeout(this._reload, 5000)
                }
            }
        })
    }
    _restore = (record) => {
        const { formatMessage } = this.props.intl
        let loadingMessage = ''
        let successMessage = ''
        let filename = record.n
        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG855" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2798" })}}></span>

        message.loading(loadingMessage)
        $.ajax({
            type: "post",
            url: "../cgi",
            data: {
                "action": "restoreUCMConfig",
                "file-restore": "default," + filename // 1005-1.gsm
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                    if (bool) {
                        message.destroy()
                        message.success(successMessage)

                        this._reload()
                    }
                } else {
                    message.error(formatMessage({ id: "LANG3868" }))
                }
            }
        })
    }
    _delete = (record) => {
        const { formatMessage } = this.props.intl

        let fileName = record.n

        let action = {
            action: "removeFile",
            type: "backup",
            data: fileName // 1005-1.gsm 
        }

        $.ajax({
            type: "post",
            url: host,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2798" })}}></span>)
                    this._getLocalFileList()
                    // initUpload()
                }
            }.bind(this)
        })
    }
    _deleteSelectOk = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2798" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: "removeFile",
                type: "backup",
                data: this.state.selectedRowKeys.join(',,')
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getLocalFileList()
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _deleteSelect = (record) => {
        const { formatMessage } = this.props.intl
        const __this = this

        if (this.state.selectedRowKeys.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG129"}, {0: formatMessage({id: "LANG2913"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG818"}, {0: this.state.selectedRowKeys.join('  ')})}} ></span>,
                onOk() {
                    __this._deleteSelectOk(record)
                },
                onCancel() {},
                okText: formatMessage({id: "LANG727"}),
                cancelText: formatMessage({id: "LANG726"})
            })
        }
    }
    _handleTableChange = (pagination, filters, sorter) => {
        const pager = this.state.pagination

        pager.current = pagination.current

        this.setState({
            pagination: pager
        })

        this._getLocalFileList({
            item_num: pagination.pageSize,
            page: pagination.current,
            sidx: sorter.field ? sorter.field : 'd',
            sord: sorter.order === "descend" ? "desc" : "asc",
            ...filters
        })
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys })
    }
    _createOptions = (text, record, index) => {
        const { formatMessage } = this.props.intl

        return <div>
                    <span
                        className="sprite sprite-download"
                        title={ formatMessage({id: "LANG759"}) }
                        onClick={ this._download.bind(this, record) }>
                    </span>
                    <Popconfirm 
                        title={ <span dangerouslySetInnerHTML=
                                {{ __html: formatMessage({ id: "LANG855" }) }}
                            ></span> }
                            okText={ formatMessage({id: "LANG760"}) }
                            cancelText={ formatMessage({id: "LANG726"}) }
                            onConfirm={ this._restore.bind(this, record) }>
                        <span className="sprite sprite-record" title={ formatMessage({id: "LANG784"}) }></span>
                    </Popconfirm>
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
    _handleOk = () => {

    }
    _handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    _readLog = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        $.ajax({
            type: "GET",
            url: api.imageHost + "/html/userdefined/regular_backup_results",
            dataType: "json",
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status !== 404) {
                    message.error(formatMessage({ id: "LANG909"}))
                }
            },
            success: function(data) {
                let arr = data.split("\n").reverse()
                this.setState({
                    log: arr
                })
            }.bind(this)
        })
    }
    _doCleanLog = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        $.ajax({
            type: "GET",
            url: "../cgi?action=reloadLog&regularbackuplog=",
            dataType: "json",
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.success(formatMessage({ id: "LANG3903"}))
                    this._readLog()
                }
            }.bind(this)
        })
    }
    _cleanLog = () => {
        const { formatMessage } = this.props.intl
        Modal.confirm({
                title: 'Confirm',
                content: formatMessage({id: "LANG3902"}),
                okText: formatMessage({id: "LANG727"}),
                cancelText: formatMessage({id: "LANG726"}),
                onOk: this._doCleanLog.bind(this)
            })
    }
    _tranSize = (cellvalue, options, rowObject) => {
        var size = parseFloat(cellvalue),
            rank = 0,
            rankchar = 'Bytes'

        while (size > 1024) {
            size = size / 1024
            rank++
        }

        if (rank === 1) {
            rankchar = "KB"
        } else if (rank === 2) {
            rankchar = "MB"
        } else if (rank === 3) {
            rankchar = "GB"
        }

        return (Math.round(size * Math.pow(10, 2)) / Math.pow(10, 2) + " " + rankchar)
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const formItemPackLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }
        const me = this

        const columns = [{
                key: 'n',
                dataIndex: 'n',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.n - b.n
            }, {
                key: 'd',
                dataIndex: 'd',
                title: formatMessage({id: "LANG203"}),
                sorter: (a, b) => a.n - b.n
            }, {
                key: 's',
                dataIndex: 's',
                title: formatMessage({id: "LANG2257"}),
                sorter: (a, b) => a.n - b.n,
                render: (text, record, index) => {
                    return (<span>{ this._tranSize(text) }</span>)
                }
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => (
                    this._createOptions(text, record, index)
                )
            }]

        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG62"})
                })

        const props = {
            name: 'filename',
            action: host + 'action=uploadfile&type=backup',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                // message.loading(formatMessage({ id: "LANG979" }), 0)
                console.log(info.file.status)
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (me.state.upgradeLoading) {
                    me.setState({upgradeLoading: false})
                }

                if (info.file.status === 'removed') {
                    return
                }

                if (info.file.status === 'done') {
                    // message.success(`${info.file.name} file uploaded successfully`)
                    let data = info.file.response
                    if (data) {
                        let status = data.status,
                            response = data.response

                        // me.props.setSpinLoading({loading: false})

                        if (data.status === 0 && response && response.result === 0) {
                            me._getLocalFileList()
                            me._handleCancel()
                        } else if (data.status === 4) {
                            message.error(formatMessage({id: "LANG915"}))
                        } else if (data.status === -49) {
                            message.error(formatMessage({id: "LANG2146"}))
                        } else if (!_.isEmpty(response)) {
                            message.error(formatMessage({id: UCMGUI.transUploadcode(response.result)}))
                        } else {
                            message.error(formatMessage({id: "LANG916"}))
                        }
                    } else {
                        message.error(formatMessage({id: "LANG916"}))
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`)
                }
            },
            onRemove() {
                message.destroy()
            }
        }

        return (
            <div className="app-content-main">
                <div className="content">
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG635"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._createNew }
                        >
                            { formatMessage({id: "LANG758"}) }
                        </Button>
                        <Button
                            icon="upload"
                            type="primary"
                            size='default'
                            onClick={ this._upload }
                        >
                            { formatMessage({id: "LANG2256"}) }
                        </Button>
                        <Button
                            type="primary"
                            size='default'
                            onClick={ this._regularBackup }
                        >
                            { formatMessage({id: "LANG4048"}) }
                        </Button>
                    </div>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG636"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div className="top-button">
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._deleteSelect }
                        >
                            { formatMessage({id: "LANG3872"}, {0: formatMessage({id: "LANG2913"})}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="n"
                        columns={ columns }
                        pagination={ this.state.pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.fileList }
                        showHeader={ !!this.state.fileList.length }
                        loading={ this.state.loading}
                        onChange={ this._handleTableChange }
                    />
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG4076"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div>
                        <Button type="primary" onClick={ this._cleanLog }>{formatMessage({id: "LANG743"})}</Button>
                    </div>
                    <div>
                        <p > <span >
                           { this.state.log }
                        </span></p>
                    </div>
                    <Modal
                        title={ formatMessage({id: "LANG1607"}) }
                        visible={ this.state.visible }
                        onOk={ this._handleOk }
                        onCancel={ this._handleCancel }
                        okText={ formatMessage({ id: "LANG782" }) }
                        cancelText={ formatMessage({id: "LANG726"}) }
                    >
                        <Form>
                            <div ref="upload" className={ this.state.type === "upload" ? "display-block" : "hidden" }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG2256"}) }>
                                    { getFieldDecorator('upload', {
                                        valuePropName: 'fileList',
                                        normalize: this._normFile
                                    })(
                                        <Upload {...props}>
                                            <Button type="ghost">
                                                <Icon type="upload" /> { formatMessage({id: "LANG1607"}) }
                                            </Button>
                                        </Upload>
                                    ) }
                                </FormItem>
                                <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG850"})}} ></span>
                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}

BackupRestore.propTypes = {
}

export default Form.create()(injectIntl(BackupRestore))
