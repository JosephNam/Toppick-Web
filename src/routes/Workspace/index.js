import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'workspace',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const InterviewKit = require('./containers/WorkspaceContainer').default
      const reducer = require('./modules/workspace').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'workspace', reducer })

      /*  Return getComponent   */
      cb(null, InterviewKit)

    /* Webpack named bundle   */
    }, 'Workspace')
  }
})
