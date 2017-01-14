'use strict'

import React from 'react'
import { browserHistory } from 'react-router'
import { Icon, Menu, Dropdown, Select } from 'antd'
import SubscribeEvent from '../components/api/subscribeEvent'

const Option = Select.Option

let Header = React.createClass({
    propsTypes: {
        userData: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            countryArr: JSON.parse(localStorage.getItem('countryArr'))
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
    handleLogin: function(e) {
        e && e.preventDefault()
        if (window.socket) {
            window.socket.send(SubscribeEvent.logout)
        }
        browserHistory.push('/login')
    },
    handleLogout: function(e) {
        e.preventDefault()

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
    render: function () {
        let username = localStorage.getItem('username')

        const menu = (
            <Menu>
                <Menu.Item key="1"><a className="u-ml-10" href="#" >重 启</a></Menu.Item>
                <Menu.Item key="2" onClick={ this.handleLogout }><a className="u-ml-10" href="#" onClick={ this.handleLogout }>注 销</a></Menu.Item>             
            </Menu>
        )
     
        return (
            <header className="app-header clearfix">
                <div className="header-inner">
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
                        <Select defaultValue={ localStorage.getItem('locale') || "en-US" } style={{ width: 100 }} onChange={ this.handleChange }>
                            {
                                this.state.countryArr.map(function(it) {
                                const lang = it.languages
                                return <Option key={ lang } value={ lang }>
                                       { it.localName }
                                    </Option>
                            })}
                        </Select>
                    </nav>
                    {/* <div className="nav-phone-icon"></div> */}
                </div>
            </header>
        )
    }
})

module.exports = Header