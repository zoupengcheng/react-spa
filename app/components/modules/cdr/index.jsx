'use strict'

import $ from 'jquery'
import '../../../css/cdr'
import _ from 'underscore'
import api from "../../api/api"
import CDRList from './CDRList'
import CDRSearch from './CDRSearch'
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Modal, message, Form } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'

class CDR extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDisplay: 'display-block-filter',
            isDisplaySearch: 'hidden',
            cdrData: [],
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
                let cdrData = res.response.acctid || []

                this.setState({
                    cdrData: cdrData
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
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
                        message.error(e.statusText)
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
    _showSearch = () => {
        this.setState({
            isDisplay: 'display-block',
            isDisplaySearch: 'display-block'
        })
    }
    _handleCancel = () => {
        const { form } = this.props

        form.resetFields()

        this._getCdrData()
    }
    _handleSubmit = (value) => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        message.loading(formatMessage({ id: "LANG3773" }), 0)

        let cdrData = [],
            dataPost = {},
            cdrSearchData = {
                action: 'listCDRDB',
                sidx: 'start',
                sord: 'desc'
            }

        let all = form.getFieldsValue()

        _.each(all, function(item, key) {
            if (item !== undefined) {
                if (_.isObject(item)) {
                    if (key.match(/fromtime|totime/)) {
                        dataPost[key] = item.format('YYYY-MM-DD HH:mm')
                    } else {
                        if (item.length) {
                            dataPost[key] = item.join()
                        } else {
                            delete dataPost[key]
                        } 
                    }
                } else {
                    dataPost[key] = item
                }
            }
        })

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
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()

                    cdrData = data.response.acctid || []

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
                <Title
                    headerTitle={ formatMessage({id: "LANG7"}) }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    onSearch = { this._showSearch }
                    isDisplay= { this.state.isDisplay} 
                    saveTxt = { formatMessage({id: "LANG1288" }) }
                    cancelTxt = { formatMessage({id: "LANG750" }) } />
                <CDRSearch
                    form = { this.props.form }
                    isDisplaySearch={ this.state.isDisplaySearch }
                    _hideSearch={ this._hideSearch } />
                <CDRList
                    cdrData={ this.state.cdrData }
                    deleteAll={ this._deleteAll }
                    getCdrData = { this._getCdrData }
                    dataSource = { this.state.cdrSearchDownload } />
            </div>
        )
    }
}

export default Form.create()(injectIntl(CDR))