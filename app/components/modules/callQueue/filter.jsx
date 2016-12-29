'use strict'

import moment from 'moment'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, DatePicker, Form, message, Popover, Transfer } from 'antd'

const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD'
const { RangePicker } = DatePicker

class Filter extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _handleSubmit = (e) => {
        e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (!this.props.selectQueues.length) {
                    message.error(formatMessage({ id: "LANG4762" }, {0: formatMessage({id: "LANG91"}).toLowerCase()}))

                    return
                }

                if (!this.props.selectAgents.length) {
                    message.error(formatMessage({ id: "LANG4762" }, {0: formatMessage({id: "LANG143"}).toLowerCase()}))

                    return
                }

                this.props.onSubmit()
            }
        })
    }
    _onAgentChange = (selectAgents, direction, moveKeys) => {
        this.props.onAgentChange(selectAgents)
        console.log('selectAgents: ', selectAgents)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _onQueueChange = (selectQueues, direction, moveKeys) => {
        this.props.onQueueChange(selectQueues)
        console.log('selectQueues: ', selectQueues)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _onTimeChange = (date, dateString) => {
        this.props.onTimeChange(date, dateString)
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }
        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 12 }
        }

        return (
            <div className="app-content-main">
                <Form onSubmit={ this._handleSubmit }>
                    <FormItem
                        { ...formItemTransferLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG91"}) } content={ formatMessage({id: "LANG91"}) }><span>{ formatMessage({id: "LANG91"}) }</span></Popover>
                            </span>
                        )}
                    >
                        <Transfer
                            showSearch
                            render={ item => item.title }
                            dataSource={ this.props.queues }
                            targetKeys={ this.props.selectQueues }
                            onChange={ this._onQueueChange }
                            filterOption={ this._filterTransferOption }
                            searchPlaceholder={ formatMessage({id: "LANG803"}) }
                            notFoundContent={ formatMessage({id: "LANG133"}) }
                            titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                        />
                    </FormItem>
                    <FormItem
                        { ...formItemTransferLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG143"}) } content={ formatMessage({id: "LANG143"}) }><span>{ formatMessage({id: "LANG143"}) }</span></Popover>
                            </span>
                        )}
                    >
                        <Transfer
                            showSearch
                            render={ item => item.title }
                            dataSource={ this.props.agents }
                            targetKeys={ this.props.selectAgents }
                            onChange={ this._onAgentChange }
                            filterOption={ this._filterTransferOption }
                            searchPlaceholder={ formatMessage({id: "LANG803"}) }
                            notFoundContent={ formatMessage({id: "LANG133"}) }
                            titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                        />
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG2261"}) } content={ formatMessage({id: "LANG2261"}) }><span>{ formatMessage({id: "LANG2261"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('rangeTime', {
                            rules: [
                                { type: 'array', required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: [ moment(this.props.startDate, dateFormat), moment(this.props.endDate, dateFormat) ]
                        })(
                            <RangePicker
                                format={ dateFormat }
                                onChange={ this._onTimeChange }
                                placeholder={[ formatMessage({id: "LANG1048"}), formatMessage({id: "LANG1049"}) ]}
                            />
                        ) }
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 6, offset: 3 }}
                    >
                        <Button type="primary" htmlType="submit">{ formatMessage({id: "LANG729"}) }</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(Filter))