'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Badge, Button, message, Modal, Popconfirm, Popover, Table, Tag, Form, Input, Select, Tooltip, Upload, Icon } from 'antd'
import Validator from "../../api/validator"
import _ from 'underscore'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const host = api.apiHost
const addZero = UCMGUI.addZero

class VoicePrompt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            extensionList: [],
            fileList: [],
            accountAryObj: {},
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
            initPackName: ''
        }
    }
    componentDidMount() {
        this._getAccountList()
        this._getVoicePrompt()
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
    _recordNew = (record) => {
        this._showModal("recordNew")
    }
    _upload = (record) => {
        this._showModal("upload")
    }
    _record = (record) => {
        this._showModal("record", record)
    }
    _play = (record) => {
        this._showModal("play", record)
    }
    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }
    _renderClass = () => {
        if (this.state.type === "play" || this.state.type === "record") {
            return "display-block"
        } else {
            return "hidden"
        }
    }
    _renderModalTitle = () => {
        const { formatMessage } = this.props.intl

        let type = this.state.type

        if (type === "recordNew") {
            return formatMessage({ id: "LANG775" })
        } else if (type === "play") {
            return formatMessage({ 
                id: "LANG675" 
            }, {
                0: this.state.fileName
            })
        } else if (type === "upload") {
            return formatMessage({ id: "LANG1607" })
        } else {
            return formatMessage({ 
                id: "LANG222" 
            }, {
                0: formatMessage({ id: "LANG238" }),
                1: this.state.fileName
            })
        }
    }
    _renderModalOkText = () => {
        const { formatMessage } = this.props.intl

        let type = this.state.type
        
        if (type === "recordNew" || type === "record") {
            return formatMessage({ id: "LANG778" })
        } else if (type === "play") {
            return formatMessage({ id: "LANG777" })
        } else if (type === "upload") {
            return formatMessage({ id: "LANG782" })
        } else {
            return formatMessage({id: "LANG728"})
        }
    }
    _renderModalCancelText = () => {
        const { formatMessage } = this.props.intl
        
        return formatMessage({id: "LANG726"})
    }
    _checkFilename = (rule, value, callback, errMsg) => {
        const { form } = this.props
        const me = this

        let newvmenuName = form.getFieldValue("newvmenu_name"),
            arr = []

        this.state.fileList.map(function(item, key) {
            arr.push(item.n)
        })

        if (_.find(arr, function (num) {
            return me._removeSuffix(num) === newvmenuName
        })) {
            callback(errMsg)
        }
        callback()
    }
    _removeSuffix(filename) {
        let name = filename.toLocaleLowerCase(),
            file_suffix = [".mp3", ".wav", ".gsm", ".ulaw", ".alaw"]

        for (let i = 0; i < file_suffix.length; i++) {
            let num = name.lastIndexOf(file_suffix[i])

            if (num !== -1 && name.endsWith(file_suffix[i])) {
                filename = filename.substring(0, num)

                return filename
            }
        }
    }
    _playRecordFile = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl

        let fileName = this.state.fileName

        $.ajax({
            type: "post",
            url: host,
            async: false,
            data: {
                "action": "checkFile",
                "type": "ivr",
                "data": fileName
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    let extension = form.getFieldValue("playVmenu_ext")

                    if (this.state.type === 'play') {
                        $.ajax({
                            type: "post",
                            url: "../cgi",
                            async: true,
                            data: {
                                "action": 'playPromptByOrg',
                                "channel": extension,
                                "type": 'ivr',
                                "Variable": this._removeSuffix(fileName)
                            },
                            error: function(jqXHR, textStatus, errorThrown) {},
                            success: function(data) {
                                message.success(formatMessage({id: "LANG873"}))
                            }
                        })
                    } else if (this.state.type === 'record') {
                        this._recordFile(extension)
                    }
                } else {
                        message.error(formatMessage({id: "LANG3868"}))
                    }
                }.bind(this)
            })
    }
    _recordFile = (extension) => { // uses/dials  extension to record into CURRENT_FILE
        const { form } = this.props
        const { formatMessage } = this.props.intl

        let newvmenuName = form.getFieldValue("newvmenu_name"),
            newvmenuFormat = form.getFieldValue("newvmenu_format"),
            newvmenuExt = form.getFieldValue("newvmenu_ext"),
            variable = newvmenuName + newvmenuFormat

        if (this.state.type === 'record') {
            newvmenuExt = extension
            variable = this.state.fileName
        }
        $.ajax({
            type: "post",
            url: "../cgi",
            async: true,
            data: {
                "action": 'recordPromptByOrg',
                "channel": newvmenuExt, // extension 1000
                "type": 'ivr',
                "Variable": variable // 1000-1.gsm
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                message.success(formatMessage({id: "LANG873"}))
                message.destroy()

                message.loading(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG878" })}}></span>, 0)
                setTimeout(() => {
                    message.destroy()
                    message.info(formatMessage({id: "LANG879"}))
                }, 3000)
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
                "type": "ivr",
                "data": filename // 1005-1.gsm
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    window.open("/cgi?action=downloadFile&type=ivr&data=" + encodeURIComponent(filename), '_self')
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
            type: "ivr",
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
                    this.state._getVoicePrompt()
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
                type: "ivr",
                data: this.state.selectedRowKeys.join(',,')
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getVoicePrompt()
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
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG129"}, {0: formatMessage({id: "LANG604"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG818"}, {0: this.state.selectedRowKeys.join('  ')})}} ></span>,
                onOk() {
                    __this._deleteSelectOk(record)
                },
                onCancel() {}
            })
        }
    }
    _deleteAllOk = () => {
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
                type: "ivr",
                data: '*'
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getVoicePrompt()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _deleteAll = () => {
        const { formatMessage } = this.props.intl
        const __this = this

        if (this.state.fileList.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG129"}, {0: formatMessage({id: "LANG28"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            confirm({
                title: (formatMessage({id: "LANG543"})),
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG840"})}} ></span>,
                onOk() {
                    __this._deleteAllOk()
                },
                onCancel() {}
            })
        }
    }
    _downloadAllOk = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const { form } = this.props

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG5391" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2798" })}}></span>

        message.loading(loadingMessage)

        let downloadAllName = form.getFieldValue("pack_name")

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: "packFile",
                type: "ivr",
                data: downloadAllName + '.tar'
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    window.open("/cgi?action=downloadFile&type=ivr&data=" + encodeURIComponent(downloadAllName + '.tar'), '_self')
                    message.destroy()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _downloadAll = () => {
        const { formatMessage } = this.props.intl

        const tmpDate = new Date()
        const y = tmpDate.getFullYear()
        const m = addZero(tmpDate.getMonth() + 1)
        const d = addZero(tmpDate.getDate())
        const h = addZero(tmpDate.getHours())
        const mi = addZero(tmpDate.getMinutes())
        const s = addZero(tmpDate.getSeconds())
        const initPackName = 'prompt_' + y + m + d + '_' + h + mi + s
        this.setState({
            initPackName: initPackName
        })

        if (this.state.fileList.length === 0) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG129"}, {0: formatMessage({id: "LANG28"})})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            this.setState({
                download_visible: true
            })
        }
    }
    _PackCancel = () => {
        this.setState({
            download_visible: false
        })
    }
    _createOptions = (text, record, index) => {
        const { formatMessage } = this.props.intl

        return <div>
                    <Popconfirm 
                        title={ <span dangerouslySetInnerHTML=
                                {{ __html: formatMessage({ id: "LANG876" }) }}
                            ></span> }
                            okText={ formatMessage({id: "LANG727"}) }
                            cancelText={ formatMessage({id: "LANG726"}) }
                            onConfirm={ this._record.bind(this, record) }>
                        <span className="sprite sprite-record" title={ formatMessage({id: "LANG784"}) }></span>
                    </Popconfirm>
                    <span
                        className="sprite sprite-play"
                        title={ formatMessage({id: "LANG777"}) }
                        onClick={ this._play.bind(this, record) }>
                    </span>
                    <span
                        className="sprite sprite-download"
                        title={ formatMessage({id: "LANG759"}) }
                        onClick={ this._download.bind(this, record) }>
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
    _getAccountList = () => {
        const { formatMessage } = this.props.intl
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getAccountList' },
            type: 'json',
            // async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const disabled = formatMessage({id: "LANG273"})
                    let obj = {}
                    let response = res.response || {}
                    let extension = response.extension || []

                    let extensionList = extension.map(function(item) {
                        return {
                            key: item.extension,
                            disabled: (item.out_of_service === 'yes'),
                            text: (item.extension +
                                    (item.fullname ? ' "' + item.fullname + '"' : '') +
                                    (item.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                        }
                    })

                    extension.map(function(item) {
                        obj[item.extension] = item
                    })

                    this.setState({
                        accountAryObj: obj,
                        extensionList: extensionList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getVoicePrompt = (
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
                type: 'ivr',
                filter: '{"list_dir":0,"list_file":1,"file_suffix":["mp3","wav","gsm","ulaw","alaw"]}',
                ...params
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const fileList = response.ivr || []
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
    _handleTableChange = (pagination, filters, sorter) => {
        const pager = this.state.pagination

        pager.current = pagination.current

        this.setState({
            pagination: pager
        })

        this._getVoicePrompt({
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
    _handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    _handleOk = () => {
        if (this.state.type === "recordNew") {
            this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values)
                }
                if (err.hasOwnProperty('newvmenu_name')) {

                } else {
                    this.setState({
                        visible: false
                    })
                    this._recordFile()
                }
            })
        } else {
            this.setState({
                visible: false
            })
            this._playRecordFile()
        }
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
                    1: formatMessage({id: "LANG674"})
                })

        const props = {
            name: 'file',
            action: host + 'action=uploadfile&type=ivr',
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
                    me.props.setSpinLoading({loading: true, tip: formatMessage({id: "LANG979"})})
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
                            me._getVoicePrompt()
                            me._handleCancel()
                        } else if (data.status === 4) {
                            message.error(formatMessage({id: "LANG915"}))
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
                me.props.setSpinLoading({loading: false})
                message.destroy()
            }
        }

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ formatMessage({id: "LANG674"}) }
                    isDisplay='hidden'
                />
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._recordNew }
                        >
                            { formatMessage({id: "LANG775"}) }
                        </Button>
                        <Button
                            icon="upload"
                            type="primary"
                            size='default'
                            onClick={ this._upload }
                        >
                            { formatMessage({id: "LANG776"}) }
                        </Button>
                        <Button
                            icon="download"
                            type="primary"
                            size='default'
                            onClick={ this._downloadAll }
                        >
                            { formatMessage({id: "LANG741"}, {0: formatMessage({id: "LANG28"})}) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._deleteSelect }
                            disabled={ !this.state.selectedRowKeys.length }
                        >
                            { formatMessage({id: "LANG3872"}, {0: formatMessage({id: "LANG28"})}) }
                        </Button>
                        <Button
                            icon="delete"
                            type="primary"
                            size='default'
                            onClick={ this._deleteAll }
                        >
                            { formatMessage({id: "LANG3873"}, {0: formatMessage({id: "LANG28"})}) }
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
                    <Modal
                        title={ formatMessage({id: "LANG741"}, {0: formatMessage({id: "LANG28"})}) }
                        visible={ this.state.download_visible }
                        onOk={ this._downloadAllOk }
                        onCancel={ this._PackCancel }
                        okText={ formatMessage({id: "LANG759"}) }
                        cancelText={ formatMessage({id: "LANG726"}) }
                    >
                        <Form>
                            <FormItem
                                { ...formItemPackLayout }
                                label={ formatMessage({id: "LANG572"}) }>
                                { getFieldDecorator('pack_name', {
                                    rules: [{ 
                                            required: true, 
                                            message: formatMessage({id: "LANG2150"})
                                        }, { 
                                            validator: (data, value, callback) => {
                                                Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                            }
                                        }],
                                    initialValue: this.state.initPackName
                                })(
                                    <Input maxLength="32" />
                                ) }
                            </FormItem>
                        </Form>
                    </Modal>
                    <Modal 
                    title={ this._renderModalTitle() }
                    visible={ this.state.visible }
                    onOk={ this._handleOk } 
                    onCancel={ this._handleCancel }
                    okText={ this._renderModalOkText() }
                    cancelText={ this._renderModalCancelText() }>
                    <Form>
                        <div ref="recordnew_content" className={ this.state.type === "recordNew" ? "display-block" : "hidden" }>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG572"}) }>
                                { getFieldDecorator('newvmenu_name', {
                                    rules: [{ 
                                            required: true, 
                                            message: formatMessage({id: "LANG2150"})
                                        }, { 
                                            validator: (data, value, callback) => {
                                                Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                            }
                                        }, { 
                                            validator: (data, value, callback) => {
                                                let errMsg = formatMessage({
                                                    id: "LANG2146"
                                                })
                                                this._checkFilename(data, value, callback, errMsg)
                                            }
                                        }],
                                    initialValue: ""
                                })(
                                    <Input maxLength="40" />
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG272"}) }>
                                { getFieldDecorator('newvmenu_format', {
                                    rules: [],
                                    initialValue: ".gsm"
                                })(
                                    <Select>
                                        <Option value='.gsm'>GSM</Option>
                                        <Option value='.wav'>WAV</Option>
                                    </Select>
                                ) }
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1608" /> }>
                                            <span>{ formatMessage({id: "LANG85"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}>
                                { getFieldDecorator('newvmenu_ext', {
                                    rules: [],
                                    initialValue: this.state.extensionList[0] ? this.state.extensionList[0].key : ""
                                })(
                                    <Select>
                                        {
                                           this.state.extensionList.map(function(it) {
                                            const key = it.key
                                            const text = it.text
                                            const disabled = it.disabled

                                            return <Option key={ key } value={ key } disabled={ disabled }>
                                                   { text ? text : key }
                                                </Option>
                                            })
                                       }
                                    </Select>
                                ) }
                            </FormItem>
                        </div>
                        <div ref="playFile_content" className={ this._renderClass() }>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG1609"}) }>
                                <div ref="playVmenu_name">{ this.state.fileName }</div>
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: this.state.type === "play" ? "LANG1611" : "LANG1612"}) }>
                                { getFieldDecorator('playVmenu_ext', {
                                    rules: [],
                                    initialValue: this.state.extensionList[0] ? this.state.extensionList[0].key : ""
                                })(
                                    <Select>
                                        {
                                           this.state.extensionList.map(function(it) {
                                            const key = it.key
                                            const text = it.text
                                            const disabled = it.disabled

                                            return <Option key={ key } value={ key } disabled={ disabled }>
                                                   { text ? text : key }
                                                </Option>
                                            })
                                       }
                                    </Select>
                                ) }
                            </FormItem>
                        </div>
                        <div ref="upload" className={ this.state.type === "upload" ? "display-block" : "hidden" }>
                            <FormItem
                                { ...formItemLayout }
                                label={ formatMessage({id: "LANG1607"}) }>
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
                            <span>{formatMessage({id: "LANG672"})}</span>
                            <span>{formatMessage({id: "LANG4227"})}</span>
                            <span>{formatMessage({id: "LANG2640"})}</span>
                        </div>
                    </Form>
                </Modal>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(VoicePrompt))