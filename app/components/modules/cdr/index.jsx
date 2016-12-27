'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Modal, message } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import CDRSearch from './CDRSearch'
import CDRList from './CDRList'
import Title from '../../../views/title'

class CDR extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cdrData: []
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
                item_num: 10000,
                page: 1,
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
    _handleCancel = () => {
        browserHistory.push('/cdr/cdr')
    }
    _handleSubmit = () => {
        var cdrData = [],
            acctid = [],
            dataPost = {
                action: 'listCDRDB',
                item_num: 10000,
                page: 1,
                sidx: 'start',
                sord: 'desc'
            },
            fromtime = $('#startfrom').val(),
            totime = $('#startto').val(),
            src = $('#CallerNumber').val(),
            caller_name = $('#CallerName').val(),
            dst = $('#CalledNumber').val(),
            srcTrunks = $('#src_trunk_name'),
            dstTrunks = $('#dst_trunk_name'),
            disposition = $('#disposition'),
            actionType = $('#action_type'),
            accountCode = $('#accountcode'),
            userfield = $('#userfield'),
            srcTrunksNameList = [],
            dstTrunksNameList = [],
            dispositionNameList = [],
            actionTypeNameList = [],
            accountCodeNameList = [],
            userfieldNameList = []

        if (fromtime) {
            dataPost.fromtime = fromtime
        }
        if (totime) {
            dataPost.totime = totime
        }
        if (src) {
            dataPost.src = src
        }
        if (caller_name) {
            dataPost.caller_name = caller_name
        }
        if (dst) {
            dataPost.dst = dst
        }

        // Srouce Trunks
        if (srcTrunks.find('option:selected').length > 0) {
            srcTrunks.find('option:selected').each(function() {
                srcTrunksNameList.push(this.title)
            })

            dataPost.src_trunk_name = srcTrunksNameList.join()
        }

        // Destination Trunks
        if (dstTrunks.find('option:selected').length > 0) {
            dstTrunks.find('option:selected').each(function() {
                dstTrunksNameList.push(this.title)
            })

            dataPost.dst_trunk_name = dstTrunksNameList.join()
        }

        // Action Types
        if (actionType.find('option:selected').length > 0) {
            actionType.find('option:selected').each(function() {
                actionTypeNameList.push(this.value)
            })

            dataPost.action_type = actionTypeNameList.join()
        }

        // Account Codes
        if (accountCode.find('option:selected').length > 0) {
            accountCode.find('option:selected').each(function() {
                accountCodeNameList.push(this.value)
            })

            dataPost.accountcode = accountCodeNameList.join()
        }

        // Status
        disposition.find('option:selected').each(function() {
            dispositionNameList.push(this.value)
        })

        dataPost.disposition = dispositionNameList.join()

        // Call Types
        userfield.find('option:selected').each(function() {
            userfieldNameList.push(this.value)
        })

        dataPost.userfield = userfieldNameList.join()

        $.ajax({
            url: api.apiHost,
            data: dataPost,
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function(res) {
                acctid = res.response.acctid || []

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
    render() {
        const {formatMessage} = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG7"})})

        return (
            <div className="app-content-main app-content-cdr">
                <Title headerTitle={ formatMessage({id: "LANG7"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block-filter' />
                <CDRSearch />
                <CDRList cdrData={ this.state.cdrData } deleteAll={ this._deleteAll } />
            </div>
        )
    }
}

export default injectIntl(CDR)