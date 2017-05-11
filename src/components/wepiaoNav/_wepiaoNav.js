import cx from 'classnames'
import ReactDom from 'react-dom'
class WepiaoNav extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      menuStatus: false,
    }
  }

  handleClose() {
    he('send', 'event', 'home', 'click', 'home')
    this.setState({
      menuStatus: !this.state.menuStatus,
    })
  }

  handleHome() {
    he('send', 'event', 'home', 'click', 'home_home')
  }

  handleCinema() {
    he('send', 'event', 'home', 'click', 'home_cinema')
  }

  handleShopping() {
    he('send', 'event', 'home', 'click', 'home_shopping')
  }

  handleMy() {
    he('send', 'event', 'home', 'click', 'home_my')
  }

  componentDidMount() {
    $('body').click((e) => {
      const thisTarget = !$(e.target).parents('.wxmovie-nav').length
      if (this.state.menuStatus && thisTarget) {
        this.setState({
          menuStatus: false,
        })
      }
    })
  }

  render() {
    let classnames = cx("nav-stretch wxmovie-nav", {
      "current": this.state.menuStatus
    })

    return (
      <div className={classnames}>
        <h4>
          <a href="javascript:void(0);" className = "close"  onClick={this.handleClose.bind(this)}>
          <i className = "ico-home" ></i>
          </a>
        </h4>
        <ul>
          <li>
            <a href="http://wx.wepiao.com/index.html?showwxpaytitle=1" onClick={this.handleHome.bind(this)}>
              <i className = "ico-home" ></i>
              首页
            </a>
          </li>
          <li>
            <a href="http://wx.wepiao.com/cinema_list.html"  onClick={this.handleCinema.bind(this)}>
              <i className = "ico-cinema"></i>
              影院
            </a>
          </li>
          <li>
            <a href="http://store.wepiao.com/index.php/wap/?referrer=movie" onClick={this.handleShopping.bind(this)}>
              <i className = "ico-gift" ></i>
              商城
            </a>
          </li>
          <li>
            <a href="http://wx.wepiao.com/movie_oz_my.html" className = "need-login" onClick={this.handleMy.bind(this)}>
              <i className = "ico-my"></i>
              我的
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

export default WepiaoNav
