'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Transfer, Tooltip, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class AdvanceSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            customOptions: false,
            mfcr2DoubleSnswerTimeoutDivStyle: "hidden",
            advancedSettingsChecked: false 
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.props.getRefs(this.refs)
        this._resetAdvanceDefault()
        this._initVal()
    }
    _initVal = () => {
        const form = this.props.form

        if (form.getFieldValue("mfcr2_double_answer")) {
            this.setState({ 
                mfcr2DoubleSnswerTimeoutDivStyle: "display-block"
            })
        } else {
            this.setState({ 
                mfcr2DoubleSnswerTimeoutDivStyle: "hidden"
            })
            form.setFieldsValue({
               mfcr2_double_answer_timeout: "-1"
            })
        }
    }
    _toggleClickHandler = () => {
        this.setState({
            customOptions: !this.state.customOptions
        })
    }
    _onChangeHardhdlc = () => {
        // $P("#hardhdlc", document).valid();
    }
    _onChangeMfcr2DoubleAnswer = (e) => {
        if (e.target.checked) {
            this.setState({ 
                mfcr2DoubleSnswerTimeoutDivStyle: "display-block"
            })
        } else {
            this.setState({ 
                mfcr2DoubleSnswerTimeoutDivStyle: "hidden"
            })
        }      
    }
    _onChangeMfAdvancedSettings = (e) => {
        this.setState({
            advancedSettingsChecked: e.target.checked
        })
    }
    _resetAdvanceDefault = () => {
        let oAdvanceDefault = {
            "itu": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "5",
                "mf_ga_tones__request_category": "5",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "6",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "6",
                "mf_gb_tones__accept_call_no_charge": "7",
                "mf_gb_tones__busy_number": "3",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "5",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "2",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "F",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "ar": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "5",
                "mf_ga_tones__request_category": "5",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "6",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "6",
                "mf_gb_tones__accept_call_no_charge": "7",
                "mf_gb_tones__busy_number": "3",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "5",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "2",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "X",
                "mf_g1_tones__no_more_ani_available": "C",
                "mf_g1_tones__caller_ani_is_restricted": "F",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "400",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "br": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "9",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "2",
                "mf_ga_tones__request_next_ani_digit": "5",
                "mf_ga_tones__request_category": "5",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "X",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "1",
                "mf_gb_tones__accept_call_no_charge": "5",
                "mf_gb_tones__busy_number": "2",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "7",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "6",
                "mf_gb_tones__reject_collect_call": "7",
                "mf_gb_tones__number_changed": "3",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "X",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "8",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "cn": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "6",
                "mf_ga_tones__request_category": "6",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "X",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "1",
                "mf_gb_tones__accept_call_no_charge": "7",
                "mf_gb_tones__busy_number": "2",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "5",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "X",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "X",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "cz": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "5",
                "mf_ga_tones__request_category": "5",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "6",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "6",
                "mf_gb_tones__accept_call_no_charge": "7",
                "mf_gb_tones__busy_number": "3",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "5",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "2",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "F",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "co": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "5",
                "mf_ga_tones__request_category": "5",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "6",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "1",
                "mf_gb_tones__accept_call_no_charge": "5",
                "mf_gb_tones__busy_number": "2",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "6",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "X",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "F",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "ec": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "5",
                "mf_ga_tones__request_category": "5",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "6",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "6",
                "mf_gb_tones__accept_call_no_charge": "7",
                "mf_gb_tones__busy_number": "3",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "5",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "2",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "F",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "id": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "8",
                "mf_ga_tones__request_dnis_minus_2": "9",
                "mf_ga_tones__request_dnis_minus_3": "X",
                "mf_ga_tones__request_all_dnis_again": "2",
                "mf_ga_tones__request_next_ani_digit": "6",
                "mf_ga_tones__request_category": "6",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "5",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "6",
                "mf_gb_tones__accept_call_no_charge": "7",
                "mf_gb_tones__busy_number": "3",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "5",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "2",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "F",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "mx": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "X",
                "mf_ga_tones__request_category": "X",
                "mf_ga_tones__request_category_and_change_to_gc": "6",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "X",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "1",
                "mf_gb_tones__accept_call_no_charge": "5",
                "mf_gb_tones__busy_number": "2",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "2",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "X",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "1",
                "mf_gc_tones__request_change_to_g2": "3",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "5",
                "mf_g1_tones__no_more_dnis_available": "X",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "F",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "ph": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "5",
                "mf_ga_tones__request_category": "5",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "6",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "6",
                "mf_gb_tones__accept_call_no_charge": "7",
                "mf_gb_tones__busy_number": "3",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "5",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "2",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "F",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            },
            "ve": {
                "mf_ga_tones__request_next_dnis_digit": "1",
                "mf_ga_tones__request_dnis_minus_1": "2",
                "mf_ga_tones__request_dnis_minus_2": "7",
                "mf_ga_tones__request_dnis_minus_3": "8",
                "mf_ga_tones__request_all_dnis_again": "X",
                "mf_ga_tones__request_next_ani_digit": "9",
                "mf_ga_tones__request_category": "5",
                "mf_ga_tones__request_category_and_change_to_gc": "X",
                "mf_ga_tones__request_change_to_g2": "3",
                "mf_ga_tones__address_complete_charge_setup": "6",
                "mf_ga_tones__network_congestion": "4",
                "mf_gb_tones__accept_call_with_charge": "6",
                "mf_gb_tones__accept_call_no_charge": "7",
                "mf_gb_tones__busy_number": "3",
                "mf_gb_tones__network_congestion": "4",
                "mf_gb_tones__unallocated_number": "5",
                "mf_gb_tones__line_out_of_order": "8",
                "mf_gb_tones__special_info_tone": "2",
                "mf_gb_tones__reject_collect_call": "X",
                "mf_gb_tones__number_changed": "X",
                "mf_gc_tones__request_next_ani_digit": "X",
                "mf_gc_tones__request_change_to_g2": "X",
                "mf_gc_tones__request_next_dnis_digit_and_change_to_ga": "X",
                "mf_g1_tones__no_more_dnis_available": "X",
                "mf_g1_tones__no_more_ani_available": "F",
                "mf_g1_tones__caller_ani_is_restricted": "C",
                "mf_g2_tones__national_subscriber": "1",
                "mf_g2_tones__national_priority_subscriber": "2",
                "mf_g2_tones__international_subscriber": "7",
                "mf_g2_tones__international_priority_subscriber": "9",
                "mf_g2_tones__collect_call": "X",
                "timers__mf_back_cycle": "5000",
                "timers__mf_back_resume_cycle": "150",
                "timers__mf_fwd_safety": "30000",
                "timers__r2_seize": "8000",
                "timers__r2_answer": "80000",
                "timers__r2_metering_pulse": "0",
                "timers__r2_double_answer": "400",
                "timers__r2_answer_delay": "150",
                "timers__cas_persistence_check": "500",
                "timers__dtmf_start_dial": "500",
                "mf_threshold": "0"
            }
        }

        let sAraeVal = ""

        $("#otherR2AdvancedContent select, #otherR2AdvancedContent input").filter(":visible").each(function() {
            $(this).val(oAdvanceDefault[$("#mfcr2_variant").val()][this.id])
        })
        $(".mcr2_default").removeClass("mcr2_default")

        // $('#otherAdvanced_btn').bind("click", function(ev) {
        //     if ($("#signalling").val() === "mfcr2" && $(".prioptions").is(":visible")) {
        //         $("#otherR2AdvancedContent div[tooltip]").filter(":visible").each(function() {
        //             let oItem = $(this).siblings(".field-content").find("select")[0] || $(this).siblings(".field-content").find("input")[0]
        //             sAraeVal = $("#mfcr2_variant").val()
        //             let nDefault = oAdvanceDefault[sAraeVal][oItem.id]
        //             $(this).attr("tooltip", nDefault)
        //             if (oItem.value != nDefault) {
        //                 $(this).addClass("mcr2_default")
        //             } else {
        //                 $(this).removeClass("mcr2_default")
        //             }
        //         })
        //     }
        // })

        // $("#otherR2AdvancedContent input, #otherR2AdvancedContent select").on('change', function() {
        //     let nDefault = oAdvanceDefault[sAraeVal][this.id]
        //     if (this.value != nDefault) {
        //         $(this).closest(".field-content").siblings(".field-label").addClass("mcr2_default")
        //     } else {
        //         $(this).closest(".field-content").siblings(".field-label").removeClass("mcr2_default")
        //     }
        // })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        let priSettingsInfo = this.props.priSettingsInfo,
            customOptionsStyle = "hidden"

        if (this.state.customOptions) {
            customOptionsStyle = "display-block"
        }

        return (
            <div className="content">
                <div className="top-button">
                    <Button 
                        ref="otherAdvanced_btn" 
                        type="primary"
                        onClick={ this._toggleClickHandler }>
                        { formatMessage({id: "LANG3367"}) }
                    </Button>
                </div>
                <div className="ant-form">
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="switchtypeDiv"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3110" />}>
                                        <span>{formatMessage({id: "LANG3109"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('switchtype', {
                                    rules: [],
                                    initialValue: priSettingsInfo.switchtype ? priSettingsInfo.switchtype : "euroisdn"
                                })(
                                    <Select>
                                        <Option value="euroisdn">EuroISDN</Option>
                                        <Option value="national">NI2</Option>
                                        <Option value="dms100">DMS100</Option>
                                        <Option value="4ess">4ESS</Option>
                                        <Option value="5ess">5ESS</Option>
                                        <Option value="ni1">NI1</Option>
                                        <Option value="qsig">Q.SIG</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                ref=""
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3100" />}>
                                        <span>{formatMessage({id: "LANG3099"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('coding', {
                                    rules: [],
                                    initialValue: priSettingsInfo.coding
                                })(
                                    <Select>
                                    {/*
                                        <Option value="hdb3">hdb3</Option>
                                        <Option value="b8zs">b8zs</Option>
                                        <Option value="ami">ami</Option> 
                                    */}
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="em_w_outgoing"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG4139" />}>
                                        <span>{formatMessage({id: "LANG4138"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('emoutbandcalldialdelay', {
                                    rules: [],
                                    initialValue: priSettingsInfo.emoutbandcalldialdelay ? priSettingsInfo.emoutbandcalldialdelay : "200"
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                ref="em_immediate_div"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG4132" />}>
                                        <span>{formatMessage({id: "LANG4131"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('em_rxwink', {
                                    rules: [],
                                    initialValue: priSettingsInfo.em_rxwink ? priSettingsInfo.em_rxwink : "300"
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                ref="crcDiv"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3102" />}>
                                        <span>{formatMessage({id: "LANG3101"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('crc', {
                                    rules: [],
                                    initialValue: priSettingsInfo.crc
                                })(
                                    <Select>
                                    {/*
                                        <Option value="none">none</Option>
                                        <Option value="crc4">crc4</Option>
                                        <Option value="crc6">crc6</Option>
                                    */}
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                        </Col>
                    </Row>
                    <div ref="pridialplanDIV">
                        <Row>
                            <Col span={ 12 }>
                                 <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3441" />}>
                                            <span>{formatMessage({id: "LANG3440"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('pridialplan', {
                                        rules: [],
                                        initialValue: priSettingsInfo.pridialplan ? priSettingsInfo.pridialplan : "unknown"
                                    })(
                                        <Select>
                                            <Option value="unknown">Unknown</Option>
                                            <Option value="private">Private</Option>
                                            <Option value="local">Local</Option>
                                            <Option value="national">National</Option>
                                            <Option value="international">International</Option>
                                            <Option value="dynamic">Dynamic</Option>
                                            <Option value="redundant">Redundant</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref="prilocaldialplanDIV"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3443" />}>
                                            <span>{formatMessage({id: "LANG3442"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('prilocaldialplan', {
                                        rules: [],
                                        initialValue: priSettingsInfo.prilocaldialplan ? priSettingsInfo.prilocaldialplan : "unknown"
                                    })(
                                        <Select>
                                            <Option value="unknown">Unknown</Option>
                                            <Option value="private">Private</Option>
                                            <Option value="local">Local</Option>
                                            <Option value="national">National</Option>
                                            <Option value="international">International</Option>
                                            <Option value="dynamic">Dynamic</Option>
                                            <Option value="redundant">Redundant</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div ref="SS7dialplanDIV">
                        <Row>
                            <Col span={ 12 }>
                                 <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3112" />}>
                                            <span>{formatMessage({id: "LANG3111"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ss7_called_nai', {
                                        rules: [],
                                        initialValue: priSettingsInfo.ss7_called_nai ? priSettingsInfo.ss7_called_nai : "unknown"
                                    })(
                                        <Select>
                                            <Option value="unknown">Unknown</Option>
                                            <Option value="subscriber">Subscriber</Option>
                                            <Option value="national">National</Option>
                                            <Option value="international">International</Option>
                                            <Option value="dynamic">Dynamic</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref="prilocaldialplanDIV"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3114" />}>
                                            <span>{formatMessage({id: "LANG3113"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ss7_calling_nai', {
                                        rules: [],
                                        initialValue: priSettingsInfo.ss7_calling_nai ? priSettingsInfo.ss7_calling_nai : "unknown"
                                    })(
                                        <Select>
                                            <Option value="unknown">Unknown</Option>
                                            <Option value="subscriber">Subscriber</Option>
                                            <Option value="national">National</Option>
                                            <Option value="international">International</Option>
                                            <Option value="dynamic">Dynamic</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col span={ 12 }>
                             <FormItem
                                ref="hardhdlcDiv"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3134" />}>
                                        <span>{formatMessage({id: "LANG3133"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('hardhdlc', {
                                    rules: [],
                                    initialValue: priSettingsInfo.hardhdlc ? priSettingsInfo.hardhdlc : this.props.hardhdlcOpts[0].val
                                })(
                                    <Select onClick={ this._onChangeHardhdlc }>
                                    {
                                        this.props.hardhdlcOpts.map(function(it) {
                                            const text = it.text
                                            const value = String(it.val)

                                            return <Option key={ value } value={ value }>
                                                   { text ? text : value }
                                                </Option>
                                        })
                                    }
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                        </Col>
                    </Row>
                    <div ref="callerIdPrefix">
                        <Row>
                            <Col span={ 12 }>
                                 <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG3191"}) }>
                                    { getFieldDecorator('internationalprefix', {
                                        rules: [],
                                        initialValue: priSettingsInfo.internationalprefix ? priSettingsInfo.internationalprefix : ""
                                    })(
                                        <Input maxLength="10" />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref="prilocaldialplanDIV"
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG3192"}) }>
                                    { getFieldDecorator('nationalprefix', {
                                        rules: [],
                                        initialValue: priSettingsInfo.nationalprefi
                                    })(
                                        <Input maxLength="10" />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                 <FormItem
                                    ref="subscriberprefixDiv"
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG3380"}) }>
                                    { getFieldDecorator('subscriberprefix', {
                                        rules: [],
                                        initialValue: priSettingsInfo.subscriberprefix ? priSettingsInfo.subscriberprefix : ""
                                    })(
                                        <Input maxLength="20" />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref="localprefixDiv"
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG3193"}) }>
                                    { getFieldDecorator('localprefix', {
                                        rules: [],
                                        initialValue: priSettingsInfo.localprefix ? priSettingsInfo.localprefix : ""
                                    })(
                                        <Input maxLength="20" />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                 <FormItem
                                    ref="privateprefixDiv"
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG3194"}) }>
                                    { getFieldDecorator('privateprefix', {
                                        rules: [],
                                        initialValue: priSettingsInfo.privateprefix ? priSettingsInfo.privateprefix : ""
                                    })(
                                        <Input maxLength="20" />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG3195"}) }>
                                    { getFieldDecorator('unknownprefix', {
                                        rules: [],
                                        initialValue: priSettingsInfo.unknownprefix ? priSettingsInfo.unknownprefix : ""
                                    })(
                                        <Input maxLength="20" />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                 <FormItem
                                    ref="priT310Div"
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG4368"}) }>
                                    { getFieldDecorator('pri_timer_t310', {
                                        rules: [],
                                        initialValue: priSettingsInfo.pri_timer_t310 ? priSettingsInfo.pri_timer_t310 : "10"
                                    })(
                                        <Input maxLength="10" />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                            </Col>
                        </Row>
                    </div>
                    <div ref="specialDiv">
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3116" />}>
                                            <span>{formatMessage({id: "LANG3115"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('priindication', {
                                        rules: [],
                                        initialValue: priSettingsInfo.priindication ? priSettingsInfo.priindication : "inband"
                                    })(
                                        <Select>
                                            <Option value="inband">inband</Option>
                                            <Option value="outofband">outofband</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2785" />}>
                                            <span>{formatMessage({id: "LANG2841"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('resetinterval', {
                                        rules: [],
                                        initialValue: priSettingsInfo.resetinterval ? String(priSettingsInfo.resetinterval) : "never"
                                    })(
                                        <Select>    
                                            <Option value="never" locale="LANG546">Never</Option>
                                            <Option value="300">300</Option>
                                            <Option value="1800">1800</Option>
                                            <Option value="3600">3600</Option>
                                            <Option value="7200">7200</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                               <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3118" />}>
                                            <span>{formatMessage({id: "LANG3117"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('priexclusive', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: priSettingsInfo.priexclusive === "yes" ? true : false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                               <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3122" />}>
                                            <span>{formatMessage({id: "LANG3121"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('facilityenable', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: priSettingsInfo.facilityenable === "yes" ? true : false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3120" />}>
                                            <span>{formatMessage({id: "LANG3119"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('overlapdial', {
                                        rules: [],
                                        initialValue: priSettingsInfo.overlapdial ? priSettingsInfo.overlapdial : "no"
                                    })(
                                        <Select>
                                            <Option value="no">No</Option>
                                            <Option value="incoming">Incoming</Option>
                                            <Option value="outgoing">Outgoing</Option>
                                            <Option value="both">Both</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3124" />}>
                                            <span>{formatMessage({id: "LANG3123"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('nsf', {
                                        rules: [],
                                        initialValue: priSettingsInfo.nsf ? priSettingsInfo.nsf : "none"
                                    })(
                                        <Select>    
                                            <Option value="none">none</Option>
                                            <Option value="sdn">sdn</Option>
                                            <Option value="megacom">megacom</Option>
                                            <Option value="tollfreemegacom">tollfreemegacom</Option>
                                            <Option value="accunet">accunet</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div ref="R2Advanced">
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3308" />}>
                                            <span>{formatMessage({id: "LANG3307"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_mfback_timeout', {
                                        rules: [],
                                        initialValue: priSettingsInfo.mfcr2_mfback_timeout ? priSettingsInfo.mfcr2_mfback_timeout : "-1"
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3310" />}>
                                            <span>{formatMessage({id: "LANG3309"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_metering_pulse_timeout', {
                                        rules: [],
                                        initialValue: priSettingsInfo.mfcr2_metering_pulse_timeout ? priSettingsInfo.mfcr2_metering_pulse_timeout : "-1"
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3306" />}>
                                            <span>{formatMessage({id: "LANG3305"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_allow_collect_calls', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: priSettingsInfo.mfcr2_metering_pulse_timeout === "yes" ? true : false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3322" />}>
                                            <span>{formatMessage({id: "LANG3321"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_double_answer', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: priSettingsInfo.mfcr2_double_answer === "yes" ? true : false
                                    })(
                                        <Checkbox onChange={ this._onChangeMfcr2DoubleAnswer } />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref="mfcr2DoubleSnswerTimeoutDiv"
                                    className={ this.state.mfcr2DoubleSnswerTimeoutDivStyle }
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3369" />}>
                                            <span>{formatMessage({id: "LANG3368"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_double_answer_timeout', {
                                        rules: [],
                                        initialValue: priSettingsInfo.mfcr2_double_answer_timeout ? priSettingsInfo.mfcr2_double_answer_timeout : "-1"
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3314" />}>
                                            <span>{formatMessage({id: "LANG3313"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_accept_on_offer', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: priSettingsInfo.mfcr2_accept_on_offer !== "no" ? true : false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3262" /> }>
                                            <span>{ formatMessage({id: "LANG3261"}) }</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('networkindicator', {
                                        rules: [],
                                        initialValue: priSettingsInfo.networkindicator ? priSettingsInfo.networkindicator : "national"
                                    })(
                                        <Select>
                                            <Option value="national">National</Option>
                                            <Option value="national_spare">National Spare</Option>
                                            <Option value="international">International</Option>
                                            <Option value="international_spare">International Spare</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3320" />}>
                                            <span>{formatMessage({id: "LANG3319"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('mfcr2_charge_calls', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: priSettingsInfo.mfcr2_charge_calls !== "no" ? true : false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                            </Col>
                        </Row>
                    </div>
                    <div ref="otherR2Advanced">
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label={ formatMessage({id: "LANG3323"}) }>
                                    { getFieldDecorator('mf_advanced_settings', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: priSettingsInfo.mf_advanced_settings === "yes" ? true : false
                                    })(
                                        <Checkbox onChange={this._onChangeMfAdvancedSettings } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    ref=""
                                    { ...formItemLayout }
                                    label="">
                                    <span>{ formatMessage({id: "LANG3290"}) }</span>
                                    <span ref="advanced_area">:ITU</span>
                                    <Button ref="advanced_default" type="primary" onClick={ this._resetAdvanceDefault}>{ formatMessage({id: "LANG749"}) }</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        <div ref="otherR2AdvancedContent" className={ customOptionsStyle }>
                            <div className="des">
                                <p>{ formatMessage({ id: "LANG4090"}) }</p>
                            </div>
                            <div className="section-title">{ formatMessage({ id: "LANG3361"}) }</div>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3324"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_next_dnis_digit', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_next_dnis_digit ? priSettingsInfo.mf_ga_tones__request_next_dnis_digit : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3325"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_dnis_minus_1', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_dnis_minus_1 ? priSettingsInfo.mf_ga_tones__request_dnis_minus_1 : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3326"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_dnis_minus_2', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_dnis_minus_2 ? priSettingsInfo.mf_ga_tones__request_dnis_minus_2 : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3327"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_dnis_minus_3', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_dnis_minus_3 ? priSettingsInfo.mf_ga_tones__request_dnis_minus_3 : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3328"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_all_dnis_again', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_all_dnis_again ? priSettingsInfo.mf_ga_tones__request_all_dnis_again : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3329"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_next_ani_digit', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_next_ani_digit ? priSettingsInfo.mf_ga_tones__request_next_ani_digit : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3330"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_category', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_category ? priSettingsInfo.mf_ga_tones__request_category : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3331"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_category_and_change_to_gc', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_category_and_change_to_gc ? priSettingsInfo.mf_ga_tones__request_category_and_change_to_gc : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3332"}) }>
                                        { getFieldDecorator('mf_ga_tones__request_change_to_g2', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__request_change_to_g2 ? priSettingsInfo.mf_ga_tones__request_change_to_g2 : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3333"}) }>
                                        { getFieldDecorator('mf_ga_tones__address_complete_charge_setup', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__address_complete_charge_setup ? priSettingsInfo.mf_ga_tones__address_complete_charge_setup : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3334"}) }>
                                        { getFieldDecorator('mf_ga_tones__network_congestion', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_ga_tones__network_congestion ? priSettingsInfo.mf_ga_tones__network_congestion : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                </Col>
                            </Row>
                            <div className="section-title">{ formatMessage({ id: "LANG3362"}) }</div>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3335"}) }>
                                        { getFieldDecorator('mf_gb_tones__accept_call_with_charge', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__accept_call_with_charge ? priSettingsInfo.mf_gb_tones__accept_call_with_charge : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3336"}) }>
                                        { getFieldDecorator('mf_gb_tones__accept_call_no_charge', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__accept_call_no_charge ? priSettingsInfo.mf_gb_tones__accept_call_no_charge : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3337"}) }>
                                        { getFieldDecorator('mf_gb_tones__busy_number', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__busy_number ? priSettingsInfo.mf_gb_tones__busy_number : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3338"}) }>
                                        { getFieldDecorator('mf_gb_tones__network_congestion', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__network_congestion ? priSettingsInfo.mf_gb_tones__network_congestion : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3339"}) }>
                                        { getFieldDecorator('mf_gb_tones__unallocated_number', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__unallocated_number ? priSettingsInfo.mf_gb_tones__unallocated_number : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3340"}) }>
                                        { getFieldDecorator('mf_gb_tones__line_out_of_order', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__line_out_of_order ? priSettingsInfo.mf_gb_tones__line_out_of_order : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row> 
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3341"}) }>
                                        { getFieldDecorator('mf_gb_tones__special_info_tone', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__special_info_tone ? priSettingsInfo.mf_gb_tones__special_info_tone : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3342"}) }>
                                        { getFieldDecorator('mf_gb_tones__reject_collect_call', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__reject_collect_call ? priSettingsInfo.mf_gb_tones__reject_collect_call : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3343"}) }>
                                        { getFieldDecorator('mf_gb_tones__number_changed', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gb_tones__number_changed ? priSettingsInfo.mf_gb_tones__number_changed : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                </Col>
                            </Row>                                 
                            <div className="section-title">{ formatMessage({ id: "LANG3363"}) }</div>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3339"}) }>
                                        { getFieldDecorator('mf_gc_tones__request_next_ani_digit', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gc_tones__request_next_ani_digit ? priSettingsInfo.mf_gc_tones__request_next_ani_digit : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3345"}) }>
                                        { getFieldDecorator('mf_gc_tones__request_change_to_g2', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gc_tones__request_change_to_g2 ? priSettingsInfo.mf_gc_tones__request_change_to_g2 : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3346"}) }>
                                        { getFieldDecorator('mf_gc_tones__request_next_dnis_digit_and_change_to_ga', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_gc_tones__request_next_dnis_digit_and_change_to_ga ? priSettingsInfo.mf_gc_tones__request_next_dnis_digit_and_change_to_ga : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                </Col>
                            </Row>
                            <div className="section-title">{ formatMessage({ id: "LANG3364"}) }</div>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3347"}) }>
                                        { getFieldDecorator('mf_g1_tones__no_more_dnis_available', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_g1_tones__no_more_dnis_available ? priSettingsInfo.mf_g1_tones__no_more_dnis_available : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3348"}) }>
                                        { getFieldDecorator('mf_g1_tones__no_more_ani_available', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_g1_tones__no_more_ani_available ? priSettingsInfo.mf_g1_tones__no_more_ani_available : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3349"}) }>
                                        { getFieldDecorator('mf_g1_tones__caller_ani_is_restricted', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_g1_tones__caller_ani_is_restricted ? priSettingsInfo.mf_g1_tones__caller_ani_is_restricted : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                </Col>
                            </Row>
                            <div className="section-title">{ formatMessage({ id: "LANG3365"}) }</div>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3300"}) }>
                                        { getFieldDecorator('mf_g2_tones__national_subscriber', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_g2_tones__national_subscriber ? priSettingsInfo.mf_g2_tones__national_subscriber : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3301"}) }>
                                        { getFieldDecorator('mf_g2_tones__national_priority_subscriber', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_g2_tones__national_priority_subscriber ? priSettingsInfo.mf_g2_tones__national_priority_subscriber : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3302"}) }>
                                        { getFieldDecorator('mf_g2_tones__international_subscriber', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_g2_tones__international_subscriber ? priSettingsInfo.mf_g2_tones__international_subscriber : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3303"}) }>
                                        { getFieldDecorator('mf_g2_tones__international_priority_subscriber', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_g2_tones__international_priority_subscriber ? priSettingsInfo.mf_g2_tones__international_priority_subscriber : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3304"}) }>
                                        { getFieldDecorator('mf_g2_tones__collect_call', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_g2_tones__collect_call ? priSettingsInfo.mf_g2_tones__collect_call : "1"
                                        })(
                                            <Select disabled={ !this.state.advancedSettingsChecked }>    
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="0">0</Option>
                                                <Option value="B">B</Option>
                                                <Option value="C">C</Option>
                                                <Option value="D">D</Option>
                                                <Option value="E">E</Option>
                                                <Option value="F">F</Option>
                                                <Option value="X">X</Option>
                                            </Select>
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                </Col>
                            </Row>
                            <div className="section-title">{ formatMessage({ id: "LANG3366"}) }</div>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3300"}) }>
                                        { getFieldDecorator('timers__mf_back_cycle', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__mf_back_cycle ? priSettingsInfo.timers__mf_back_cycle : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3352"}) }>
                                        { getFieldDecorator('timers__mf_fwd_safety', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__mf_fwd_safety ? priSettingsInfo.timers__mf_fwd_safety : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3353"}) }>
                                        { getFieldDecorator('timers__r2_seize', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__r2_seize ? priSettingsInfo.timers__r2_seize : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3354"}) }>
                                        { getFieldDecorator('timers__r2_answer', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__r2_answer ? priSettingsInfo.timers__r2_answer : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3355"}) }>
                                        { getFieldDecorator('timers__r2_metering_pulse', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__r2_metering_pulse ? priSettingsInfo.timers__r2_metering_pulse : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3356"}) }>
                                        { getFieldDecorator('timers__r2_double_answer', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__r2_double_answer ? priSettingsInfo.timers__r2_double_answer : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3357"}) }>
                                        { getFieldDecorator('timers__r2_answer_delay', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__r2_answer_delay ? priSettingsInfo.timers__r2_answer_delay : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3358"}) }>
                                        { getFieldDecorator('timers__cas_persistence_check', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__cas_persistence_check ? priSettingsInfo.timers__cas_persistence_check : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3359"}) }>
                                        { getFieldDecorator('timers__dtmf_start_dial', {
                                            rules: [],
                                            initialValue: priSettingsInfo.timers__dtmf_start_dial ? priSettingsInfo.timers__dtmf_start_dial : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                                <Col span={ 12 }>
                                    <FormItem
                                        ref=""
                                        { ...formItemLayout }
                                        label={ formatMessage({id: "LANG3360"}) }>
                                        { getFieldDecorator('mf_threshold', {
                                            rules: [],
                                            initialValue: priSettingsInfo.mf_threshold ? priSettingsInfo.mf_threshold : ""
                                        })(
                                            <Input disabled={ !this.state.advancedSettingsChecked } />
                                        ) }
                                    </FormItem>
                                </Col>
                            </Row>       
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(AdvanceSettings)