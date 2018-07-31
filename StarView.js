import React, { PureComponent } from 'react';
import { View, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

import styles from './styles';

const RNViewPropTypes = ViewPropTypes || View.propTypes;
const RNPropTypes = PropTypes || React.PropTypes;


export default class StarView extends PureComponent {
  static propTypes = {
    progress: RNPropTypes.number.isRequired, // 占比
    /* todo: 绘制星星图片
        starBorderColor: RNPropTypes.string, // 星星边线颜色
        starBorderWidth: RNPropTypes.number, // 星星边线宽度
        */
    emptyStarColor: RNPropTypes.string, // 空星填充色
    tintColor: RNPropTypes.string, // 着色(填充色)
    emptyStarImage: RNPropTypes.element, // 空星图片
    halfStarImage: RNPropTypes.element, // 半星图片
    filledStarImage: RNPropTypes.element, // 实星图片
  };

  static defaultProps = {
    progress: 0,
    emptyStarColor: '#999',
    tintColor: '#ffb819',
  };

  constructor(props) {
    super(props);

    this.state = {
      progress: Math.min(Math.max(0, this.props.progress), 1),
    };
  }

  /* 组件的生命周期函数 */
  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    this._handleNextProps(nextProps);
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   if (nextProps.style ) {

  //   }
  // }

  _handleNextProps = (nextProps) => {
    let { progress } = this.props;
    if (nextProps.progress !== progress) {
      progress = nextProps.progress;
      this.setState({
        progress,
      });
    }
  }

  /* 渲染组件 */
  render = () => {
    let { progress } = this.state;
    let { style, emptyStarImage, filledStarImage, emptyStarColor, tintColor, starWidth } = this.props;
    let defaultStarStyle = {
      width: 16,
      height: 16,
    };
    // let starStyleMerge = null;
    // if (Array.isArray(style)) {
    //   style.map((item, index) => {
    //     starStyleMerge = {
    //       ...starStyleMerge,
    //       ...item,
    //     };
    //   });
    // } else {
    //   starStyleMerge = {
    //     ...style,
    //   };
    // }
    // starStyleMerge = {
    //   ...defaultStarStyle,
    //   ...starStyleMerge,
    // };
    // 星星宽度
    // const starWidth = Math.max(0, starWidth);
    if (!emptyStarImage) {
      emptyStarImage = <Icon style={styles.starImage} name="star-o" size={starWidth} color={emptyStarColor} />;
    }
    if (!filledStarImage) {
      filledStarImage = <Icon style={styles.starImage} name="star" size={starWidth} color={tintColor} />;
    }

    return (
      <View style={[styles.star, defaultStarStyle, style]}>
        <View style={[styles.star, defaultStarStyle, style]}>
          {emptyStarImage}
        </View>
        <View
          /**
            * removeClippedSubviews bool
            * 这是一个特殊的性能相关的属性，由RCTView导出。在制作滑动控件时，如果控件有很多不在屏幕内的子视图，会非常有用。
            * 要让此属性生效，首先要求视图有很多超出范围的子视图，并且子视图和容器视图（或它的某个祖先视图）都应该有样式overflow: hidden。
            */
          removeClippedSubviews={true} // 兼容Android
          style={[styles.absoluteStar, defaultStarStyle, style, { width: starWidth * progress }]}
        >
          {filledStarImage}
        </View>
      </View>
    );
  }
}
