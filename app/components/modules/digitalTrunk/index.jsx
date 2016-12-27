'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Icon, Button, Table, Select } from 'antd'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import DigitalTrunksList from './digitalTrunksList'
import { browserHistory } from 'react-router'

class DigitalTrunk extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _createDigitalTrunk = () => {
        browserHistory.push('/extension-trunk/digitalTrunk/createDigitalTrunk')
    }
    onChange(activeKey) {
        if (activeKey === "1") {

        } else {            
            
        }
    }
    render() {
        const {formatMessage} = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG3141"})
        })
        
        return (
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="" onClick={this._createDigitalTrunk} >
                            {formatMessage({id: "LANG3142"})}
                        </Button>
                    </div>
                    { <DigitalTrunksList /> }
                </div>
            </div>
        )
    }
}

DigitalTrunk.propTypes = {
}

module.exports = injectIntl(DigitalTrunk)