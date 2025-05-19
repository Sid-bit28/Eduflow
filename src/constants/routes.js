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
  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
};

export default ROUTES;
