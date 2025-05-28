const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ASK_QUESTION: '/ask-question',
  COLLECTION: '/collection',
  COMMUNITY: '/community',
  TAGS: '/tags',
  JOBS: '/jobs',
  PROFILE: id => `/profile/${id}`,
  QUESTION: id => `/questions/${id}`,
  TAG: id => `/tags/${id}`,
};

export default ROUTES;
