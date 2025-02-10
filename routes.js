// Define routes
const mainRoutes = [
  { path: '/', component: 'HomePage', css: ['home'] },
  { path: '/profile', component: 'ProfilePage', css: ['profile'] },
  { path: '/predict', component: 'PredictPage', css: ['predict'] },
  { path: '/myTeam', component: 'MyTeamPage', css: ['myTeam'] },
  { path: '/settings', component: 'SettingsPage', css: ['settings'] },
  { path: '/privacy', component: 'PrivacyPage', css: ['privacy'] },
  { path: '/signIn', component: 'SignInPage', css: ['signIn'] },
  { path: '/signUp', component: 'SignUpPage', css: ['signUp'] },
  {
    path: '/changePassword',
    component: 'ChangePasswordPage',
    css: ['changePassword'],
  },
  { path: '/followers', component: 'FollowersPage', css: ['followers'] },
  { path: '/followings', component: 'FollowingsPage', css: ['followings'] },
  { path: '/search', component: 'SearchPage', css: ['search'] },
];

// notFound Page route
const notFoundRoute = {
  path: '/404',
  component: 'NotFoundPage',
  css: ['notFound'],
};

export { mainRoutes, notFoundRoute };
