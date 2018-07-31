import React, { PureComponent } from 'react';
import { View } from 'react-native';

import StarView from './StarView';

import styles from './styles';

class StarsView extends PureComponent {
  render() {
    const {
      value, allowsHalfStars, accurateHalfStars, spacing, starStyle,
      emptyStarColor, tintColor, emptyStarImage, filledStarImage, starWidth,
      validMaximumValue,
    } = this.props;

    const stars = [];
    for (let idx = 0; idx < validMaximumValue; idx++) {
      const highlighted = (idx + 1 <= Math.ceil(value));

      let renderProgress = 0;
      if (allowsHalfStars && highlighted && (idx + 1 > value)) {
        if (accurateHalfStars) {
          renderProgress = value - idx;
        } else {
          renderProgress = 0.5;
        }
      } else {
        renderProgress = highlighted ? 1 : 0;
      }

      stars.push(
        <StarView
          key={`StarView_id_${idx}`}
          style={[starStyle, { marginRight: spacing }]}
          emptyStarColor={emptyStarColor}
          tintColor={tintColor}
          emptyStarImage={emptyStarImage}
          filledStarImage={filledStarImage}
          progress={renderProgress}
          starWidth={starWidth}
        />
      );
    }

    return (
      <View style={styles.starContainer}>
        {stars}
      </View>
    );
  }
}

export default StarsView;
