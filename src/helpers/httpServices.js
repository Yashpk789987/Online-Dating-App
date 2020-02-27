import baseurl from './baseurl';
import {getFromCache, removeFromCache} from './cacheTools';
import {getDataFromToken} from './tokenutils';
import axios from 'axios';

const getData = async url => {
  try {
    const token = await getFromCache('token');
    const response = await fetch(`${baseurl}/${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        auth: JSON.parse(token),
      },
    });
    const result = await response.json();

    if (result.ok === false && result.code !== undefined && result.code === 'auth_failed') {
      alert('Session Expired\nPlease Login Again');
      await removeFromCache('token');
      return null;
    } else {
      return result;
    }
    return result;
  } catch (e) {
    console.log(url, e);
  }
};

const postData = async (url, body) => {
  try {
    const token = await getFromCache('token');
    const response = await fetch(`${baseurl}/${url}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        auth: JSON.parse(token),
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (result.ok === false && result.code !== undefined && result.code === 'auth_failed') {
      alert('Session Expired\nPlease Login Again');
      await removeFromCache('token');
      return null;
    } else {
      return result;
    }
    return result;
  } catch (e) {
    console.log(url, e);
  }
};

const uploadImage = async (url, body, uploadProgress = e => {}) => {
  try {
    var photo = {
      uri: body.pic.uri,
      type: body.pic.type,
      name: 'pic',
    };

    const token = await getFromCache('token');
    var form = new FormData();
    form.append('pic', photo);
    form.append('is_profile', body.is_profile);
    const result2 = await getDataFromToken();
    const {ok, data} = result2;
    if (ok) {
      form.append('userId', data.id);
    }
    const result = await axios.post(`${baseurl}/${url}`, form, {
      onUploadProgress: e => {
        uploadProgress(e);
      },
      headers: {
        auth: token,
      },
    });

    if (result.data.ok === false && result.data.code !== undefined && result.data.code === 'auth_failed') {
      alert('Session Expired\nPlease Login Again');
      await removeFromCache('token');
      return null;
    }
    return result.data;
  } catch (e) {
    console.log(url, e);
  }
};

const postDataWithoutToken = async (url, body) => {
  try {
    const response = await fetch(`${baseurl}/${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    return result;
  } catch (e) {
    console.log(url, e);
    return result;
  }
};

export {getData, postData, postDataWithoutToken, uploadImage};

//  const response = await fetch(`${baseurl}/${url}`, {
//       method: 'GET', // *GET, POST, PUT, DELETE, etc.
//       mode: 'cors', // no-cors, cors, *same-origin
//       // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       // credentials: 'same-origin', // include, *same-origin, omit
//       headers: {
//         'Content-Type': 'application/json',
//         auth: token,
//       },
//     });
