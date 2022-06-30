import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { Modal } from 'react-native-modal';

import { useIsPeriodDay } from '../../../libs/hooks';
import { COLORS, rh, rw } from '../../../configs';

const VideoPlayerModal = ({ visible, closeModal }) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0}
      backdropTransitionOutTiming={1}
      animationOutTiming={0}
      animationInTiming={0}
      onBackdropPress={() => closeModal()}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: isPeriodDay ? COLORS.rossoCorsa : COLORS.pink,
        }}>
        <Text>VideoPlayerModal</Text>
        <VideoPlayer
          video={{
            uri:
              'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          videoWidth={1600}
          videoHeight={900}
          thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
  },
  header: {
    marginTop: rh(3),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  closeIcon: {
    marginRight: rw(6),
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    height: '50%',
    elevation: 5,
    alignItems: 'center',
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
    margin: 10,
  },
  btn: { width: '40%', height: 40, margin: 20, alignSelf: 'center' },
});

export default VideoPlayerModal;
