import baseurl from './baseurl';

const searchGifs = async query => {
  try {
    const response = await fetch(`${baseurl}/user/gifs/${query}`);
    let result = await response.json();
    if (result.ok) {
      const gifs = result.data.data.map(item => {
        return {
          id: item.id,
          url: item.images.preview_gif.url,
        };
      });
      return gifs;
    } else {
      alert('Technical Error ');
    }
  } catch (error) {
    alert(error);
  }
};

export default searchGifs;
