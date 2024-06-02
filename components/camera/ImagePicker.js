import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
  launchImageLibraryAsync,
  PermissionStatus,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { StaticCollage } from "react-native-images-collage";
import ViewShot from "react-native-view-shot";

import BasicButton from "../../ui/BasicButton";

function ImagePicker({ onImagePicked, navigation }) {
  const [pickedImage, setPickedImage] = useState();
  const [firstImage, setFirstImage] = useState();
  const [secondImage, setSecondImage] = useState();
  const [galleryPersmissionInformation, galleryRequestPermission] =
    useMediaLibraryPermissions();
  const [cameraPersmissionInformation, requestPermission] =
    useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const ref = useRef();

  useEffect(() => {
    if (secondImage) {
      setModalVisible(true);
      if (ref.current) {
        ref.current.capture().then((uri) => {
          setPickedImage(uri);
        });
      }
    }
  }, [secondImage]);

  async function verifyPermissions() {
    if (cameraPersmissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPersmissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "사진 촬영 불가",
        "설정에서 카메라 사용 권한을 설정해주세요."
      );
      return false;
    }
    return true;
  }

  let image;
  async function takeImageHandler(mode) {
    let fstImage;
    let sndImage;
    if (mode === "gallery") {
      await requestMediaLibraryPermissionsAsync();
      fstImage = await launchImageLibraryAsync({
        aspect: [1, 1],
        quality: 1,
      });
      sndImage = await launchImageLibraryAsync({
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      const hasPermssion = await verifyPermissions();

      if (!hasPermssion) {
        return;
      }
      fstImage = await launchCameraAsync({ aspect: [1, 1], quality: 1 });
      sndImage = await launchCameraAsync({ aspect: [1, 1], quality: 1 });
    }
    setFirstImage(fstImage.assets[0].uri);
    setSecondImage(sndImage.assets[0].uri);
    //setPickedImage(image.assets[0].uri);
    //onImagePicked(image.assets[0].uri); //여기 주석 처리
  }

  const finishEditing = () => {
    onImagePicked(pickedImage);
    setModalVisible(false);
  };

  return (
    <View>
      <BasicButton title="사진 찍기" onPress={takeImageHandler} />
      <BasicButton
        title="갤러리에서 고르기"
        onPress={() => takeImageHandler("gallery")}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* <Image style={styles.image} source={{ uri: firstImage }} />
              <Image style={styles.image} source={{ uri: secondImage }} /> */}
              {/* <Image style={styles.image} source={{ uri: pickedImage }} /> */}
              <View style={{ alignItems: "center" }}>
                <ViewShot
                  ref={ref}
                  options={{
                    fileName: "newImage",
                    format: "jpg",
                    quality: 1.0,
                  }}
                >
                  <StaticCollage
                    width={360}
                    height={180}
                    images={[firstImage, secondImage]}
                    matrix={[1, 1]}
                    containerStyle={{ borderWidth: 0 }}
                    seperatorStyle={{
                      borderWidth: 0,
                    }}
                  />
                </ViewShot>
              </View>
              <BasicButton
                onPress={finishEditing}
                style={{ marginTop: 30 }}
                title="선택 완료"
              />
              <BasicButton title="다시 촬영" />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  image: { width: "100%", height: 180, alignContent: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // 화면 하단 정렬
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명한 배경색
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 30,
    borderRadius: 10,
    height: "50%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
