/* app controller

  The app controller will be responsible for rendering the skeleton template
  component of the application on login.
============================================================================= */

import path from 'path';
import { Router } from 'express';
import { blockNonAuthUsers } from '../../../middleware/blockNonAuthUsers.js';

import dashboardRouter from './dashboard.js';
import loginRouter     from './login.js';
import logoutRouter    from './logout.js';
import verifyRouter    from './verify.js';
import registerRouter  from './register.js';
import unlockRouter    from './unlock.js';
import resetRouter     from './reset.js';

const router = Router();

/* app routes
============================================================================= */

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

router.use('/reset', resetRouter);
router.use('/unlock', unlockRouter);
router.use('/verify', verifyRouter);

router.use('/register', registerRouter);
router.use('/dashboard', dashboardRouter);

router.get('/',
  blockNonAuthUsers,
  getLogic,
);

/* logic
============================================================================= */

/** get current file name and remove extension */
const fileName = path.basename(__filename).slice(0, -3);

/**
 * FIXME: Render the skeleton template.
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
      'scripts/app/init.js'
    ],
    flash:   res.locals.flash,
    session: req.session,
  };

  return res.render('app/index' , view);
}

export default router;
