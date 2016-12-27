'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import { Card, Row, Col} from 'antd'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib//component/legend'
import 'echarts/lib//component/grid'

import $ from 'jquery'
import api from "../../api/api"

class ResourceUsage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        this._showChart()
    }
    componentWillUnmount() {
    }
    _showChart = () => {
        let resourceUsageChart = echarts.init(document.getElementById('resourceUsage'))
        let memoryUsageData = [80, 10, 5, 30, 60, 40, 20],
            cpuUsageData = [70, 20, 50, 80, 40, 60, 100],
            timesData = ['0s', '10s', '20s', '30s', '40s', '50s', '60s']
                    const option = {
                title: {
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#FF4179', '#4875F0'],
                legend: {
                    right: '0',
                    data: [{
                        name: 'Memory Usage', 
                        icon: 'roundRect',
                        textStyle: {
                            color: '#7D8A99',
                            fontSize: '10px'
                        }
                    }, {
                        name: 'CPU Usage', 
                        icon: 'roundRect',
                        textStyle: {
                            color: '#7D8A99',
                            fontSize: '10px'
                        }
                    }]
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            textStyle: {
                                color: "#7D8A99",
                                fontSize: "10px",
                                fontWeight: 400
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 0
                            }
                        },
                        data: timesData
                    },
                yAxis: {
                    axisLabel: {
                        formatter: function (val) {
                            return val + '%'
                        },
                        textStyle: {
                            color: "#7D8A99",
                            fontSize: "10px",
                            fontWeight: 400
                        }
                    },
                    boundaryGap: false,
                    splitNumber: 5,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#E2E8EF"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 0
                        }
                    }
                },
                series: [
                    {
                        name: 'Memory Usage',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                type: 'solid',
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#FF827F' 
                                }, {
                                    offset: 1, color: '#FF3377' 
                                }], true),
                                opacity: '0.5'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                  offset: 0, color: '#E3497F'
                                }, {
                                  offset: 1, color: '#FAEBF1' 
                                }], true),
                                opacity: '0.5'
                            }
                        },
                        itemStyle: {
                            normal: {
                                opacity: 0.3
                            }
                        },
                        data: memoryUsageData
                    }, {
                        name: 'CPU Usage',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#548DFF' 
                                }, {
                                    offset: 1, color: '#654CE5'
                                }], false),
                                width: 1.5
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, 
                                    color: '#3B66E6'
                                }, {
                                    offset: 1, 
                                    color: '#E8EDFB'
                                }]),
                                opacity: '0.5'
                            }
                        },
                        itemStyle: {
                            normal: {
                                opacity: 0.3
                            }
                        },
                        data: cpuUsageData
                    }
                ]
            }   
        // setInterval(function() {
        //     for (let i = timesData.length - 1; i >= 0; i--) {
        //         let timesDataIndex = timesData[i]
        //         timesData[i] = Number(timesDataIndex.match(/^\d+/)[0]) + 5 + "s"
        //     }
        //     memoryUsageData = memoryUsageData.slice(1).concat(parseInt(Math.random() * 100))
        //     cpuUsageData = cpuUsageData.slice(1).concat(parseInt(Math.random() * 100))

        //     for (let i = memoryUsageData.length - 1; i >= 0; i--) {
        //         let memoryUsageDataIndex = memoryUsageData[i]

        //         if (memoryUsageDataIndex >= 100) {
        //             memoryUsageData[i] = 50
        //         }
        //     }

        //     for (let i = cpuUsageData.length - 1; i >= 0; i--) {
        //         let cpuUsageDataIndex = cpuUsageData[i]

        //         if (cpuUsageDataIndex >= 100) {
        //             cpuUsageData[i] = 50
        //         }
        //     }

        //     resourceUsageChart.setOption({
        //         xAxis: {
        //             data: timesData
        //         },
        //         series: [{
        //             name: 'Memory Usage',
        //             data: memoryUsageData
        //         }, {
        //             name: 'CPU Usage',
        //             data: cpuUsageData
        //         }]
        //     })
        // }, 5000)
        resourceUsageChart.setOption(option)         
    }
    render() {
        return (
            <div className="resource-usage">
                <Card title="Resource Usage" bordered={true}>
                    <Row gutter={10} align="middle">
                        <Col className="gutter-row" xs={{ span: 18}} sm={{ span: 18}} md={{ span: 18}} lg={{ span: 18}}>
                            <div id="resourceUsage" style={{height: 250}}></div>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}} sm={{ span: 6}} md={{ span: 6}} lg={{ span: 6}}>
                            <Row gutter={10} align="middle">
                                <div className="usage-rate usage-rate-cpu">
                                    <Col className="gutter-row" xs={{ span: 24}} sm={{ span: 24}} md={{ span: 24}} lg={{ span: 24}}>
                                        <div>
                                            <span>CPU Usage</span>
                                        </div>
                                        <div>
                                            <font className="usage-rate-percent">76%</font>
                                            <span className="sprite sprite-resurce-up"></span>
                                        </div>
                                        <div>
                                            <font className="usage-rate-space">1024MB</font>
                                            <font className="usage-rate-total">Total</font>
                                        </div>
                                    </Col>
                                </div>
                            </Row>
                            <hr className="hr" />
                            <Row gutter={10} align="middle">
                                <div className="usage-rate">
                                    <Col className="gutter-row" xs={{ span: 24}} sm={{ span: 24}} md={{ span: 24}} lg={{ span: 24}}>
                                        <div>
                                            <span>Memory Usage</span>
                                        </div>
                                        <div>
                                            <font className="usage-rate-percent">56%</font>
                                            <span className="sprite sprite-resurce-down"></span>
                                        </div>
                                        <div>
                                            <font className="usage-rate-space">1024MB</font>
                                            <font className="usage-rate-total">Total</font>
                                        </div>
                                    </Col>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default injectIntl(ResourceUsage)