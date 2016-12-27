'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'

class Tls extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

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
                {"Tls"}
            </div>
        )
    }
}

Tls.propTypes = {
    
}

export default injectIntl(Tls)