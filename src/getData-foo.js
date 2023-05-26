import axios from 'axios';
import { optionsHTTP } from './options-HTTP';

const { baseUrl, key, image_type, orientation, safesearch, perPage } =
  optionsHTTP;

export const getPhotos = async (input, page) => {
  try {
    const response = await axios.get(
      `${baseUrl}?key=${key}&q=${input}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=${perPage}&page=${page}`
    );
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    return { hits, totalHits };
  } catch (error) {
    console.log('ERROR:', error.message);
  }
};
