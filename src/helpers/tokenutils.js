import decode from 'jwt-decode';
import {getFromCache} from './cacheTools';

const getDataFromToken = async () => {
  try {
    let token = await getFromCache('token');
    let data = decode(token);
    return {ok: true, data: data};
  } catch (error) {
    return {ok: false, error};
  }
};

export {getDataFromToken};
