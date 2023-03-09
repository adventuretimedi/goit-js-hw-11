import axios from 'axios';
export async function fetchImages(term, page = 1) {
  try {
    const response = await axios.get(
        `https://pixabay.com/api/?key=34263034-e023978e9227905632f4b2f16&q=${term}
      &image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );

    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
