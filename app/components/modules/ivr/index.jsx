'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Icon, Button, Table, Select } from 'antd'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import IvrList from './ivrList'
import { browserHistory } from 'react-router'

class Ivr extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _createIvr = () => {
        browserHistory.push('/extension-trunk/ivrTrunk/createIvr')
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
            1: formatMessage({id: "LANG19"})
        })
        
        return (
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="" onClick={this._createIvr} >
                            {formatMessage({id: "LANG766"})}
                        </Button>
                    </div>
                    { <IvrList /> }
                </div>
            </div>
        )
    }
}

Ivr.propTypes = {
}

module.exports = injectIntl(Ivr)