'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, message, Tabs } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Queue from './queue'
import Recording from './recording'

const TabPane = Tabs.TabPane

class CallQueue extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTabKey: '1'
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    _onTabsChange = (activeTabKey) => {
        this.setState({ activeTabKey })
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG607"})
                })

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG607"}) } isDisplay='hidden' />
                <Tabs activeKey={ this.state.activeTabKey } onChange={ this._onTabsChange }>
                    <TabPane tab={ formatMessage({id: "LANG607"}) } key="1">
                        <Queue />
                    </TabPane>
                    <TabPane tab={ formatMessage({id: "LANG2731"}) } key="2">
                        <Recording />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Form.create()(injectIntl(CallQueue))