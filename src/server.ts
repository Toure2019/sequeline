import errorsHandler from './middleware/errors'

import app from './app'

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorsHandler)

/**
 * Start Express server.
 */
const server = app
  .listen(app.get('port'), () => {
    console.log(
      '  App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    )
    console.log('  Press CTRL-C to stop\n')
  })
  .setTimeout(3600000) // Prevent the app to reload the process before finishing (1 hour)

export default server
