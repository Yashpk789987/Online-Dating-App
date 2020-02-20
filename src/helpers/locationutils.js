import Geocoder from 'react-native-geocoding';
Geocoder.init('AIzaSyBRYqiA-p-B_zdWU5N4ac7DgEDWFWmZFlM');

const getAddressFromLatAndLong = async ({latitude, longitude}) => {
  try {
    let json = await Geocoder.from(latitude, longitude);
    var addressComponent = json.results[0].address_components[0];
    return {ok: true, address: addressComponent.short_name};
  } catch (error) {
    return {ok: false, error};
  }
};

export {getAddressFromLatAndLong};
