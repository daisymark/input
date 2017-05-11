import { isWx, isQQ, isApp, isAuthorize } from 'utils/_utils'
import { iCopyright, channelId, activeId, movieCard, qrData } from 'src/utils/_configure'
import { REQUEST } from 'utils/_fetch'
import ArticleRecommend from 'src/components/articleRecommend/_articleRecommend'
import HotComment from './_hotComment'
import classnames from 'classnames'

const copyrightData = {
  '1': {
    title: '原创声明',
    content: '本文版权归娱票儿所有，任何媒体、网站或个人未经授权不得以任何形式转载。',
  },
  '2': {
    title: '转载声明',
    content: '本文经原发布平台授权转载至娱票儿。版权归本文作者所有。任何媒体、网站或个人未经授权，不得以任何形式转载。',
  },
  '3': {
    title: '免责声明',
    content: '本文仅以传播信息为目的，不代表娱票儿的观点和立场。',
  } ,
}

class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: [],
      totalComment: '0',
      token: props.token
    }
    this.getHotComments( props.token )
  }

  componentWillReceiveProps(props) {
    if (this.state.token != props.token) {
      this.setState({
        token: props.token
      })
      this.getHotComments(props.token)
    } else {
      if (this.state.totalRead === 0) {
        window.location.replace(window.location.href.split('#')[0])
      }
    }
  }

  componentDidMount() {
    if (movieCard.length === 1 && !$('.movie-btn').length) {
      let btnClassNames = classnames({
            "btn-yellow": isQQ(),
            "btn-orange": isApp(),
            "btn-green": isWx(),
          }),
        card_name = '查看';
        if (movieCard.date.split(',').length > 3) {
        let release_time = movieCard.date.split(',')
        if (release_time[1].length < 2) {//上映的前一天到上映后的十天内算是“购买” 
          release_time[1] = `0${release_time[1]}`
        }
        if (release_time[2].length < 2) {
          release_time[2] = `0${release_time[2]}`
        }
        release_time = new Date(`${release_time[0]}-${release_time[1]}-${release_time[2]}`).getTime()
        const this_time = new Date().getTime()
        if (this_time >= (release_time - 86400000) && this_time <= (release_time + 864000000)) {
          card_name="购票"
        }
      }
      let cardBtn = `<div class="movie-btn ${btnClassNames}"><span>${card_name}</span></div>`;
      $('.movie_card .arrow').remove();
      $('.movie_card').append(cardBtn)
    }
  }

  getHotComments(token) {
    //获取某个文章的评论列表
    const commentData = {
      channelId,
      sortBy: 'favor', //reply：回复数，favor：喜欢数，time:时间维度
      token: token,
      page: '1',
      num: '3'
    }
    
    const requestUrl = `${COMMENTAPI}v1/article/${activeId}/comments`

    REQUEST(requestUrl, commentData).then(resp => {
      if (resp.data && resp.data.comments) {
        const data = resp.data
        this.setState({
          comments: data.comments,
          totalComment: data.totalCount,
        })
      }
    })
  }

  renderCopyRight() {
    if (iCopyright in copyrightData) {
      let copyClassName = classnames("copyright", {
          "app-back": isApp(),
          "qq-back": isQQ(),
        })
      return (
        <div className={copyClassName}>
          <h1 className="copyright-title">©{copyrightData[iCopyright].title}</h1>
          <p className="copyright-content">{copyrightData[iCopyright].content}</p>
        </div>
      )
    }
  }

  renderQR() {
    if (iCopyright in copyrightData) {
      let qrContent = ''
      let qrClass = 'qr-wrapper qr-ori'
      if (iCopyright === '1') {
        qrContent = {
          qrImg: require('assets/images/wp_qr.jpg'),
          author: '娱票儿官方服务号',
          summary: '更多电影精彩，一键关注掌握',
          longTouch: '长按关注“电影演出票”',
        }
      }else if (iCopyright === '2' && qrData.qrImg) {
        qrContent = qrData
        qrClass = 'qr-wrapper'
      }
      if (qrContent && isWx()) {
        return (
          <div className={qrClass}>
            <img src={qrContent.qrImg} />
            <p className="title">
            {qrContent.author}
            </p>
            <p className="summary">
            {qrContent.summary}
            </p>
            <p className="long-touch">
            {qrContent.longTouch}
            </p>
          </div>
        )
      }
    }
  }

  render() {
    return (
      <div className="foot-wrapper">
        {this.renderCopyRight()}
        {this.renderQR()}
        { isAuthorize() ? <HotComment comments={this.state.comments} token={this.state.token} totalComment={this.state.totalComment}/>  : '' }
        { <ArticleRecommend /> }
      </div>
    )
  }
}


export default Footer
