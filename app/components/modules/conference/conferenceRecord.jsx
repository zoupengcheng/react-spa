'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Modal, Popconfirm, Popover, Table, Tag } from 'antd'

const confirm = Modal.confirm

let firstload = true,
    lastLink = '',
    currentLink = ''

class ConferenceRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conferenceRecord: [],
            selectedRowKeys: []
        }
    }
    componentDidMount() {
        this._checkDevice()
    }
    _checkDevice = () => {
        let _this = this

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                'action': 'getInterfaceStatus',
                'auto-refresh': Math.random()
            },
            dataType: 'json',
            async: false,
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    var sdcard_info = data.response['interface-sdcard'],
                        usbdisk_info = data.response['interface-usbdisk'],
                        store_msg = ""

                    if (sdcard_info === "true" || usbdisk_info === "true") {
                        $.ajax({
                            url: api.apiHost,
                            type: 'post',
                            data: {
                                'action': 'getRecordingLink',
                                'auto-refresh': Math.random()
                            },
                            dataType: 'json',
                            async: false,
                            success: function(data) {
                                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                if (bool) {
                                    var link_info = data.response['body']

                                    currentLink = link_info

                                    if (link_info === "local") {
                                        store_msg = "LANG1072"
                                    } else if (link_info === "USB") {
                                        store_msg = "LANG263"
                                    } else if (link_info === "SD") {
                                        store_msg = "LANG262"
                                    }
                                }
                            }.bind(this),
                            error: function(e) {
                                message.error(e.statusText)
                            }
                        })
                    } else {
                        $.ajax({
                            url: api.apiHost,
                            type: 'post',
                            data: {
                                'action': 'getRecordingLink',
                                'auto-refresh': Math.random()
                            },
                            dataType: 'json',
                            async: false,
                            success: function(data) {
                                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                if (bool) {
                                    var link_info = data.response['body']

                                    currentLink = link_info
                                }
                            }.bind(this),
                            error: function(e) {
                                message.error(e.statusText)
                            }
                        })
                    }
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        this._getConferenceRecord()

        setTimeout(_this._checkDevice, 5000)
    }
    _getConferenceRecord = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                action: 'listFile',
                type: 'conference_recording',
                filter: '{"list_dir":0, "list_file":1, "file_suffix": ["mp3", "wav"]}',
                sidx: 'd',
                sord: 'desc'
            },
            dataType: 'json',
            async: false,
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = data.response || {}
                    const conferenceRecord = response.conference_recording || []

                    this.setState({
                        conferenceRecord: conferenceRecord
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        let fileName = record.n
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage, 0)

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                "action": "checkFile",
                "type": "conference_recording",
                "data": fileName
            },
            dataType: 'json',
            async: true,
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    $.ajax({
                        url: api.apiHost,
                        type: 'post',
                        data: {
                            "action": "removeFile",
                            "type": "conference_recording",
                            "data": fileName
                        },
                        dataType: 'json',
                        async: true,
                        success: function(data) {
                            const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                            if (bool) {
                                message.destroy()
                                message.success(successMessage)

                                this._getConferenceRecord()
                                this._clearSelectRows()
                            }
                        }.bind(this),
                        error: function(e) {
                            message.error(e.statusText)
                        }
                    })
                } else {
                    message.error(formatMessage({ id: "LANG3868" }))
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _download = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        let fileName = record.n
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG905" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG961" })}}></span>

        message.loading(loadingMessage, 0)

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                "action": "checkFile",
                "type": "conference_recording",
                "data": fileName
            },
            dataType: 'json',
            async: true,
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    window.open("/cgi?action=downloadFile&type=conference_recording&data=" + fileName, '_self')
                    message.destroy()
                } else {
                    message.error(formatMessage({ id: "LANG3868" }))
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _batchDelete = () => {
        let confirmContent = ''
        let self = this
        let selectedRowKeys = self.state.selectedRowKeys
        const { formatMessage } = this.props.intl

        if (this.state.conferenceRecord.length === 0) {
            Modal.warning({
                title: '',
                content: formatMessage({id: "LANG2240"})
            })

            return
        }

        if (selectedRowKeys.length === 0) {
            Modal.warning({
                title: '',
                content: formatMessage({id: "LANG823"}, {0: formatMessage({ id: "LANG2640" })})
            })

            return
        }

        confirmContent = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG3512" })}}></span>

        confirm({
            title: '',
            content: confirmContent,
            onOk() {
                let loadingMessage = ''
                let successMessage = ''

                loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
                successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

                message.loading(loadingMessage, 0)
                $.ajax({
                    url: api.apiHost,
                    type: 'post',
                    data: {
                        "action": "removeFile",
                        "type": "conference_recording",
                        "data": selectedRowKeys.join(',,')
                    },
                    dataType: 'json',
                    async: true,
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, self.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)

                            self._getConferenceRecord()
                            self._clearSelectRows()
                        }
                    }.bind(this),
                    error: function(e) {
                        message.error(e.statusText)
                    }
                })
            },
            onCancel() {}
        })
    }
    _batchDownload = () => {
        let selectedRowKeys = this.state.selectedRowKeys
        let actionType = 'meetme_pack'
        const { formatMessage } = this.props.intl

        if (this.state.conferenceRecord.length === 0) {
            Modal.warning({
                title: '',
                content: formatMessage({id: "LANG2240"})
            })

            return
        }

        if (selectedRowKeys.length === 0) {
            Modal.warning({
                title: '',
                content: formatMessage({id: "LANG4762"}, {0: formatMessage({ id: "LANG3652" })})
            })

            return
        }

        let loadingMessage = ''

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG5391" })}}></span>

        message.loading(loadingMessage, 0)

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                "action": "packFile",
                "type": actionType,
                "data": selectedRowKeys.join(',')
            },
            dataType: 'json',
            async: true,
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    window.open("/cgi?action=downloadFile&type=" + actionType + "&data=batchMeetmeRecordFiles.tgz", '_self')
                    this._clearSelectRows()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _deleteAll = () => {
        let confirmContent = ''
        let self = this
        const { formatMessage } = this.props.intl

        if (this.state.conferenceRecord.length === 0) {
            Modal.warning({
                title: '',
                content: formatMessage({id: "LANG2240"})
            })

            return
        }

        confirmContent = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG840" })}}></span>

        confirm({
            title: '',
            content: confirmContent,
            onOk() {
                let loadingMessage = ''
                let successMessage = ''

                loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
                successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG871" })}}></span>

                message.loading(loadingMessage, 0)
                $.ajax({
                    url: api.apiHost,
                    type: 'post',
                    data: {
                        "action": "removeFile",
                        "type": "conference_recording",
                        "data": '*'
                    },
                    dataType: 'json',
                    async: true,
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, self.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)

                            self._getConferenceRecord()
                        }
                    }.bind(this),
                    error: function(e) {
                        message.error(e.statusText)
                    }
                })
            },
            onCancel() {}
        })
    }
    _downloadAll = () => {
        let actionType = 'meetme_pack'
        const { formatMessage } = this.props.intl

        if (this.state.conferenceRecord.length === 0) {
            Modal.warning({
                title: '',
                content: formatMessage({id: "LANG2240"})
            })

            return
        }

        let loadingMessage = ''

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG5391" })}}></span>

        message.loading(loadingMessage, 0)

        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                "action": "packFile",
                "type": actionType,
                "data": 'allMeetmeFiles.tgz'
            },
            dataType: 'json',
            async: true,
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    window.open("/cgi?action=downloadFile&type=" + actionType + "&data=allMeetmeFiles.tgz", '_self')
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _createSize = (text) => {
        let size = parseFloat(text),
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

        return Math.round(size * Math.pow(10, 2)) / Math.pow(10, 2) + " " + rankchar
    }
    _createOptions = (record) => {
        const { formatMessage } = this.props.intl

        return (
            <div>
                <Popconfirm
                    title={ formatMessage({id: "LANG841"}) }
                    okText={ formatMessage({id: "LANG727"}) }
                    cancelText={ formatMessage({id: "LANG726"}) }
                    onConfirm={ this._delete.bind(this, record) }
                >
                    <span className="sprite sprite-del"></span>
                </Popconfirm>
                <span className="sprite sprite-download" onClick={ this._download.bind(this, record) }></span>
            </div>
        )
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys, selectedRows })
    }
    _clearSelectRows = () => {
        this.setState({
            selectedRows: [],
            selectedRowKeys: []
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const columns = [{
                key: 'n',
                dataIndex: 'n',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.group_name.length - b.group_name.length
            }, {
                key: 'room',
                dataIndex: 'room',
                title: formatMessage({id: "LANG1045"})
            }, {
                key: 'd',
                dataIndex: 'd',
                title: formatMessage({id: "LANG203"})
            }, {
                key: 's',
                dataIndex: 's',
                title: formatMessage({id: "LANG2257"}),
                render: (text, record, index) => {
                    return this._createSize(text)
                }
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return this._createOptions(record)
                }
            }]
        const pagination = {
                total: this.state.conferenceRecord.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)

                    this._clearSelectRows()
                },
                onChange: (current) => {
                    console.log('Current: ', current)

                    this._clearSelectRows()
                }
            }
        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG2241"})
                })

        return (
            <div className="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button
                            type="primary"
                            size='default'
                            onClick={ this._batchDelete }
                            disabled={ !this.state.selectedRowKeys.length }>
                            { formatMessage({id: "LANG3488"}) }
                        </Button>
                        <Button
                            type="primary"
                            size='default'
                            onClick={ this._deleteAll }>
                            { formatMessage({id: "LANG3439"}) }
                        </Button>
                        <Button
                            type="primary"
                            size='default'
                            onClick={ this._batchDownload }
                            disabled={ !this.state.selectedRowKeys.length }>
                            { formatMessage({id: "LANG4761"}, {
                                0: formatMessage({id: "LANG2640"})
                            }) }
                        </Button>
                        <Button
                            type="primary"
                            size='default'
                            onClick={ this._downloadAll }>
                            { formatMessage({id: "LANG741"}, {
                                0: formatMessage({id: "LANG2640"})
                            }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="n"
                        columns={ columns }
                        pagination={ pagination }
                        rowSelection={ rowSelection }
                        dataSource={ this.state.conferenceRecord }
                        showHeader={ !!this.state.conferenceRecord.length }/>
                </div>
            </div>
        )
    }
}

export default injectIntl(ConferenceRecord)