module.exports = {
    // 将属性传递给子级
    propsToChildren: function (Element, propsMap) {
        // 例如：
        // propsMap = {
        //     'cols': this.props.cols
        // }
        return React.Children.map(this.props.children,function(child) {
            if (child.type === Element) {
                return React.cloneElement(child, propsMap)
            } else {
                return child;
            }
        }, this);
    }
};
