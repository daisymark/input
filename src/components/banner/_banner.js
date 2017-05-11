import './style.scss'
import { getParam } from 'utils/_utils'
import { channelId } from 'utils/_configure'
import { isApp } from 'utils/_utils'

class Banner extends React.Component {
  constructor(props) {
    super(props)
  }

  renderTopNav() {
    if (getParam('share') === '1') {
      return (
        <div className="nav-topnav">
            <h4></h4>
            <ul>
              <li><a href="http://wx.wepiao.com/index.html">电影票</a ></li>
              <li><a href="http://wechat.show.wepiao.com/">演出票</a ></li>
              <li><a href="http://sports.wepiao.com/wechat/">赛事票</a ></li>
            </ul>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="banner">
        {this.renderTopNav()}
      </div>
    )
  }
}

export default Banner
