import '../scss/base.scss'
window.$ = require('zepto-modules')
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { createHashHistory } from 'history'
import { Router, Route, useRouterHistory } from 'react-router'
import configureStore from 'app/store/configureStore'
import { syncHistoryWithStore } from 'react-router-redux'
// import { channelId } from 'utils/_configure'
import { getParam, isApp } from 'utils/_utils'

import Home from 'react-proxy?name=home!./home'
import Comment from 'react-proxy?name=comment!./comment'

const routes = (history) => (
  <Router history={history}>
    <Route path="/" component={Home} />
    <Route path="/comment" component={Comment} />
  </Router>
)


const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
const store = configureStore(appHistory)
const history = syncHistoryWithStore(appHistory, store)

// const classifyId = getParam('f_type')

// if (channelId === '3' && window.location.search.includes('f_type') ) {
// 	const classifyList = $('#classifyTitle').html()
//   if (classifyList) {
//     const classify = JSON.parse(classifyList)
//   }
// 	document.title = classify[classifyId]
// }

ReactDom.render(
  <Provider store={store}>
    { routes(history) }
  </Provider>, document.getElementById('app')
)
