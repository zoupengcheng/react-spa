'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Modal, message } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import CDRSearch from './CDRSearch'
import CDRList from './CDRList'
import Title from '../../../views/title'
import _ from 'underscore'

class CDR extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDisplay: 'display-block-filter',
            isDisplaySearch: 'hidden',
            cdrData: [],
            cdrSettings: {},
            cdrSearchDownload: {}
        }
    }
    componentDidMount () {
        this._getCdrData()
    }
    _getCdrData = () => {
        $.ajax({
            url: api.apiHost,
            data: {
                action: 'listCDRDB',
                sidx: 'start',
                sord: 'desc'
            },
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function(res) {
                let acctid = res.response.acctid || [],
                    cdrData = []

                for (let i = 0; i < acctid.length; i++) {
                    cdrData.push({
                        key: i,
                        status: acctid[i].disposition,
                        callFrom: acctid[i].clid,
                        callTo: acctid[i].dst,
                        actionType: acctid[i].action_type,
                        startTime: acctid[i].start,
                        talkTime: acctid[i].billsec,
                        password: acctid[i].accountcode,
                        recordingFile: acctid[i].recordfiles
                    })
                }

                this.setState({
                    cdrData: cdrData
                })
            }.bind(this),
            error: function(e) {
                message.error(e.toString())
            }
        })
    }
    _deleteAll = () => {
        const {formatMessage} = this.props.intl,
                self = this

        Modal.confirm({
            title: formatMessage({id: "LANG543" }),
            content: formatMessage({id: "LANG840" }),
            okText: formatMessage({id: "LANG727" }),
            cancelText: formatMessage({id: "LANG726" }),
            onOk() {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    async: false,
                    url: api.apiHost,
                    data: {
                        "action": 'deleteCDRDB',
                        "acctid": '0'
                    },
                    error: function(e) {
                        message.error(e.toString())
                    },
                    success: function(data) {
                        self.setState({
                            cdrData: []
                        })

                        Modal.success({
                            title: formatMessage({id: "LANG543" }),
                            content: formatMessage({id: "LANG819" }),
                            okText: formatMessage({id: "LANG727" }),
                            onOk() {}
                        })
                    }
                })
            },
            onCancel() {}
        })
    }
    _hideSearch = () => {
        this.setState({
            isDisplay: 'display-block-filter',
            isDisplaySearch: 'hidden'
        })
    }
    _handleSearch = () => {
        this.setState({
            isDisplay: 'display-block',
            isDisplaySearch: 'display-block'
        })
    }
    _handleCancel = () => {
        browserHistory.push('/cdr/cdr')
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({ id: "LANG3773" }), 0)

        let cdrData = [],
            acctid = [],
            dataPost = {},
            cdrSearchData = {
                action: 'listCDRDB',
                sidx: 'start',
                sord: 'desc'
            },
            flag = false

        _.each(this.state.cdrSettings, function(item, key) {
            if (_.isObject(item)) {
                if (item.errors === undefined) {
                    if (item.name.match(/fromtime|totime/)) {
                        if (item.value) {
                            dataPost[key] = item.value.format('YYYY-MM-DD HH:mm')
                        } else {
                            delete dataPost[key]
                        }
                    } else if (item.name.match(/src|caller_name|dst/)) {
                        if (item.value) {
                            dataPost[key] = item.value
                        } else {
                            delete dataPost[key]
                        }
                    } else {
                        if (item.value.length) {
                            dataPost[key] = item.value.join()
                        } else {
                            delete dataPost[key]
                        } 
                    }
                } else {
                    flag = true
                    return
                }
            } else {
                dataPost[key] = item
            }
        })

        if (flag) {
            return
        }

        this.setState({
            cdrSearchDownload: dataPost
        })

        _.extend(cdrSearchData, dataPost)

        $.ajax({
            url: api.apiHost,
            data: cdrSearchData,
            type: 'POST',
            dataType: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()

                    acctid = data.response.acctid || []

                    for (let i = 0; i < acctid.length; i++) {
                        cdrData.push({
                            key: i,
                            status: acctid[i].disposition,
                            callFrom: acctid[i].clid,
                            callTo: acctid[i].dst,
                            actionType: acctid[i].action_type,
                            startTime: acctid[i].start,
                            talkTime: acctid[i].billsec,
                            password: acctid[i].accountcode,
                            recordingFile: acctid[i].recordfiles
                        })
                    }

                    this.setState({
                        cdrData: cdrData
                    })
                }
            }.bind(this)
        })
    }
    render() {
        const {formatMessage} = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG7"})})

        return (
            <div className="app-content-main app-content-cdr">
                <Title headerTitle={ formatMessage({id: "LANG7"}) } onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel } onSearch = { this._handleSearch } isDisplay= { this.state.isDisplay }/>
                <CDRSearch dataSource = { this.state.cdrSettings } isDisplaySearch={ this.state.isDisplaySearch }
                    _hideSearch={ this._hideSearch } />
                <CDRList cdrData={ this.state.cdrData } deleteAll={ this._deleteAll }
                    dataSource = { this.state.cdrSearchDownload } />
            </div>
        )
    }
}

export default injectIntl(CDR)