export const getAvatarName = name => {
  const result = name?.split(' ');
  let display = '';
  if (result?.length > 1) {
    display = result?.[0]?.[0] + result?.[1]?.[0];
  } else display = result?.[0]?.[0];
  return display;
};
