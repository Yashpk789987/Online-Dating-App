import ImagePicker from 'react-native-image-picker';

const openImagePicker = async (title, path) => {
  let uri: '';
  const options = {
    title: title,
    storageOptions: {
      skipBackup: true,
      path: path, ///// 'images',
    },
  };

  return new Promise((resolve, reject) => {
    try {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          reject({ok: false, error: 'User cancelled image picker'});
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          reject({ok: false, error: 'User cancelled image picker'});
        } else {
          const source = {uri: response.uri};
          uri = response.uri;
          resolve({uri: uri, ok: true});
        }
      });
    } catch (error) {
      reject({ok: false, error: error});
    }
  });
};

export {openImagePicker};
