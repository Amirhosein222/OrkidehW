import { useState } from 'react';

export default function useApi(apiFunction) {
  const [response, setResponse] = useState({
    data: null,
    isFetching: false,
    error: null,
    isSuccess: null,
    errorCode: null,
  });

  const fetchMethod = () => {
    setResponse({
      data: null,
      isFetching: true,
      error: null,
      isSuccess: null,
      errorCode: null,
    });

    apiFunction()
      .then((res) => {
        setResponse({
          // ...response,
          data: res,
          isFetching: false,
          isSuccess: true,
        });
      })
      .catch((err) => {
        setResponse({
          // ...response,
          isFetching: false,
          error: err.message,
          isSuccess: false,
          errorCode: err.response.status,
        });
      });
  };

  return [response, fetchMethod];
}
