export const toUserError = (error: Error) => {
  return error ? error.message : 'Unknown error';
};
