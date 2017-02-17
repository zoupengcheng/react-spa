'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Table, Button, message, Modal } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'

let detailNum = 0,
    detailObj = {}

class OperLogUsrList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    _handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    _getOptStr = (obj) => {
        const { formatMessage } = this.props.intl

        let optStr = "",
            data = obj.data,
            options2Lang = obj.options2Lang,
            locationObj = obj.locationObj,
            action = obj.action,
            count = obj.count,
            maxLen = obj.maxLen

        for (let prop in data) {
            if (data.hasOwnProperty(prop) && prop !== "action" && prop !== "_location" && prop !== "_") {
                let param = prop,
                    options2LangAction = options2Lang[action]

                if (count && maxLen) {
                    if (count > maxLen) {
                        break
                    }

                    count++
                }

                if (locationObj && locationObj[prop]) {
                    param = "<span>" + formatMessage({id: locationObj[prop]}) + "</span>"
                }

                if (options2LangAction && options2LangAction[prop]) {
                    param = "<span>" + formatMessage({id: options2LangAction[prop]}) + "</span>"
                }

                optStr += param + ": " + (data[prop] ? data[prop] : "") + ";  "
            }
        }

        return {
            data: optStr,
            count: count
        }
    }
    _jumpPage = () => {

    }
    _transResults = (cellvalue, options, rowObject) => {
        const {formatMessage} = this.props.intl

        var erroeCodes = UCMGUI.initConfig.errorCodes,
            val = erroeCodes[cellvalue]

        if (!val) {
            val = "LANG3910" // Operate Successfully 
        }

        return <span>{ formatMessage({id: val}) }</span>       
    }
    _transAction = (cellvalue, options, rowObject) => {
        const {formatMessage} = this.props.intl

        let _location = rowObject.operation._location,
            options2Lang = this.props.options2Lang,
            locationObj = options2Lang[_location],
            page = ""

        if (options2Lang && locationObj) {
            var lang = locationObj["_LOCATION"]

            if (lang && _location !== "operationLog") {
                page = <span className='jumpPage' onClick={ this._jumpPage(_location) } title={ formatMessage({id: 'LANG3984'}) } jumpPage={ _location }>{ formatMessage({id: lang}) + ":" } </span>
            } else {
                page = <span>{ formatMessage({id: lang}) + ":" }</span>
            }
        }

        if (locationObj && locationObj[cellvalue]) {
            var sVal = locationObj[cellvalue]

            if (sVal.match(/\sLANG\d+$/)) {
                var aTranLang = sVal.split(' ')

                cellvalue = <span>{ formatMessage({id: aTranLang[0]}, {0: formatMessage({id: aTranLang[1]})}) }</span>
            } else {
                cellvalue = <span>{ formatMessage({id: locationObj[cellvalue]}) }</span>
            }
        } else if (options2Lang && options2Lang[cellvalue]) {
            var _LOCATION = options2Lang[cellvalue]["_LOCATION"]

            if (_LOCATION) {
                cellvalue = <span>{ formatMessage({id: _LOCATION}) }</span>
            } else {
                cellvalue = <span>{ formatMessage({id: options2Lang[cellvalue]}) }</span>
            }
        }

        return <div>
                { page } 
                { cellvalue }
            </div>
    }
    _transOperation = (cellvalue, options, rowObject) => {
        const { formatMessage } = this.props.intl

        let optStr = "",
            _location = rowObject.operation._location,
            action = rowObject.action,
            options2Lang = this.props.options2Lang,
            locationObj = options2Lang[_location],
            detailedLog = rowObject.detailed_log

        if (detailedLog) {
            if (_.size(cellvalue) > 1) {
                let obj = this._getOptStr({
                    data: cellvalue,
                    options2Lang: options2Lang,
                    locationObj: locationObj,
                    action: action
                })

                optStr += obj.data
            } else {
                let count = 0,
                    maxLen = 3,
                    obj = this._getOptStr({
                        data: cellvalue,
                        options2Lang: options2Lang,
                        locationObj: locationObj,
                        action: action,
                        count: count,
                        maxLen: maxLen
                    })

                optStr += obj.data
            }

            let id = "detail" + detailNum

            optStr += "<button type='button' id='" + id + "' class='options detail' title='" + formatMessage({id: 'LANG3923'}) + "'></button>"

            rowObject.detailed_log["action"] = action

            detailObj[id] = rowObject.detailed_log

            detailNum++
        } else {
            let count = 0,
                maxLen = 3,
                obj = this._getOptStr({
                    data: cellvalue,
                    options2Lang: options2Lang,
                    locationObj: locationObj,
                    action: action,
                    count: count,
                    maxLen: maxLen
                })

            optStr += obj.data
            count = obj.count

            if (count > maxLen) {
                let id = "detail" + detailNum

                optStr += "<button type='button' id='" + id + "' class='options detail' title='" + formatMessage({id: 'LANG3923'}) + "'></button>"

                // rowObject.detailed_log["action"] = action;
                detailObj[id] = cellvalue

                detailNum++
            } else {
                if (action === "updateCountryCodes") {
                    optStr = '<div>' + optStr.substr(0, 40) + '<span class="more">...</span><span class="more-content">' + optStr.substr(40) + '</span>' + '</div>'
                }
            }
        }

        if (/;\s+$/.test(optStr)) {
            optStr = optStr.replace(/;\s+$/, ".")
        }

        return <div dangerouslySetInnerHTML={{__html: optStr}} ></div>
    }
    render() {
        const {formatMessage} = this.props.intl

        const columns = [
            {
                title: formatMessage({id: "LANG203"}),
                dataIndex: 'date'
            }, {
                title: formatMessage({id: "LANG2809"}),
                dataIndex: 'user_name'
            }, {
                title: formatMessage({id: "LANG155"}),
                dataIndex: 'ipaddress'
            }, {
                title: formatMessage({id: "LANG3909"}),
                dataIndex: 'result',
                render: (text, record, index) => (
                    this._transResults(text, index, record)
                )
            }, {
                title: formatMessage({id: "LANG3922"}),
                dataIndex: 'action',
                sorter: (a, b) => a > b,
                render: (text, record, index) => (
                    this._transAction(text, index, record)
                )
            }, {
                title: formatMessage({id: "LANG3927"}),
                dataIndex: 'operation',
                render: (text, record, index) => (
                    this._transOperation(text, index, record)
                )
            }
        ]

        const pagination = {
            total: this.props.operationData.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange: (current) => {
                console.log('Current: ', current)
            }
        }

        return (
            <div className="content">
                <div className="top-button">
                    <Button type="primary" icon="delete" size='default' onClick={ this.props.deleteSearch }>
                        { formatMessage({id: "LANG4071" }, { 0: formatMessage({id: "LANG4146"})}) }
                    </Button>
                    <Button type="primary" icon="delete" size='default' onClick={ this.props.deleteAll }>
                        { formatMessage({id: "LANG3911"}) }
                    </Button>
                </div>
                <Table
                    bordered
                    columns={ columns }
                    dataSource={ this.props.operationData }
                    pagination={ pagination }
                    showHeader={ !!this.props.operationData.length } 
                />
            </div>
        )
    }
}

export default injectIntl(OperLogUsrList)