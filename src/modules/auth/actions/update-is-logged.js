export const UPDATE_IS_LOGGED = 'UPDATE_IS_LOGGED';

export const updateIsLogged = isLogged => dispatch => {
  console.log('called -- ', isLogged);
  return {
    type: UPDATE_IS_LOGGED,
    data: {
      isLogged
    }
  };
};
