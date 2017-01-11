'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Popconfirm, Popover, Table, Tag } from 'antd'

class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    _cleanSettings = () => {
        browserHistory.push('/call-features/conference/cleanSettings/')
    }
    _scheduleSettings = () => {
        browserHistory.push('/call-features/conference/scheduleSettings')
    }
    render() {
        const { formatMessage } = this.props.intl

        return (
            <div className="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button icon="plus" type="primary" size="default" onClick={ this._scheduleSettings }>
                            { formatMessage({id: "LANG3776"}) }
                        </Button>
                        <Button icon="setting" type="primary" size="default" onClick={ this._cleanSettings }>
                            { formatMessage({id: "LANG4277"}) }
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(Schedule)