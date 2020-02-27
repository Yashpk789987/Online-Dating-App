import decode from 'jwt-decode';
import {getFromCache, removeFromCache} from './cacheTools';

const getDataFromToken = async () => {
  try {
    let token = await getFromCache('token');
    let data = decode(token);
    return {ok: true, data: data};
  } catch (error) {
    alert('Session Expired\nPlease Login Again');
    await removeFromCache('token');
    return {ok: false, error};
  }
};

export {getDataFromToken};
