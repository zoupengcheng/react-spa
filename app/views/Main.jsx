'use strict'

import React from 'react'
import SideBar from './sidebar'
import Header from './header'
import Footer from './footer'
import Container from './container'
import { Icon, Spin } from 'antd'

let Home = React.createClass({
    render() {
        return (
            <div className="home-page">
                <div className="home-logo"><Icon type="home" /></div>
                <div className="f14">new Date()</div>
                <div className="f16">{ this.props.username }，Welcome to Grandstream.</div>
            </div>
        )
    }
})

let App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            collapse: false,
            loading: false
        }
    },
    handleCollapseChange() {
        this.setState({
            collapse: !this.state.collapse
        })
    },
    renderChild() {
        const { children } = this.props

        if (children) {
            return (
                <div>
                    { children }
                </div>
            )
        }

        return (
            <div>
                <Home username={ "hi" } />
            </div>
        )
    },
    render() {
        const collapse = this.state.collapse
        const container = (
            <div className={ collapse ? "app-wrapper app-wrapper-collapse" : "app-wrapper" }>
                <div className="app-container">
                    <SideBar collapse={this.state.collapse} onChangeCollpase={ this.handleCollapseChange } />
                    <div className="app-main">
                        <Header />
                        <Container>
                            { this.renderChild() }
                        </Container>
                    </div>
                </div>
                <Footer />        
            </div>
        )
        return (
            <Spin spinning={this.state.loading} tip="Loading...">{container}</Spin>
        )
    }
})

module.exports = App