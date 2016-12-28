'use strict'

import React, { Component, PropTypes } from 'react'
import { Button, icon } from 'antd'
import $ from 'jquery'

class Title extends Component {
    _triggerCancel = () => {
        this.props.onCancel()
    }
    _triggerSave = () => {
        this.props.onSubmit()
    }
    _triggerSearch =(e) => {
        this.props.onSearch()
    }
    render() {
        return (
            <div className="app-content-title clearfix">
                <span className="content-name">{ this.props.headerTitle }</span>
                <div className={ "content-operation " + this.props.isDisplay }>
                    <Button type="primary" onClick={ this._triggerSave } className="save">Save</Button>
                    <Button type="ghost" onClick={ this._triggerCancel } className="cancel">Cancel</Button>
                    <Button type="primary" onClick={ this._triggerSearch } className="filter " icon="filter">Filter</Button>
                </div>
            </div>
        )
    }
}

export default Title