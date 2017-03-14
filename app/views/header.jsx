'use strict'

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../actions/'
import { browserHistory } from 'react-router'
import { Icon, Menu, Dropdown, Select, Button, message, Spin, Modal } from 'antd'
import { injectIntl } from 'react-intl'
import SubscribeEvent from '../components/api/subscribeEvent'
import api from "../components/api/api"
import $ from 'jquery'
import UCMGUI from "../components/api/ucmgui"
import cookie from 'react-cookie'

const Option = Select.Option

let Header = React.createClass({
    propsTypes: {
        userData: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            countryArr: JSON.parse(localStorage.getItem('countryArr')),
            visible: true
        }
    },
    componentDidMount: function() {
        // Checked is logined
        // this.props.actions.checkLogin();
    },
    componentWillReceiveProps(nextProps) {
        // 如果没有登录则跳登录
    },
    handleChange(val) {
        localStorage.setItem('locale', val)

        window.location.reload()
    },
    // 跳转登录页
    handleLogout: function(e) {
        message.destroy()
        e.preventDefault()
        cookie.remove('adminId')
        cookie.remove('username')
        localStorage.removeItem('adminId')
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        // localStorage.clear()
        if (window.socket) {
            window.socket.send(SubscribeEvent.logout)
        }
        browserHistory.push('/login')
    },
    triggerParentCollapseChange() {
        this.props.onChangeCollpase()
    },
    _applyChanges() {
        const { formatMessage } = this.props.intl
        this.props.setSpinLoading({loading: true, tip: formatMessage({id: "LANG806"})})

        $.ajax({
            url: api.apiHost + "action=applyChanges&settings=",
            type: "GET",
            success: function(data) {
                let status = data.status,
                    settings = data.response.hasOwnProperty('settings') ? data.response.settings : ''

                this.props.setSpinLoading({loading: false})
                if (status === 0 && settings === '0') {
                    // this.setState({
                    //     visible: false
                    // })

                    // cookie.remove("needApplyChange");
                    if (data.response.need_reboot && data.response.need_reboot === '1') {
                        Modal.confirm({
                            title: formatMessage({id: "LANG833"}),
                            content: '',
                            okText: 'OK',
                            cancelText: 'Cancel',
                            onOk: () => {
                                UCMGUI.loginFunction.confirmReboot() 
                            },
                            onCancel: () => {
                            }
                        })
                    } else {
                        message.info(formatMessage({id: "LANG951"}))
                    }
                } else if (status === -9 && settings.contains('-1')) {
                    message.error(formatMessage({id: "LANG2805"}))
                } else if (status === -9 && settings.contains('486')) {
                    message.info(formatMessage({id: "LANG2803"}))
                } else if (status === -9 && settings.contains('485')) {
                    message.info(formatMessage({id: "LANG2804"}))
                } else if (status === -69) {
                    message.error(formatMessage({id: "LANG4760"}))
                } else {
                    UCMGUI.errorHandler(data, null, formatMessage)
                }
            }.bind(this)
        })
    },
    render: function () {
        let username = localStorage.getItem('username')
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const menu = (
            <Menu>
                <Menu.Item key="1"><a className="u-ml-10" href="#" >重 启</a></Menu.Item>
                <Menu.Item key="2" onClick={ this.handleLogout }><a className="u-ml-10" href="#" onClick={ this.handleLogout }>注 销</a></Menu.Item>             
            </Menu>
        )
     
        return (
            <header className="app-header clearfix">
                <div className="header-inner">
                    <div className="app-logo">
                        <a className="logo" href="http://www.grandstream.com">
                            <i className="sprite sprite-logo"></i>
                            {/* <img alt="logo" src={ api.imageHost + "/images/logo-grandstream.png" } /> */}
                            <span className="logo-text">{ model_info.model_name }</span>
                        </a>
                    </div>
                    {/* <a className="logo" href="http://www.grandstream.com/">
                        <span className="logo-text">Grandstream</span>
                    </a>
                    <div className="search"></div> 
                    <nav className="left-nav">
                        <div className="app-sidebar-toggle" onClick={ this.triggerParentCollapseChange }>
                            <Icon type="bars" />
                        </div>
                    </nav> */}
                    <nav className="right-nav">
                        <Dropdown overlay={ menu }>
                            <a className="ant-dropdown-link" href="#">
                                {<span><Icon type="user" />{ username }</span>}<Icon type="down" />
                            </a>
                        </Dropdown>
                    </nav>
                    <nav className="right-nav">
                        <Select defaultValue={ localStorage.getItem('locale') || "en-US" } style={{ width: 100 }} size="small" onChange={ this.handleChange }>
                            {
                                this.state.countryArr.map(function(it) {
                                const lang = it.languages
                                return <Option key={ lang } value={ lang }>
                                       { it.localName }
                                    </Option>
                            })}
                        </Select>
                    </nav>
                    <nav className="right-nav">
                        <Button type="primary" size="small" onClick={this._applyChanges} className={this.state.visible ? "display-inline" : "hidden"}>{formatMessage({id: "LANG260"})}</Button>
                    </nav>
                    {/* <div className="nav-phone-icon"></div> */}
                </div>
            </header>
        )
    }
})

const mapStateToProps = (state) => ({
    spinLoading: state.spinLoading
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(injectIntl(Header))