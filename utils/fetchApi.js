import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com';

export const fetchApi = async (url) => {
  const { data } = await axios.get((url), {
    headers: {
      'x-rapidapi-host': 'bayut.p.rapidapi.com',
      'x-rapidapi-key': '9afb30f860mshab96c79d0276a8bp1be617jsn188aab22a47e' ,
    },
  });
    
  return data;
}