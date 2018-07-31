import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 1,
  },
  star: {
    width: 16,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  absoluteStar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 16,
    overflow: 'hidden',
  },
  starImage: {
    flex: 1,
    textAlign: 'center',
  },
});
