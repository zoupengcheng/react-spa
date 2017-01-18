'use strict'

import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Popconfirm, Popover, Table, Tag } from 'antd'

class GoogleSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {

    }
    _calendarSettings = () => {
        browserHistory.push('/call-features/conference/calendarSettings')
    }
    render() {
        const { formatMessage } = this.props.intl

        return (
            <div className="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button icon="plus" type="primary" size="default" onClick={ this._calendarSettings }>
                            { formatMessage({id: "LANG3516"}) }
                        </Button>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default injectIntl(GoogleSettings)