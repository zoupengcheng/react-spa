'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Icon, Button, Table, Select } from 'antd'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import AnalogTrunksList from './analogTrunksList'
import { browserHistory } from 'react-router'

class AnalogTrunk extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _createAnalogTrunk = () => {
        browserHistory.push('/extension-trunk/analogTrunk/createAnalogTrunk')
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
                        <Button type="primary" icon="" onClick={this._createAnalogTrunk} >
                            {formatMessage({id: "LANG762"})}
                        </Button>
                    </div>
                    { <AnalogTrunksList /> }
                </div>
            </div>
        )
    }
}

AnalogTrunk.propTypes = {
}

module.exports = injectIntl(AnalogTrunk)