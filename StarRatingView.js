import React, { PureComponent } from 'react';
import {
  View,
  PanResponder,
  ViewPropTypes,
} from 'react-native';

import PropTypes from 'prop-types';
import StarsView from './StarsView';

import styles from './styles';

const RNViewPropTypes = ViewPropTypes || View.propTypes;
const RNPropTypes = PropTypes || React.PropTypes;

let _StarLog = function (message?: any, ...optionalParams: any[]) {
  // console.log(message, ...optionalParams);
};


if (!__DEV__) {
  /*
    global.console = {
        info: () => {
        },
        log: () => {
        },
        warn: () => {
        },
        error: () => {
        }
    }
    */

  _StarLog = () => {};
}

export const StarLog = _StarLog;

export default class StarRatingView extends PureComponent {
  static propTypes = {
    style: RNViewPropTypes.style,
    starStyle: RNViewPropTypes.style, // 自定义星星样式
    readOnly: RNPropTypes.bool, // 是否只读
    continuous: RNPropTypes.bool, // 是否允许滑动打分
    maximumValue: RNPropTypes.number.isRequired, // 最大值
    minimumValue: RNPropTypes.number.isRequired, // 最小值
    value: RNPropTypes.number, // 具体数值
    valueToFix: RNPropTypes.number, // 保留几位小数
    spacing: RNPropTypes.number.isRequired, // 分数
    allowsHalfStars: RNPropTypes.bool, // 是否允许半颗星
    accurateHalfStars: RNPropTypes.bool, // 是否允许精确值
    /* todo: 绘制星星图片
        starBorderColor: RNPropTypes.string, // 星星边线颜色
        starBorderWidth: RNPropTypes.number, // 星星边线宽度
        */
    emptyStarColor: RNPropTypes.string, // 空星填充色
    tintColor: RNPropTypes.string, // 着色(填充色)
    emptyStarImage: RNPropTypes.element, // 空星图片
    halfStarImage: RNPropTypes.element, // 半星图片
    filledStarImage: RNPropTypes.element, // 实星图片
    onStarValueChanged: RNPropTypes.func, // 数值改变时的回调函数
  };

  static defaultProps = {
    readOnly: true,
    maximumValue: 5,
    minimumValue: 0,
    value: 0,
    valueToFix: 1,
    spacing: 10,
    allowsHalfStars: false,
    accurateHalfStars: false,
  };

  constructor(props) {
    super(props);

    this.locationX = 0;
    this.locationY = 0;

    this.state = {
      maximumValue: this._validMaximumValue(),
      minimumValue: this._validMinimumValue(),
      value: this._validValue(this.props.value),
      containerStyle: {
        opacity: 1,
      },
      viewLayout: {},
    };
    this.timer = undefined;
  }

  // 创建手势
  _createPanResponder = () => {
    this._panResponder = PanResponder.create({
      /*
            * onStartShouldSetResponder与onMoveShouldSetResponder是以冒泡的形式调用的，即嵌套最深的节点最先调用。
            * 这意味着当多个View同时在*ShouldSetResponder中返回true时，最底层的View将优先“夺权”。
            * 在多数情况下这并没有什么问题，因为这样可以确保所有控件和按钮是可用的。
            * 但是有些时候，某个父View会希望能先成为响应者。我们可以利用“捕获期”来解决这一需求。
            * 响应系统在从最底层的组件开始冒泡之前，会首先执行一个“捕获期”，在此期间会触发on*ShouldSetResponderCapture系列事件。
            * 因此，如果某个父View想要在触摸操作开始时阻止子组件成为响应者，那就应该处理onStartShouldSetResponderCapture事件并返回true值。
            * View.props.onStartShouldSetResponderCapture: (evt) => true,
            * View.props.onMoveShouldSetResponderCapture: (evt) => true,
            */
      // 要求成为响应者：
      onStartShouldSetPanResponder: this._handleOnStartShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: this._handleOnStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder: this._handleOnMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture: this._handleOnMoveShouldSetPanResponderCapture,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！

        // gestureState.{x,y}0 现在会被设置为0
        StarLog('onPanResponderGrant');
        this._handlePanResponderGrant(evt, gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}

        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        StarLog('onPanResponderMove');
        this._handlePanResponderMove(evt, gestureState);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
        StarLog('onPanResponderRelease');
        this._handlePanResponderEnd(evt, gestureState);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        StarLog('onPanResponderTerminate');
        this._handlePanResponderEnd(evt, gestureState);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      },
    });
  }

  _handleOnStartShouldSetPanResponderCapture = (e: Object, gestureState: Object)=> {
    // OnStartShouldSetPanResponderCapture
    StarLog('_handleOnStartShouldSetPanResponderCapture');
    // return this.props.readOnly;
    return false;
  }
  _handleOnMoveShouldSetPanResponderCapture = (e: Object, gestureState: Object)=> {
    // OnMoveShouldSetPanResponderCapture
    StarLog('_handleOnMoveShouldSetPanResponderCapture');
    // if (!this.props.readOnly && this.props.continuous) return true;
    return false;
  }
  // 用户开始触摸屏幕的时候，是否愿意成为响应者；
  _handleOnStartShouldSetPanResponder = (e: Object, gestureState: Object)=> {
    // Should we become active when the user presses down on the circle?
    StarLog('_handleOnStartShouldSetPanResponder');
    return !this.props.readOnly;
  }
  // 在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互；
  _handleOnMoveShouldSetPanResponder = (e: Object, gestureState: Object)=> {
    // Should we become active when the user moves a touch over the circle?
    StarLog('_handleOnMoveShouldSetPanResponder');
    if (!this.props.readOnly && this.props.continuous) return true;
    return false;
  }
  // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
  _handlePanResponderGrant = (e: Object, gestureState: Object) => {
    StarLog('_handlePanResponderGrant');
    // this.locationX = e.nativeEvent.locationX;
    // this.locationY = e.nativeEvent.locationY;
    this.startLocationX = e.nativeEvent.pageX;
    this.startLocationY = e.nativeEvent.pageY;
    this.locationX = this.startLocationX;
    this.locationY = this.startLocationY;
    StarLog('start location x: ' + this.startLocationX);
    // this.setState({
    //     containerStyle: {
    //         opacity: 0.8, // 透明度改为 0.8
    //     },
    // })
  }
  // 最近一次的移动距离为gestureState.move{X,Y}
  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    StarLog('_handlePanResponderMove');
    // this.locationX += gestureState.dx;
    // this.locationY += gestureState.dy;
    this.locationX = this.startLocationX + gestureState.dx;
    this.locationY = this.startLocationY + gestureState.dy;
    let value = this._transFormStarValueByLocationX(this.locationX);
    if (this.props.continuous) {
      this._setValue(value);
      // fix value
      let valueFixed = this._getFixedValue(value);
      this.props.onStarValueChanged && this.props.onStarValueChanged(valueFixed);
    };

  }
  // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
  // 一般来说这意味着一个手势操作已经成功完成。
  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    StarLog('_handlePanResponderEnd');
    if (!this.props.readOnly) {
      let value = this._transFormStarValueByLocationX(this.locationX);
      this._setValue(value);
      // fix value
      let valueFixed = this._getFixedValue(value);
      this.props.onStarValueChanged && this.props.onStarValueChanged(valueFixed);
    };
    // this.setState({
    //     containerStyle: {
    //         opacity: 1, // 透明度恢复 1
    //     },
    // })
  }

  /* 组件的生命周期函数 */
  componentDidMount() {

  }

  componentWillMount() {
    this._createPanResponder();
  }
  componentWillUnmount(){
    clearTimeout(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    this._handleNextProps(nextProps);
  }

  /* 渲染组件 */
  render() {
    return <View
          {...this._panResponder.panHandlers}
          style={[styles.container, styles.starContainer, this.props.style]}
          ref='starRatingView'
          onLayout={(e: LayoutEvent) => {
              this.setState({
                  viewLayout: e.nativeEvent.layout,
              }, this._handleLayout(e));
          }}
      >
          {this._renderStarsView()}
      </View>;
  }

  _renderStarsView = () => {
    const { value } = this.state;
    const { allowsHalfStars, accurateHalfStars, spacing, starStyle, emptyStarColor, tintColor, emptyStarImage, filledStarImage, starWidth } = this.props;

    return (
      <StarsView
        allowsHalfStars={allowsHalfStars}
        accurateHalfStars={accurateHalfStars}
        spacing={spacing}
        starStyle={starStyle}
        emptyStarColor={emptyStarColor}
        tintColor={tintColor}
        emptyStarImage={emptyStarImage}
        filledStarImage={filledStarImage}
        starWidth={starWidth}
        value={value}
        validMaximumValue={this._validMaximumValue()}
      />
    );
  }

  _handleNextProps = (nextProps) => {
    let { maximumValue, minimumValue, value } = this.props;
    let changed = false;
    if (nextProps.maximumValue !== maximumValue) {
      maximumValue = nextProps.maximumValue;
      changed = true;
    }
    if (nextProps.minimumValue !== minimumValue) {
      minimumValue = nextProps.minimumValue;
      changed = true;
    }
    if (nextProps.value !== value) {
      value = nextProps.value;
      changed = true;
    }
    if (changed) {
      this.setState({
        maximumValue,
        minimumValue,
        value,
      });
    }
  }

  _handleLayout = (e: LayoutEvent) => {
    // 有可能测量的时机不对(过早)。。所以一个笨办法：延迟处理
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this._measure();
    }, 1000); // 延迟1s测量
  }

  _measure = () => {
    this.refs.starRatingView.measure((x, y, width, height, pageX, pageY) => {
      this.locationDiffX = pageX;
    });
  }

  // 获取星星尺寸大小
  _getStarSize = () => {
    if (!this.props.starStyle) {
      return {
        width: 16,
        height: 16,
      };
    }
    return {
      width: this.props.starWidth || 16,
      height: this.props.starStyle.height || 16,
    };
  }
  // 通过 LocationX 算出 star value
  _transFormStarValueByLocationX = (locationX) => {
    StarLog('_transFormStarValueByLocationX: ' + locationX);
    let actualLocationX = locationX - this.locationDiffX;
    let count = this.state.maximumValue;
    let containerWidth = count * this._getStarSize().width + this.props.spacing * (count - 1);
    let cellWidth = containerWidth / count;

    if (actualLocationX >= containerWidth) {
      return this.state.maximumValue;
    } else {
      let value = actualLocationX / cellWidth;
      if (this.props.allowsHalfStars) {
        if (this.props.accurateHalfStars) {
          value = value;
        }
        else {
          if (value+.5 < Math.ceil(value)) {
            value = Math.floor(value)+.5;
          } else {
            value = Math.ceil(value);
          }
        }
      } else {
        value = Math.ceil(value);
      }
      return value;
    }
  }
  // 保留几位小数
  _getFixedValue = (value: 0) => {
    // fix value
    value = Math.max(0, value);
    let valueFixed = value;
    if (this.props.allowsHalfStars) {
      if (this.props.accurateHalfStars) {
        valueFixed = Number(value.toFixed(this.props.valueToFix)); // toFixed 转成字符串了。。
      }
      else {
        if (value+.5 < Math.ceil(value)) {
          valueFixed = Math.floor(value)+.5;
        } else {
          valueFixed = Math.ceil(value);
        }
      }
    } else {
      valueFixed = Math.ceil(value);
    }

    return valueFixed;
  }

  // 有效最小值
  _validMinimumValue = (minimumValue) => {
    if (!minimumValue) {
      minimumValue = this.props.minimumValue;
    }
    return Math.floor(Math.max(0, minimumValue));
  }
  // 有效最大值
  _validMaximumValue = (maximumValue) => {
    if (!maximumValue) {
      maximumValue = this.props.maximumValue;
    }
    return Math.ceil(Math.max(this._validMinimumValue(), maximumValue));
  }
  // 有效值
  _validValue = (value) => {
    return Math.min(Math.max(value, this._validMinimumValue()), this._validMaximumValue());
  }
  // 设置 value
  _setValue = (value) => {
    StarLog('_setValue: ' + value);
    if (value !== this.state.value && value <= this._validMaximumValue() && value >= this._validMinimumValue()) {
      this.setState({
        value,
      });
    }
  }
}
