'use strict'

import $ from 'jquery'
import React from 'react'
import { Icon, Menu } from 'antd'
import { injectIntl } from 'react-intl'
import { browserHistory } from 'react-router'
import menusData from './../locales/menusData.json'
import api from "../components/api/api"

const SubMenu = Menu.SubMenu

let SideBar = React.createClass({
    getInitialState() {
        const pathname = location.pathname.split('/')
        const state = {
            current: pathname[2] ? pathname[2] : 'dashboard',
            openKeys: [(pathname[1] ? pathname[1] : 'system-status')]
        }

        return state
    },
    componentDidMount() {
        setTimeout(function() {
            const minHeight = $('.app-sidebar .ant-menu').height() + 20

            $('#app-root .app-main').css({'min-height': minHeight + 'px'})
        }, 300)
    },
    componentDidUpdate() {
        setTimeout(function() {
            const minHeight = $('.app-sidebar .ant-menu').height() + 20

            $('#app-root .app-main').css({'min-height': minHeight + 'px'})
        }, 300)
    },
    handleClick(item) {
        const keyPath = item.keyPath.reverse()

        browserHistory.push('/' + keyPath.join('/'))

        this.setState({
            current: item.key
        })
    },
    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => !(this.state.openKeys.indexOf(key) > -1))

        this.setState({
            openKeys: [latestOpenKey]
        })
    },
    render() {
      const { formatMessage } = this.props.intl
      const model_info = JSON.parse(localStorage.getItem('model_info'))

      return (
          <aside className="app-sidebar">
              <div className="app-logo">
                  <a className="logo" href="http://www.grandstream.com">
                      <img alt="logo" src={ api.imageHost + "/images/logo-grandstream.png" } />
                      <span className="logo-text">{ model_info.model_name }</span>
                  </a>
              </div>
              {menusData.map(function(menu, index) {
                  return (
                      <div key={ 'menu-' + index }>
                          <Menu theme="dark"
                                mode="inline"
                                openKeys={ this.state.openKeys }
                                selectedKeys={ [this.state.current] }
                                onClick={ this.handleClick }
                                onOpenChange={ this.onOpenChange }
                          >
                              {menu.subMenus.map(function(subMenu, subIndex) {
                                  return (
                                      <SubMenu key={ subMenu.name }
                                               title={ <span><Icon type={ subMenu.icon } />{ formatMessage({ id: subMenu.title }) }</span> }
                                      >
                                          {subMenu.items.map(function(item) {
                                              return <Menu.Item key= { item.path }>{ formatMessage({ id: item.name }) }</Menu.Item>
                                          })}
                                      </SubMenu>
                                  )
                              })}
                          </Menu>
                      </div>
                  )
              }.bind(this))}
          </aside>
      )
    }
})

module.exports = injectIntl(SideBar)
