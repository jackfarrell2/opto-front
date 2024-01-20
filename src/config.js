const api = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_API_URL_DEV
  : process.env.REACT_APP_API_URL_PROD;

const config = {
    apiUrl: api
};

export default config;