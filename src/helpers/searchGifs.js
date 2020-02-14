const giphy = require('giphy-api')('2VHjBw7fIprfJDcVUNgRtPHfNurEw6nB');

const searchGifs = async query => {
  const res = await giphy.search(query);
  const gifs = res.data.map(item => {
    return {
      id: item.id,
      url: item.images.preview_gif.url,
    };
  });
  return gifs;
};

export default searchGifs;
