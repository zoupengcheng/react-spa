'use strict'

import Footer from '../../views/footer'
import React from 'react'
import { browserHistory } from 'react-router'
import { Form, Select, Row, Col, Upload, Input, Popover, Button } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
// import {Navbar, Nav, NavItem, NavDropdown, MenuItem, ProgressBar} from "react-bootstrap"
// import Ucmgui from "./../api/ucmgui"
// import cookie from 'react-cookie'
import $ from 'jquery'
// import md5 from "./../api/md5"
import api from "./../api/api"

const FormItem = Form.Item

const httpServerPage = React.createClass({
    getDefaultProps: function() {

    },
    getInitialState: function() {
        return {
          countryObj: {},
          model_info: {},
          countryArr: [{languages: "zh-CN", localName: "简体中文"}, {languages: "en-US", localName: "English"}]
        }
    },
    componentDidMount: function () {
        
    },
    render: function () {
        const {formatMessage} = this.props.intl
        const { getFieldDecorator } = this.props.form

        return (
          <div>
            <div className="main-wrapper" id="main-wrapper">
                <Form horizontal={true}>
                    <Row>
                        <Col sm={24}>
                            <FormItem>
                                {getFieldDecorator('web_redirect')(
                                    <Select>
                                        <Option value="1">Enable</Option>
                                        <Option value="0">Disable</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <FormItem>
                        <Button type="primary">Reset Certificates</Button>
                    </FormItem>
                </Form>
            </div>
            <Footer/>
          </div>
        )
    }
})

module.exports = Form.create()(injectIntl(httpServerPage))
