'use strict'

import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { Table, message, Popconfirm } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"

class dataTrunksList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pingcheck: 0,
            rxcheck: 0,
            dataTrunk: []
        }
    }
    componentDidMount() {
        this._listDataTrunk()
    }
    _listDataTrunk = () => {
        this._checkNetHdlcStatus("firstLoad")
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { 
                action: 'listDataTrunk'
            },
            type: 'json',
            async: true,
            success: function(res) {
                let nethdlcSettings = res.response.nethdlc_settings
                this.setState({
                    dataTrunk: nethdlcSettings
                })
            }.bind(this),
            error: function(e) {
                console.log(e.toString())
            }
        })
    }
    _deleteTrunk = (data) => {
        const { formatMessage } = this.props.intl

        let trunkIndex = data.trunk_index
        message.loading(formatMessage({ id: "LANG825" }, {0: "LANG11"}), 0)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteAnalogTrunk",
                "analogtrunk": trunkIndex
            },
            type: 'json',
            async: true,
            success: function(res) {
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    // message.success(formatMessage({ id: "LANG816" }))
                    this._listAnalogTrunk()
                }
            }.bind(this),
            error: function(e) {
                console.log(e.toString())
            }
        })
    }
    _editTrunk = (e) => {
        browserHistory.push('/extension-trunk/dataTrunk/editDataTrunk')
    }
    _reconnect = (e) => {
        // $(this).removeClass("reconnection").addClass("reconnecting").attr({
        //     localetitle: "LANG3890",
        //     title: $P.lang("LANG3890"),
        //     disabled: true
        // });
        // $.ajax({
        //     url: baseServerURl,
        //     type: "POST",
        //     dataType: "json",
        //     async: false,
        //     data: {
        //         "action": "reloadNetHDLC",
        //         "nethdlc": ""
        //     },
        //     success: function(data) {
        //         top.dialog.dialogMessage({
        //             type: 'info',
        //             content: $P.lang("LANG3875")
        //         });
        //         UCMGUI.config.promptNetHDLC = true;
        //         // if (retryFlag) {
        //         //     retryFlag = false;
        //         //     retryTimeout = window.setInterval(function() {
        //         //         checkNetHdlcStatus();
        //         //     }, 6000);
        //         // }
        //     }
        // });
    }
    _checkNetHdlcStatus = (firstLoad) => {
        $.ajax({
            type: "post",
            url: "../cgi",
            data: {
                action: 'getnethdlcStatus',
                "auto-refresh": Math.random()
            },
            async: false,
            success: function(data) {
                let res = data.response

                if (res) {
                    this.setState({
                        pingcheck: Number(res.pingcheck),
                        rxcheck: Number(res.rxcheck) 
                    })
                    if (!firstLoad) {
                        // $("td").eq(0).html(transStatus())
                    }
                }
            }.bind(this)
        })        
    }
    // _transStatus = (text, record, index) => {
    //     var status = "<span class='LANG3152'></span>";
    //     var reconnecting = $(".reconnecting");
    //     var isChangeStatus = false;

    //     if (pingcheck == 9) {
    //         status = "<span class='LANG3152' localetitle='LANG113' title='Unavailable' ></span>";
    //         isChangeStatus = true;
    //     } else if (pingcheck == 8 || rxcheck == 8) {
    //         status = "<span class='LANG2232' localetitle='LANG2396' title='Reachable'></span>";
    //         isChangeStatus = true;
    //     } else if (pingcheck == 1) {
    //         status = "<span class='LANG3152' localetitle='LANG3882' title='Please check the cable' ></span>";
    //         isChangeStatus = true;
    //     } else if (pingcheck == 7) {
    //         status = "<span class='LANG3152' localetitle='LANG3883' title='Please check the remote IP' ></span>";
    //         isChangeStatus = true;
    //     }
    //     if (isChangeStatus) {
    //         reconnecting.removeClass("reconnecting").addClass("reconnection").attr({
    //             localetitle: "LANG3874",
    //             title: $P.lang("LANG3874"),
    //             disabled: false
    //         })
    //         // UCMGUI.config.promptNetHDLC = false;
    //     }
    //     return status;
    // }
    render() {
        const {formatMessage} = this.props.intl

        const columns = [
            {
                title: formatMessage({id: "LANG81"}),
                dataIndex: 'hdlc0__enable',
                render: (text, record, index) => (
                    {/* this._transStatus(text, record, index) */} 
                )
            }, {
                title: formatMessage({id: "LANG2772"}),
                dataIndex: '',
                render: (text, record, index) => (
                    <span></span>
                )
            }, {
                title: formatMessage({id: "LANG237"}),
                dataIndex: 'span',
                render: (text, record, index) => (
                    <span>{(Number(text) - 2)}</span>
                )
            }, {
                title: formatMessage({id: "LANG3558"}),
                dataIndex: 'hdlc0__encapsulation'
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => (
                    <span>
                        <span 
                            className="sprite sprite-edit" 
                            onClick={this._editTrunk.bind(this, record)}
                        ></span>
                        <span onClick={this._reconnect.bind(this)}>Reconnect</span>
                    </span>
                ) 
            }
        ]
        
        const pagination = {
            total: this.state.dataTrunk.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange(current) {
                console.log('Current: ', current)
            }
        }

        return (
            <Table rowSelection={false} columns={columns} dataSource={this.state.dataTrunk} pagination={pagination} />
        )
    }
}

dataTrunksList.defaultProps = {
    
}

export default injectIntl(dataTrunksList)