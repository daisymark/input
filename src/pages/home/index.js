import './style'
import Header from './components/_header'
import Footer from './components/_footer'
import { Fixer, Banner } from 'src/components/index'
import { connect } from 'react-redux'
import ShareMask from 'src/components/shareMask/_shareMask'
import { showMask } from 'src/app/actions/index'
import { channelId, activeId , movieCard, qrData, iCopyright } from 'utils/_configure'
import { initShare } from 'utils/_share'
import { init, isWx, isQQ,isApp, isAuthorize, updateTime} from 'utils/_utils'
import { appShare } from 'utils/_appShare'
import { getToken } from 'utils/_getToken'
import cookie from 'js-cookie'
import classnames from 'classnames'

let token
if (!cookie.get('token') || isApp()) {
  token = getToken()
} else {
  token = cookie.get('token')
}

function mapStateToProps(state) {
  return {
    maskStatus: state.shareMask.maskStatus,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showMask: (maskStatus) => dispatch(showMask(maskStatus)),
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: token,
      qrShow: false
    }
    init()
    if ( isWx() || isQQ() ) { //3是微信的渠道号，28是QQ的渠道号
      initShare()
      const getCode = setInterval(() => {
        if (!token) {
          token = cookie.get('token')
        }else {
          this.setState({
            token: token
          })
          clearInterval(getCode)
        }
      }, 100)
    }
    if (isApp()) {
      appShare()
    }
  }

  handleMovieClick() {
    he('send', 'event', 'explore_detail', 'click', 'card_button', activeId)
    let movie_url = 'wxmovie://filmdetail?movieid=' + movieCard.id
    if (isWx()) {
      movie_url = '//wx.wepiao.com/movie_detail.html?movie_id=' + movieCard.id
    }else if (isQQ()) {
      movie_url = '//mqq.wepiao.com/#/movies/' + movieCard.id
    }
    window.location.replace(movie_url)
  }

  componentDidMount() {
    const articleHtml = document.getElementById('article_main').innerHTML
    document.getElementById('article').innerHTML = articleHtml

    //当链接有时间参数（update_time）的时候获取参数写进文章里，没有删掉这个结构。
    if (updateTime() && document.getElementById('article').querySelector('.update-time')) {
      document.getElementById('article').querySelector('.update-time').innerHTML = updateTime()  // 需要后端直接传值到html里，可忽略此赋值 TODO
    }else if (document.getElementById('article').querySelector('.icon-clock')) {
      document.getElementById('article').querySelector('.icon-clock').remove()
    }

    if (iCopyright !== '2' || !qrData.qrImg || !isWx()) {
      $('.follow-author').remove()
    }

    $( "#app" ).on( "click", ".follow-author", () => {
      this.setState({
        qrShow: true
      })
      he('send', 'event', 'explore_detail', 'click', 'follow', activeId)
    })
  }

  handlehide(event) {
    if(event.target.className === 'qr-layer' || event.target.className === 'close'){
      this.setState({
        qrShow: false
      })
    }else if (event.target.className === 'follow-img') {
      he('send', 'event', 'explore_detail', 'click', 'follow_qr_code', activeId)
    }
  }

  render() {
    let btnClassNames = classnames("fix-movie", {
          "movie-yellow": isQQ(),
          "movie-orange": isApp(),
          "movie-green": isWx(),
        }),
        show  = false;
    if (isAuthorize()) {
      show = true
    }
    return (
      <div className="article-content">
        { this.state.qrShow ? <div className="qr-layer"  onClick={this.handlehide.bind(this)}><div className="qr-con"><img className="follow-img" src={qrData.qrImg} /><p className="long-touch">长按识别二维码</p><p className="follow">{qrData.longFollow}</p></div><span className="close"></span></div> : '' }
        <Header {...this.props}/>
        <div className="article-container">
          <Banner />
          <div id="article"></div>
          <Footer
            token={this.state.token}
            {...this.props}/>
        </div>
        {isAuthorize() && movieCard.length === 1 ?  <div className={btnClassNames} onClick={this.handleMovieClick.bind(this)}>
            <i className="icon-movie"></i>
        </div> : ''}
        { show ? <Fixer token={this.state.token} {...this.props}/> : '' }
        {this.props.maskStatus ? <ShareMask {...this.props}/> : null}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
