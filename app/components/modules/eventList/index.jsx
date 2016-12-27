'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Icon, Button, Table, Select } from 'antd'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import EventLists from './eventLists'
import { browserHistory } from 'react-router'

class EventList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _createEventList = () => {
        browserHistory.push('/extension-trunk/eventList/createEventList')
    }
    onChange(activeKey) {
        if (activeKey === "1") {

        } else {            
            
        }
    }
    render() {
        const {formatMessage} = this.props.intl

        return (
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="" onClick={this._createEventList} >
                            {formatMessage({id: "LANG2475"})}
                        </Button>
                    </div>
                    { <EventLists /> }
                </div>
            </div>
        )
    }
}

EventList.propTypes = {
}

module.exports = injectIntl(EventList)