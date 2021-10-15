//! menu for dashboard
// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS_DASHBOARD = ''

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    pageOne: path(ROOTS_DASHBOARD, '/dashboard/one'),
    pageTwo: path(ROOTS_DASHBOARD, '/dashboard/two'),
    pageThree: path(ROOTS_DASHBOARD, '/dashboard/three'),
    pageFour: path(ROOTS_DASHBOARD, '/dashboard/account'),
    pageFive: path(ROOTS_DASHBOARD, '/dashboard/cart'),
    pageSix: path(ROOTS_DASHBOARD, '/dashboard/contact'),
  },
  app: {
    root: path(ROOTS_DASHBOARD, '/dashboard/app'),
    pageFour: path(ROOTS_DASHBOARD, '/dashboard/app/four'),
    pageFive: path(ROOTS_DASHBOARD, '/dashboard/app/five'),
    pageSix: path(ROOTS_DASHBOARD, '/dashboard/app/six'),
    pageSeven: path(ROOTS_DASHBOARD, '/dashboard/new'),
    pageEight: path(ROOTS_DASHBOARD, '/dashboard/pre-owned'),
  },
}
