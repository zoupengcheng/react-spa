'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import LdapServerConf from './ldapServerConf'
import LdapPhonebook from './ldapPhonebook'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

class LdapServer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstLoad: true,
            isDisplay: true
        }
        this._handleSubmit = (e) => {
            const { formatMessage } = this.props.intl
            const form = this.props.form
        }
        this._handleCancel = (e) => {
            const { formatMessage } = this.props.intl
            const form = this.props.form
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _onChange = (activeKey) => {
        if (activeKey === "1") {
            this.setState({
                isDisplay: true,
                firstLoad: false
            })
        } else {
            this.setState({
                isDisplay: false,
                firstLoad: true
            })
        }
    }
    render() {
        const {formatMessage} = this.props.intl
        const state = this.state
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG56"})
        })

        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG56"}) } 
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel } 
                    isDisplay={ state.isDisplay ? "display-block" : "hidden" } 
                />
                <Tabs defaultActiveKey="1" onChange={ this._onChange }>
                    <TabPane tab={formatMessage({id: "LANG712"})} key="1">
                        { <LdapServerConf /> }
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG714"})} key="2">
                        { <LdapPhonebook firstLoad={ state.firstLoad } /> }
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

LdapServer.propTypes = {
}

export default injectIntl(LdapServer)