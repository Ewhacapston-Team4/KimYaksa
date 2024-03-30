import { Button, View, StyleSheet, Alert } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState, useEffect } from "react";

function ImagePicker({ onImagePicked }) {
  const [pickedImage, setPickedImage] = useState();
  const [cameraPersmissionInformation, requestPermission] =
    useCameraPermissions();

  useEffect(() => {
    if (pickedImage) {
    }
  }, []);

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

  async function takeImageHandler() {
    const hasPermssion = await verifyPermissions();

    if (!hasPermssion) {
      return;
    }

    const image = await launchCameraAsync({ aspect: [16, 21], quality: 1 });
    console.log(image.assets[0].uri);
    setPickedImage(image.assets[0].uri);
    onImagePicked(image.assets[0].uri);
  }

  return (
    <View>
      <Button title="사진 찍기" onPress={takeImageHandler} />
      <Button title="갤러리에서 고르기" />
    </View>
  );
}

export default ImagePicker;
