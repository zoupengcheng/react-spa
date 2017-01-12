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

class ConferenceRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conferenceRecord: []
        }
    }
    componentDidMount() {
        this._getConferenceRecord()
    }
    _getConferenceRecord = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFile',
                type: 'conference_recording',
                filter: '{"list_dir":0, "list_file":1, "file_suffix": ["mp3", "wav"]}',
                sidx: 'd',
                sord: 'desc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
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

    }
    _download = (record) => {

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
                },
                onChange: (current) => {
                    console.log('Current: ', current)
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
                            onClick={ this._add }>
                            { formatMessage({id: "LANG3488"}) }
                        </Button>
                        <Button
                            type="primary"
                            size='default'
                            onClick={ this._add }>
                            { formatMessage({id: "LANG3439"}) }
                        </Button>
                        <Button
                            type="primary"
                            size='default'
                            onClick={ this._add }>
                            { formatMessage({id: "LANG4761"}, {
                                0: formatMessage({id: "LANG2640"})
                            }) }
                        </Button>
                        <Button
                            type="primary"
                            size='default'
                            onClick={ this._add }>
                            { formatMessage({id: "LANG741"}, {
                                0: formatMessage({id: "LANG2640"})
                            }) }
                        </Button>
                    </div>
                    <Table
                        rowKey="d"
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