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
  renderEmptyStar = () => {
    const { emptyStarImage, starWidth, emptyStarColor } = this.props;

    if (!emptyStarImage) {
      return <Icon style={styles.starImage} name="star-o" size={starWidth} color={emptyStarColor} />;
    }

    return emptyStarImage;
  }

  renderFullStar = () => {
    const { filledStarImage, starWidth, tintColor } = this.props;

    if (!filledStarImage) {
      return <Icon style={styles.starImage} name="star" size={starWidth} color={tintColor} />;
    }

    return filledStarImage;
  }

  renderHalfStar = () => {
    let { progress, style, emptyStarImage, filledStarImage, emptyStarColor, tintColor, starWidth } = this.props;
    let defaultStarStyle = {
      width: 16,
      height: 16,
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.star, defaultStarStyle, style]}>
          {this.renderEmptyStar()}
        </View>
        <View
          /**
            * removeClippedSubviews bool
            * 这是一个特殊的性能相关的属性，由RCTView导出。在制作滑动控件时，如果控件有很多不在屏幕内的子视图，会非常有用。
            * 要让此属性生效，首先要求视图有很多超出范围的子视图，并且子视图和容器视图（或它的某个祖先视图）都应该有样式overflow: hidden。
            */
          // removeClippedSubviews={true} // 兼容Android
          style={[styles.absoluteStar, defaultStarStyle, style, { width: starWidth * progress }]}
        >
          {this.renderFullStar()}
        </View>
      </View>
    );
  }

  renderStar = () => {
    const { progress, style } = this.props;

    if (progress === 1) {
      return (
        <View style={[styles.star, style]}>
          {this.renderFullStar()}
        </View>
      );
    } else if (progress === 0) {
      return (
        <View style={[styles.star, style]}>
          {this.renderEmptyStar()}
        </View>
      );
      // return this.renderEmptyStar();
    }

    return this.renderHalfStar();
  }

  /* 渲染组件 */
  render = () => {
    // let { progress } = this.state;
    let { progress, style, emptyStarImage, filledStarImage, emptyStarColor, tintColor, starWidth } = this.props;
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
    // if (!emptyStarImage) {
    //   emptyStarImage = <Icon style={styles.starImage} name="star-o" size={starWidth} color={emptyStarColor} />;
    // }
    // if (!filledStarImage) {
    //   filledStarImage = <Icon style={styles.starImage} name="star" size={starWidth} color={tintColor} />;
    // }

    // if (progress === 1) {
    //   return this.renderFullStar();
    // } else if (progress === 0) {
    //   return this.renderEmptyStar();
    // }

    // return this.renderHalfStar();

    return (
      <View style={[styles.star, style]}>
        {this.renderStar()}
      </View>
    );
  }
}
