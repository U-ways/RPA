/* web app controller
============================================================================= */

import path from 'path';
import { Router } from 'express';
import { blockNonAuthUsers } from '../../../middleware/blockNonAuthUsers.js';

/** web app auth */
import loginRouter     from './auth/login.js';
import logoutRouter    from './auth/logout.js';
import verifyRouter    from './auth/verify.js';
import registerRouter  from './auth/register.js';
import unlockRouter    from './auth/unlock.js';
import resetRouter     from './auth/reset.js';

/** web app sections */
import dashboardRouter from './section/dashboard.js';
import databaseRouter  from './section/database.js';
import compareRouter   from './section/compare.js';
import graphiqlRouter  from './section/graphiql.js';
import settingsRouter  from './section/settings.js';

const router = Router();

/* web app routes
============================================================================= */

router.use('/login',    loginRouter);
router.use('/logout',   logoutRouter);
router.use('/reset',    resetRouter);
router.use('/unlock',   unlockRouter);
router.use('/verify',   verifyRouter);
router.use('/register', registerRouter);

router.use('/dashboard', dashboardRouter);
router.use('/database',  databaseRouter);
router.use('/compare',   compareRouter);
router.use('/graphiql',  graphiqlRouter);
router.use('/settings',  settingsRouter);

router.get('/',
  blockNonAuthUsers,
  getLogic,
);

/* logic
============================================================================= */

/** get current file name and remove extension */
const fileName = path.basename(__filename).slice(0, -3);

/**
 * Renders the skeleton template for the web app.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render dashboard on success, error resposne otherwise
 */
function getLogic (req, res, next) {
  let view = {
    title:   fileName,
    scripts: [
      `scripts/app/${fileName}.js`
    ],
    flash:   res.locals.flash,
    session: req.session,
  };

  return res.render('app/index' , view);
}

export default router;
