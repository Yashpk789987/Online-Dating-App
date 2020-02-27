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
          reject({ok: false, error: 'No Image Selected'});
        } else if (response.error) {
          console.log('Some other problem occured', response.error);
          reject({ok: false, error: 'Some other problem occured'});
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
