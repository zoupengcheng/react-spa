'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Modal, message } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import OperationLogSearch from './operationLogSearch'
import OperationLogList from './operationLogList'
import Title from '../../../views/title'
import _ from 'underscore'

class OperationLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDisplay: 'display-block-filter',
            isDisplaySearch: 'hidden',
            operationData: [],
            options2Lang: {},
            searchAction: {}
        }
    }
    componentDidMount () {
        this._getOperationLogData()
        this._getUserLists()
        this._getOptions2Lang()
    }
    _getOperationLogData = () => {
        $.ajax({
            url: api.apiHost,
            data: {
                "action": 'listOperationLog',
                "options": "date,user_name,ipaddress,result,action,operation,detailed_log"
            },
            type: 'POST',
            dataType: 'json',
            async: true,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(res) {
                let operation = res.response.operation || []

                this.setState({
                    operationData: operation
                })
            }.bind(this)
        })
    }
    _getUserLists = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            type: "post",
            url: "../cgi",
            async: true,
            data: {
                "action": "listUser",
                "options": "user_name"
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                var bool = UCMGUI.errorHandler(data)

                if (bool) {
                    let userLists = data.response.user_id,
                        arr = []

                    arr.push({
                        val: "",
                        text: formatMessage({id: "LANG3921"})
                    })

                    for (var i = 0; i < userLists.length; i++) {
                        var obj = {}

                        obj["val"] = userLists[i].user_name

                        arr.push(obj)
                    }
                    this.setState({
                        userLists: arr
                    })
                }
            }.bind(this)
        })        
    }
    _getOptions2Lang = () => {
        $.ajax({
            type: "GET",
            url: "../locale/locale.params.json",
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {},
            success: function(data) {
                this.setState({
                    options2Lang: JSON.parse(data)
                })
            }.bind(this)
        })        
    }
    _deleteAll = () => {
        const {formatMessage} = this.props.intl,
            self = this

        let operActionData = {
            "action": "deleteOperationLog",
            "acctid": '0',
            "start_date": "",
            "end_date": "",
            "ipaddress": "",
            "user_name": ""
        }

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
                        "action": 'deleteOperationLog',
                        "acctid": '0'
                    },
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        self.setState({
                            operationData: []
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
    _deleteSearch = () => {
        const {formatMessage} = this.props.intl,
            self = this

        let dataPost = {},
            operActionData = {
                "action": "deleteOperationLog"
            },
            flag = false

        _.each(this.state.searchAction, function(item, key) {
            if (_.isObject(item)) {
                if (item.errors === undefined) {
                    if (item.name.match(/start_date|end_date/)) {
                        if (item.value) {
                            dataPost[key] = item.value.format('YYYY-MM-DD HH:mm')
                        } else {
                            delete dataPost[key]
                        }
                    } else if (item.name.match(/ipaddress|user_name/)) {
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

        _.extend(operActionData, dataPost)

        Modal.confirm({
            title: formatMessage({id: "LANG543" }),
            content: formatMessage({id: "LANG4072" }),
            okText: formatMessage({id: "LANG727" }),
            cancelText: formatMessage({id: "LANG726" }),
            onOk() {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    async: false,
                    url: api.apiHost,
                    data: operActionData,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        self.setState({
                            operationData: []
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
        browserHistory.push('/maintenance/operationLog')
    }
    _handleSubmit = () => {
        const { formatMessage } = this.props.intl

        message.loading(formatMessage({ id: "LANG3773" }), 0)

        let operationData = [],
            acctid = [],
            dataPost = {},
            operationSearchData = {
                "action": "listOperationLog",
                "options": "date,user_name,ipaddress,result,action,operation,detailed_log"
            },
            flag = false

        _.each(this.state.searchAction, function(item, key) {
            if (_.isObject(item)) {
                if (item.errors === undefined) {
                    if (item.name.match(/start_date|end_date/)) {
                        if (item.value) {
                            dataPost[key] = item.value.format('YYYY-MM-DD HH:mm')
                        } else {
                            delete dataPost[key]
                        }
                    } else if (item.name.match(/ipaddress|user_name/)) {
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

        _.extend(operationSearchData, dataPost)

        $.ajax({
            url: api.apiHost,
            data: operationSearchData,
            type: 'POST',
            dataType: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()

                    this.setState({
                        operationData: data.response.operation
                    })
                }
            }.bind(this)
        })
    }
    render() {
        const {formatMessage} = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG7"})
        })

        return (
            <div className="app-content-main app-content-cdr">
                <Title 
                    headerTitle={ formatMessage({id: "LANG3908"}) } 
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel } 
                    onSearch = { this._handleSearch }
                    saveTxt= { formatMessage({id: "LANG803"}) }
                    cancelTxt= { formatMessage({id: "LANG750"}) } 
                    isDisplay= { this.state.isDisplay }
                />
                <OperationLogSearch
                    userLists = { this.state.userLists} 
                    dataSource = { this.state.searchAction } 
                    isDisplaySearch={ this.state.isDisplaySearch }
                    _hideSearch={ this._hideSearch } />
                <OperationLogList
                    options2Lang={ this.state.options2Lang } 
                    operationData={ this.state.operationData } 
                    deleteAll={ this._deleteAll }
                    deleteSearch={ this._deleteSearch}
                />
            </div>
        )
    }
}

export default injectIntl(OperationLog)