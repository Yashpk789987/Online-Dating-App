import AsyncStorage from '@react-native-community/async-storage';

const getFromCache = async key => {
  try {
    if (!key) return false;
    const result = await AsyncStorage.getItem(key);
    if (typeof result == 'string') return result;
    return result ? JSON.parse(result) : false;
  } catch (e) {
    console.log('Async Service get', e);
    return false;
  }
};

const putInCache = async (key, value) => {
  if (!(key && value)) return false;
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.log('Async Service put', e);
    return false;
  }
};

const changeInCache = async (key, newValue) => {
  if (!(key && newValue)) return false;
  try {
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
    return true;
  } catch (e) {
    console.log('Async Service change', e);
    return false;
  }
};

const removeFromCache = async key => {
  try {
    if (!key) return false;
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log('Async Service get', e);
    return false;
  }
};

export {getFromCache, putInCache, changeInCache, removeFromCache};
