'use strict';

/**
  * Copyright (c) 2015 Sipin Frontend, All rights reserved.
  * http://www.sipin.com/
  * @author wilson
  * @date  2015-12-02
  * @description 基础表单，用于渲染后台常规表单
  * 基本的结构定义示例
    let data = [{
      title: "基本信息",
      formData: [{
          type: "input",
          title: "产品名称",
          key: "title",
          defaultValue: productData.title || "",
          placeholder: "请输入产品名称，100字节内",
          tips: '',
          validator: {
              required: true,
              message: {
                  required: "必填，100字节"
              }
          }
        },{
          type: "custom",
          title: "产品分类",
          key: "product_category_id",
          defaultValue: productData.goods_category_id || "",
          placeholder: "",
          render: function(){
              return (
                  <CategorySearch type="product" selected={parseInt(productData.product_category_id || '0')} />
              );
          },
          validator: {
              required: true,
              message: {
                  required: "必选"
              }
          }
        }]
    }]
  * validator 对象是绑定的验证信息，详情请参考 liteFlux 的文档
  */
import React from 'react';
import {Select, DatePicker, Switch, Checkbox, Radio} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
//import Editor from 'modules/editor/editor';
import liteFlux from 'lite-flux';
import uuid from '../helps/uuid';

function isOwnEmpty(obj) {
  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
}

/**
 * 表单容器.
 */
class FormContainer extends React.Component {
  onSubmit(e) {
    // 阻止form默认提交
    // form内的按钮均会引起form提交
    e.preventDefault();
  }
  render() {
    return (
      <form className="ant-form-horizontal" onSubmit={this.onSubmit}>
        {this.props.children}
      </form>
    );
  }
}

/**
 * 表单单项.
 */
class FormChild extends React.Component {
  render() {
    var classes = 'form-child-item ' + (this.props.classes || '');

    return (
      <div className={classes}>
        {this.props.title
          ? <h3 className="panel-heading u-mb-20" {...this.props}>{this.props.title}</h3>
          : null}
        {this.props.children}
      </div>
    );
  }
}

/**
 *  验证提示.
 */
class FeedBack extends React.Component {
  render() {
    let tips = <div className="ant-form-explain">{this.props.tips}</div>;
    let classes = SP.classSet({'has-feedback': true, 'is-validating': this.props.validating, 'has-error': this.props.error, 'has-warning': this.props.warning, 'has-success': this.props.success});
    return (
      <div className={classes}>
        {this.props.children}
        {tips}
      </div>
    );
  }
}

/**
 *  表单控件.
 *  所有控件暴露 onChange 方法与基础表单进行数据交互。
 *  对于特殊的控件，可以写成自定义的组件
 *  例如：
 *  let Test = React.createClass({
         onChange: function(e){
             if(this.props.onChange)
                 this.props.onChange(e.target.value)
         },
         render: function(){
             return (
                 <input className={"ant-input search-base-item"} defaultValue='test' onChange={this.onChange} type="search"></input>
             )
         }
    });
 * 传给 onChange的值可以是纯粹的字符串，也可以是对象
 */
class FormItem extends React.Component {
  render() {
    let self = this;
    let data = this.props.data;

    /**
         *  监听 Input 控件.
         */
    let handleInputChange = function (e) {
      if (data.onChange) {
        data.onChange(e.target.value, self.props.saveStore);
      }
      self.props.saveStore(self.props.keyIndex, self.props.keyName, e.target.value);
    };

    /**
         *  监听Select, switch, default 控件.
         */
    let handleKeyChange = function () {
      let args = Array.prototype.slice.call(arguments);
      args.push(self.props.saveStore);

      if (data.onChange) {
        data.onChange.apply(self, args);
      }
      self.props.saveStore(self.props.keyIndex, self.props.keyName, arguments[0]);
    };

    /**
         *  监听DatePicker控件.
         */
    let handleDatePickerChange = function (val) {
      val = val
        ? moment(val).format('YYYY-MM-DD HH:mm:ss')
        : null;
      if (data.onChange) {
        data.onChange(val, self.props.saveStore);
      }
      self.props.saveStore(self.props.keyIndex, self.props.keyName, val);
    };

    /**
         *  监听Checkbox 控件.
         */
    let handleCheckboxChange = function (checkbox_val, e) {
      let data = liteFlux.store(self.props.storeName).getStore();
      let vals = data[self.props.keyIndex][self.props.keyName] || [];
      if (e.target.checked) {
        // 如果没有则插入数组
        if (vals.indexOf(checkbox_val) === -1) {
          vals.push(checkbox_val);
        }

      } else {
        // 如果存在则从数组删除
        _.remove(vals, function (n) {
          return n === checkbox_val;
        });
      }
      self.props.saveStore(self.props.keyIndex, self.props.keyName, vals);
    };

    /**
         *  控件渲染.
         */
    let FormComponent = function () {
      let _formComponent = null;
      // 处理属性
      let attr = {
        value: self.props.inputData || self.props.value,
        placeholder: data.placeholder,
        disabled: data.disabled
      };
      if (data.id) {
        attr.id = data.id;
      }

      switch (data.type) {
          // 输入框
        case 'input':
          _.assign(attr, {
            type: 'text',
            onChange: handleInputChange
          });
          _formComponent = <antd.Input {...attr}></antd.Input>;
          break;
          // 密码输入框
        case 'password':
          _.assign(attr, {
            type: 'password',
            onChange: handleInputChange
          });

          _formComponent = <antd.Input {...attr}></antd.Input>;
          break;
          // 文本框
        case 'textarea':
          _.assign(attr, {
            type: 'textarea',
            rows: data.rows || '5',
            onChange: handleInputChange
          });
          _formComponent = <antd.Input {...attr}></antd.Input>;
          break;
          // 下拉框
        case 'select':
          _.assign(attr, {
            size: 'large',
            onChange: handleKeyChange.bind(self),
            value: attr.value + '',
            style: {
              width: 200
            }
          });

          _formComponent = (
            <Select {...attr}>
              {data.values.map(function (val) {
                let key = '' + val.key;
                return (
                  <Option key={key} value={key} disabled={val.disabled}>{val.name}</Option>
                );
              })
}
            </Select>
          );
          break;
          // 多选框
        case 'checkbox':

          let checkboxTags = data.values.map(function (val) {
            // 以数组形式存下所有的多选框的值
            let checkData = attr.value || [];
            let checked = false;
            if (checkData.indexOf(val.key) !== -1) {
              checked = true;
            }
            return (
              <span className="u-mr-15" key={val.key}>
                <Checkbox
                  onChange={handleCheckboxChange.bind(self, val.key)}
                  value={val.key}
                  checked={checked}
                  disabled={val.disabled}/>{val.name}
              </span>
            );
          });

          _formComponent = (
            <div>
              {checkboxTags}
            </div>
          );
          break;
          // 单选框
        case 'radio':

          _.assign(attr, {
            onChange: handleInputChange.bind(self),
            value: attr.value + ''
          });

          _formComponent = (
            <RadioGroup {...attr}>
              {data.values.map(function (val) {
                let key = '' + val.key;
                return (
                  <Radio key={key} value={key} disabled={val.disabled}>{val.name}</Radio>
                );
              })
}
            </RadioGroup>
          );

          break;
          // 日历
        case 'datepicker':
          _.assign(attr, {
            onChange: handleDatePickerChange.bind(self),
            showTime: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            style: {
              width: 200
            }
          });
          _formComponent = (<DatePicker {...attr}/>);
          break;
          // switch
        case 'switch':
          _.assign(attr, {
            onChange: handleKeyChange.bind(self),
            checked: (attr.value === '1')
              ? true
              : false
          });
          _formComponent = (<Switch {...attr}/>);
          break;
          // editor
      
          // 隐藏域类型
        case 'hidden':
          _.assign(attr, {
            content: attr.value || '',
            type: 'hidden',
            onChange: handleKeyChange.bind(self)
          });

          _formComponent = (<input {...attr} {...data.passProps}/>);
          break;
          // 默认自定义类型
        default:

          let _formComponent = React.cloneElement(data.render(), {
            value: self.props.inputData || self.props.value,
            onChange: handleKeyChange.bind(self)
          });

          break;
      }

      let fieldError = self.props.fieldError;
      let tips = (fieldError && fieldError.length)
        ? fieldError[0]
        : '';
      let error = (fieldError && fieldError.length)
        ? true
        : false;

      return (
        <FeedBack tips={tips} error={error}>
          {_formComponent}
        </FeedBack>
      );
    };

    // 隐藏输入框直接返回
    if (data.type === 'hidden') {
      return FormComponent();
    }

    // 是否必须填写
    let required = false;
    if (data.validator && data.validator.required) {
      required = true;
    }

    // 提示文字
    let tips = <p className="ant-form-explain">{data.tips}</p>;

      // Class
    let classes = SP.classSet({
        'ant-form-item': true,
        'ant-form-item-compact': data.type === 'radio' || data.type === 'checkbox'
      });

        // 如果设置title=null，则不要label，并100%宽度显示输入部分
        // 目前在文章发布的富文本编辑器处使用
    let label = null,
          input_field_class = '';
    if (data.title !== null) {
          label = <label className="col-4" required={required}>{data.title
              ? data.title + '：'
              : ''}</label>;
          input_field_class = 'col-16';
        }

    return (
          <div className={classes}>
            {label}
            <div className={input_field_class}>
              {FormComponent()}
              {tips}
            </div>
          </div>
        );
  }
    }

    /**
 *  提交按钮.
 *  如果按钮定义有 render 方法，则会按 render 方法渲染，否则默认输出按钮
 *  按钮传递 valid 方法， 运行valid方法，会进行数据的验证，最终的数据结构见 liteFlux 的文档
 */
class SubmitBtn extends React.Component {
      render() {
        let self = this;
        let actionButtons = (self.props.actionButtons && self.props.actionButtons.map(function (actionButton, index) {
          if (actionButton.render) {
            return actionButton.render();
          } else {
            return (<input
              key={index}
              type="submit"
              onClick={actionButton.onClick.bind(self, self.props.valid)}
              className="ant-btn ant-btn-primary ant-btn-lg u-mr-15"
              value={actionButton.title}/>);
          }

        })) || null;
        return (
          <div className="row">
            <div className="col-12 col-offset-4">
              {actionButtons}
            </div>
          </div>
        );
      }
    }

let Immutable = require('immutable');
let is = Immutable.is.bind(Immutable),
      getKeys = Object.keys.bind(Object);

function shallowEqualImmutable(objA, objB) {
      if (is(objA, objB)) {
        return true;
      }
      let keysA = getKeys(objA),
        keysB = getKeys(objB),
        keysAlength = keysA.length,
        keysBlength = keysB.length;

      if (keysAlength !== keysBlength) {
        return false;
      }

      // Test for A's keys different from B.
      for (let i = 0; i < keysAlength; i++) {
        if (!objB.hasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
          return false;
        }
      }

      // Now we dont need to test for B's keys missing from A,
      // because if length's is same and prev check success - objB hasn't more keys
      return true;
    }

    /* 表单组件 */
export default class BaseForm extends React.Component {

      constructor(props) {
        super(props);

        // 以防多页面跳转时数据冲突
        let storeName = uuid();

        // 定义表单对应的 store
        let store = liteFlux.store(storeName, {data: []});

        // 把 store, 表单定义存在 state
        // 这样实现外部就可以改变内容渲染
        this.state = {
          store: store,
          storeName: storeName,
          formData: this._getStateFromStore(storeName)
        };

      }

      // 把表单修改过的值存 store
      setStore(data, isNew) {
        // 状态数据
        let self = this;
        let store_data = [];

        data.map(function (item_data, index) {

          let store_item = {};

          item_data.formData.map(function (_item_data) {
            let store = self._getStateFromStore(self.state.storeName);
            // 如果已经有值了，则不使用默认值
            store_item[_item_data.key] = (store[index] && store[index][_item_data.key]) || _item_data.defaultValue;
            // 如果isNew = true， 则每次获取defaultValue
            // 解决编辑sku列表数据未更新问题
            if (isNew) {
              store_item[_item_data.key] = _item_data.defaultValue;
            }
          });

          store_data.push(store_item);
        });

        // 改变 store 的值
        liteFlux.store(this.state.storeName).setStore(store_data);

        // 同时改变视图的值
        this.setState({
          formData: this._getStateFromStore(this.state.storeName)
        });
      }

      setValid(callback) {
        // 验证数据
        let Validator = liteFlux.validator;

        let validData = {};
        this.props.data.map(function (item_data, index) {
          item_data.formData.map(function (_item_data) {
            validData[index + '.' + _item_data.key] = _item_data.validator;
          });
        });

        let validatorTest = Validator(liteFlux.store(this.state.storeName), validData, {
          //oneError: true //是否只要错了一次就中断
        });

        //console.log(liteFlux.store(this.state.storeName));

        this.setState({
          validator: validatorTest
        }, callback);
      }

      valid(callback) {
        this.setValid(function () {
          let isValid = this.state.validator.valid();
          callback(isValid, this.state.formData);
        });
      }

      componentDidMount() {
        var self = this;
        this.setStore(this.props.data);
        liteFlux.event.on('_storeChange', self._setStateFromStore.bind(self));
      }

      componentWillUnmount() {
        liteFlux.event.off('_storeChange');
        // 注销 store
        liteFlux.store(this.state.storeName).destroy();
      }

      componentWillReceiveProps(nextProps) {
        //console.log(shallowEqualImmutable( this.props.actionButtons[0], nextProps.actionButtons[0] ));
        // if ( shallowEqualImmutable( this.props.data, nextProps.data ) ) {
        //     return;
        // }

        // 如果传进 isNew，则每次都取默认值
        let isNew = this.props.isNew || false;
        this.setStore(nextProps.data, isNew);
      }

      _setStateFromStore() {
        this.setState({
          formData: this._getStateFromStore(this.state.storeName)
        });

      }

      _getStateFromStore(store) {
        return liteFlux.store(store).getStore();
      }

      saveStore(index, key, value) {
        let data = liteFlux.store(this.state.storeName).getStore();
        data[index][key] = value;
        liteFlux.store(this.state.storeName).setStore(data);
      }

      render() {

        let self = this;
        let form_child = this.props.data.map(function (item_data, index) {

          if (item_data.sectionType === 'custom') {
            return (
              <FormChild key={index} title={item_data.title} classes={item_data.classes}>
                {React.cloneElement(item_data.render(), {
                  index: index,
                  data: item_data.formData,
                  value: self.state.formData[index],
                  onChange: self.saveStore.bind(self)
                })}
              </FormChild>
            );
          }

          let formData_item = item_data.formData.map(function (item, i) {
            if (self.state.formData && !isOwnEmpty(self.state.formData)) {

              let store = self._getStateFromStore(self.state.storeName);
              let value = self.state.formData[index][item.key];
              let fieldError = null;

              if (self.state.formData.fieldError && self.state.formData.fieldError[index] && self.state.formData.fieldError[index][item.key]) {
                fieldError = self.state.formData.fieldError[index][item.key];
              }

              return (<FormItem
                key={i}
                data={item}
                inputData={store[index] && store[index][item.key] || null}
                keyIndex={index}
                keyName={item.key}
                value={value}
                fieldError={fieldError}
                storeName={self.state.storeName}
                saveStore={self.saveStore.bind(self)}/>);
            }
          });

          return (<FormChild key={index} title={item_data.title} classes={item_data.classes}>
            {formData_item}
          </FormChild>);
        });

        return (
          <FormContainer>
            {form_child}
            <SubmitBtn actionButtons={self.props.actionButtons} valid={this.valid.bind(this)}/>
          </FormContainer>
        );
      }
    }
