import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getAccessTokenCookie = () => {
  return cookies.get('access_token');
};
