'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { Form, Button, Row, Col, Checkbox, InputNumber, message, Popover, Select, Tabs } from 'antd'
import {injectIntl} from 'react-intl'
import * as Actions from './actions/'
const TabPane = Tabs.TabPane
const FormItem = Form.Item

const CustomizedForm = injectIntl(Form.create({
    onFieldsChange(props, changedFields) {
        // this.props.dataSource["form"] = this.props.form
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        return {
            username: {
            }
        }
    }
})((props) => {
    const { getFieldDecorator } = props.form
    const { formatMessage } = props.intl
    const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 6 }
    }
    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover title={ formatMessage({id: "LANG85"}) } content={ formatMessage({id: "LANG1064"}) }><span>{ formatMessage({id: "LANG85"}) }</span></Popover>
                    </span>
                )}
            >
                { getFieldDecorator('extension', {
                    rules: [
                        { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) }
                    ],
                    valuePropName: 'extension',
                    initialValue: 10
                })(
                    <InputNumber min={ 100 } max={ 1000 } />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover title={ formatMessage({id: "LANG1091"}) } content={ formatMessage({id: "LANG1092"}) }><span>{ formatMessage({id: "LANG1091"}) }</span></Popover>
                    </span>
                )}
            >
                { getFieldDecorator('dahdi', {
                    initialValue: ""
                })(
                    <Select />
                ) }
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Popover title={ formatMessage({id: "LANG1067"}) } content={ formatMessage({id: "LANG1068"}) }><span>{ formatMessage({id: "LANG1067"}) }</span></Popover>
                    </span>
                )}
            >
                { getFieldDecorator('cidnumber', {
                    rules: [
                        { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) }
                    ],
                    initialValue: "10"
                })(
                    <InputNumber min={ 100 } max={ 1000 } />
                ) }
            </FormItem>
        </Form>
    )
}))

class BasicSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _handleFormChange = (changedFields) => {
        this.props.dataSource["form"] = this.props.form
        console.log("adad")
        // this.setState({
        //     fields: { ...this.state.fields, ...changedFields },
        // })
    }
    render() {
        // const {formatMessage} = this.props.intl
        // const { getFieldDecorator } = this.props.form
        // const formItemLayout = {
        //     labelCol: { span: 3 },
        //     wrapperCol: { span: 6 }
        // }

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } />
            </div>
        )
    }
}

BasicSettings.propTypes = {
    dataSource: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
   
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BasicSettings))