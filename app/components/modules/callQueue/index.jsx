'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, message, Tabs } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Queue from './queue'
import Recording from './recording'

const TabPane = Tabs.TabPane

class CallQueue extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTabKey: '1',
            extgroupObj: {},
            extgroupList: [],
            callQueueList: [],
            recordingFiles: []
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData(this.state.activeTabKey)
    }
    _getCallQueue = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listQueue',
                sidx: 'extension',
                sord: 'asc'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const response = res.response || {}
                const callQueueList = response.queue || []

                this.setState({
                    callQueueList: callQueueList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _getExtensionGroupList = () => {
        let extgroupObj = {}
        let extgroupList = []

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getExtensionGroupList'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                let response = res.response || {}

                extgroupList = response.extension_groups || []

                extgroupList.map(function(item) {
                    extgroupObj[item.group_id] = item
                })

                this.setState({
                    extgroupObj: extgroupObj,
                    extgroupList: extgroupList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _getInitData = (activeTabKey) => {
        if (activeTabKey === '1') {
            this._getExtensionGroupList()
            this._getCallQueue()
        } else {
            this._getRecordingFiles()
        }
    }
    _getRecordingFiles = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                sidx: 'd',
                sord: 'desc',
                action: 'listFile',
                "type": "queue_recording",
                "filter": '{"list_dir":0, "list_file":1, "file_suffix": ["mp3", "wav"]}'
            },
            type: 'json',
            // async: false,
            success: function(res) {
                const response = res.response || {}
                const recordingFiles = response.queue_recording || []

                this.setState({
                    recordingFiles: recordingFiles
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _onTabsChange = (activeTabKey) => {
        this.setState({ activeTabKey })

        this._getInitData(activeTabKey)
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG607"})
                })

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG607"}) } isDisplay='hidden' />
                <Tabs activeKey={ this.state.activeTabKey } onChange={ this._onTabsChange }>
                    <TabPane tab={ formatMessage({id: "LANG607"}) } key="1">
                        <Queue
                            extgroupObj={ this.state.extgroupObj }
                            extgroupList={ this.state.extgroupList }
                            callQueueList={ this.state.callQueueList }
                            refreshCallQueue={ this._getCallQueue }
                        />
                    </TabPane>
                    <TabPane tab={ formatMessage({id: "LANG2731"}) } key="2">
                        <Recording
                            recordingFiles={ this.state.recordingFiles }
                            refreshRecordingFiles={ this._getRecordingFiles }
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Form.create()(injectIntl(CallQueue))