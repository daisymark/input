import './_fixer.scss'
import classnames from 'classnames'
import { channelId, movieCard, activeId } from 'src/utils/_configure'
import { Link } from 'react-router'
import { REQUEST_JSONP, REQUEST} from 'utils/_fetch'
import Cookies from 'cookies-js'
import { isWx, isQQ, isApp, isAuthorize, AppLogin, isiOS } from 'utils/_utils'
import { getToken } from 'utils/_getToken'
import { appShare } from 'utils/_share'
import { toast } from 'utils/toast'
import cookie from 'js-cookie'

let likeStatus = false

class Fixer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      likeStatus: false,
      likeAmount: 0,
      totalRead: 0,
      totalComment: 0,
      token: props.token,
      inputFocus: false,
      isSubmitting: false,
    }
    this.getLikeAmount(props.token)
    this.getHotComments(props.token)
  }

  componentDidMount () {
    $(this.refs.textarea).focus(() => {
      if (!this.state.token && isApp()) {
        AppLogin()
        return
      }
      setTimeout(function() {
        let _h = $(window).height()
        if (isiOS() && $(window).width() <= 320) {
          $('.input-main').css({'bottom': '42px'})
          $('.cancel-input').css({'bottom': '90px'})
        }
        $('.article-container').css({'overflow-y': 'hidden'})
        $('body').scrollTop(_h+48)
        this.setState({
          inputFocus: true
        })
      }.bind(this), 200)
      he('send', 'event', 'explore_detail', 'click', 'comment', activeId)
    })
  }

  componentWillReceiveProps(props) {
    if (this.state.token != props.token) {
      this.setState({
        token: props.token,
      })
      this.getLikeAmount(props.token)
      this.getHotComments(props.token)
    }
  }

  getLikeAmount(token) {
    const configData = {
      channelId: channelId,
      id: activeId,
      token: token,
    }
    const articleUrl = COMMONCGIAPI + 'cms/getCmsRead.php'
    REQUEST_JSONP(articleUrl, configData).then((resp) => {
      if (resp.data) {
        document.getElementById('article').querySelector('.reads-amount').innerHTML = resp.data.reads // 需要后端直接传值到html里，可忽略此赋值 TODO
        this.setState({
          totalRead: resp.data.reads,
          likeAmount: resp.data.likes,
          likeStatus: !!resp.data.is_like,
        })
      }
    })
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
          totalComment: data.totalCount,
        })
      }
    })
  }

  handleShareClick() {
    if ( isWx() || isQQ() ) {
      this.props.showMask(true)
    }else {
      appShare()
    }
  }

  handleLikeClick() {
    likeStatus = !this.state.likeStatus

    let isThumb = likeStatus ? 1 : 0

    const token = this.state.token

    he('send', 'event', 'explore_detail', 'click', 'good', activeId)

    if (!token && isApp()) {
      AppLogin()
      return
    }

    const likeData = {
      channelId: channelId,
      id: activeId,
      status: likeStatus ? 1 : 0,
      token: token,
    }
    const requestUrl = COMMONCGIAPI + 'cms/saveCmsLike.php'

    REQUEST_JSONP(requestUrl, likeData, 'POST').then((resp) => {
      if (resp.ret === 0) {
        this.setState({
          likeStatus: !this.state.likeStatus,
          likeAmount: this.state.likeStatus ? --this.state.likeAmount : ++this.state.likeAmount,
        })
        Cookies.set('isThumb', isThumb, {
          path: '/',
          domain: '.wepiao.com',
          expires: 60 * 60 * 24 * 30,
        })
        Cookies.set('cid', activeId, {
          path: '/',
          domain: '.wepiao.com',
          expires: 60 * 60 * 24 * 30,
        })
      }
    })
  }

  handleCommentClick() {
    he('send', 'event', 'explore_detail', 'click', 'comment_all', activeId)
  }

  renderShareIcon() {
    if ( isAuthorize() ) {
      return (
        <div onClick={this.handleShareClick.bind(this)} className="inline-block">
          <i className="icon-font icon-share"></i>
        </div>
      )
    }
  }

  renderLikeText() {
    let likeText
    let likeAmount = this.state.likeAmount
    if (likeAmount > 9999) {
      likeText = (likeAmount / 10000).toFixed(1) + '万'
    } else {
      likeText = likeAmount
    }
    return likeText
  }

  commitComment() {
    let inputValue = $.trim(this.refs.textarea.value)
    if (!inputValue) {
      toast('评论不可以为空哦！~')
      this.setState({
        inputFocus: false,
        isSubmitting: false,
      })
      $('.article-container').css({'overflow-y': 'scroll'})
      return
    }
    this.setState({
      isSubmitting: true
    })
    he('send', 'event', 'explore_detail', 'click', 'comment_upload', activeId)
      //发送评论的接口
    const requestData = {
      channelId: channelId,
      content: this.refs.textarea.value,
      token: this.state.token
    }

    const commentUrl = `${COMMENTAPI}v1/article/${activeId}/comments`
    REQUEST(commentUrl, requestData, 'POST').then(resp => {
      if (resp.ret) {
        this.setState({
          isSubmitting: false,
        })
        this.refs.textarea.value = ''
      $('.article-container').css({'overflow-y': 'scroll'})
        toast(resp.msg)
        this.setState({
          inputFocus: false
        })
      } else {
        toast('评论发表成功！')
        window.location.href= "#/comment"
      }
    })
  }

  cancelInput() {
    this.setState({
      inputFocus: false
    })
    $('.article-container').css({'overflow-y': 'scroll'})
  }

  renderInput() {
    if (isAuthorize()) {
      let subBtn = '',
          inputClass = this.state.inputFocus ? 'input-hover' : 'input-wrapper',
          inputClassNames = classnames("input-main", {
            "border-yellow": isQQ(),
            "border-orange": isApp(),
            "border-green": isWx(),
          });
      if (this.state.isSubmitting) {
        inputClass = 'input-submitting'
      }

      if (this.state.isSubmitting) {
        subBtn = <a className="btn-input">发送</a>
      }else if (this.state.inputFocus) {
        subBtn = <a className="btn-submit"  onClick={this.commitComment.bind(this)}>发送</a>
      }

      return (
        <div className={inputClass}>
          <div className="cancel-input" onClick={this.cancelInput.bind(this)}></div>
          <div className={inputClassNames}>
            <textarea maxLength="140" ref="textarea" placeholder="我也来说两句">
            </textarea>
            {subBtn}
          </div>
        </div>
      )
    }
  }

  renderComment() {
    if (!this.state.inputFocus && !this.state.isSubmitting) {
      return (
        <Link to="/comment" onClick={this.handleCommentClick.bind(this)} className="inline-block">
          <i className="icon-font icon-comment"></i>
          <span>{this.state.totalComment}</span>
        </Link>
      )

    }
  }

  renderLike(){
    if ( isAuthorize() && !this.state.inputFocus && !this.state.isSubmitting) {
      let likeClassName = classnames("icon-font", {
        "icon-like": !this.state.likeStatus,
        "icon-liked icon-app": this.state.likeStatus && isApp(),
        "icon-liked": this.state.likeStatus && isWx(),
        "icon-liked icon-qq": this.state.likeStatus && isQQ(),
      })
      return (
        <div className="inline-block" onClick={this.handleLikeClick.bind(this)} >
          <i className={likeClassName}></i>
          <span>{this.renderLikeText()}</span>
        </div>
      )
    }
  }

  render() {
    let fixClassName = classnames("fixer-wrapper", {
        "fixer-app": isApp(),
        "": !isApp(),
      })
    this.renderLikeText()
    return (
      <div className={fixClassName}>
        {this.renderInput()}
        {this.renderComment()}
        {this.renderLike()}
        {!this.state.inputFocus && !this.state.isSubmitting && this.renderShareIcon()}
      </div>
    )
  }
}



export default Fixer
