'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Icon, Button, Table, Select } from 'antd'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import VoipTrunksList from './voipTrunksList'
import { browserHistory } from 'react-router'

class VoipTrunk extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _createSipVoipTrunk = () => {
        browserHistory.push('/extension-trunk/voipTrunk/createVoipTrunk')
    }
    _createIaxVoipTrunk = () => {
        browserHistory.push('/extension-trunk/voipTrunk/createVoipTrunk')
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
                        <Button type="primary" icon="" onClick={this._createSipVoipTrunk} >
                            {formatMessage({id: "LANG2908"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG2909"})}
                        </Button>
                    </div>
                    { <VoipTrunksList /> }
                </div>
            </div>
        )
    }
}

VoipTrunk.propTypes = {
}

module.exports = injectIntl(VoipTrunk)