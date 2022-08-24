import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import Modal from 'react-native-modal';

import { Text } from '../../common';

import { useIsPeriodDay } from '../../../libs/hooks';
import { baseUrl, COLORS, rh, rw } from '../../../configs';

const VideoPlayerModal = ({ visible, closeModal, video }) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.3}
      backdropTransitionOutTiming={1}
      animationOutTiming={0}
      animationInTiming={0}
      onBackdropPress={() => closeModal()}
      animationIn="zoomIn"
      animationOut="slideOutDown"
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
        }}>
        <VideoPlayer
          video={{
            uri: baseUrl + video,
          }}
          videoWidth={1600}
          videoHeight={900}
          autoplay
          customStyles={{
            wrapper: {
              width: '95%',
              height: '100%',
              justifyContent: 'center',
            },
          }}
          disableFullscreen={false}
        />
      </View>
      <Pressable style={styles.footer} onPress={closeModal}>
        <Text color="white" medium>
          بستن
        </Text>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    width: rw(100),
    height: '100%',
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: rh(6),
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  modalContent: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    marginTop: 'auto',
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
