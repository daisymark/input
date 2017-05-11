import './style'
import { Link } from 'react-router'
import { REQUEST } from 'utils/_fetch.js'
import { isWx, isQQ, isApp, AppLogin, deparam, isAndroid, isiOS } from 'utils/_utils'
import { getToken } from 'utils/_getToken'
import { initShare } from 'utils/_share'
import { channelId, activeId } from 'utils/_configure'
import CommentView from './components/_commentView'
import cookie from 'js-cookie'
import classnames from 'classnames'
import { toast } from 'utils/toast'

const token = cookie.get('token') ? cookie.get('token') : getToken()
class Comment extends React.Component {
  constructor(props) {
    super(props)

    const param = deparam(window.location.href)
    this.state = {
      isSubmitting: false,
      inputFocus: false,
      fresh: 0,
      token: token,
    }
    if ( isWx() && isQQ() ) { //微信&QQ
      initShare()
    }
  }

  componentDidMount () {
    $(this.refs.textarea).focus(() => {
      he('send', 'event', 'explore_detail', 'click', 'comment', activeId)
      if (!token && isApp()) {
        AppLogin()
        return
      }
      setTimeout(function() {
        let _h = $(window).height()
        if (isiOS() && $(window).width() <= 320) {
          $('.input-main').css({'bottom': '42px'})
          $('.cancel-input').css({'bottom': '90px'})
        }
        $('.comment').css({'overflow-y': 'hidden'})
        $('body').scrollTop(_h+48)
        this.setState({
          inputFocus: true
        })
      }.bind(this), 200)
    })
  }

  commitComment() {
    let inputValue = $.trim(this.refs.textarea.value)
    if (!inputValue) {
      toast('评论不可以为空哦！~')
      this.setState({
        inputFocus: false,
        isSubmitting: false,
      })
      $('.comment').css({'overflow-y': 'scroll'})
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
      token: token
    }

    const commentUrl = `${COMMENTAPI}v1/article/${activeId}/comments`
    REQUEST(commentUrl, requestData, 'POST').then(resp => {
      if (resp.ret) {
        this.setState({
          isSubmitting: false,
        })
        this.refs.textarea.value = ''
        $('.comment').css({'overflow-y': 'scroll'})
        toast(resp.msg)
        this.setState({
          inputFocus: false
        })
      } else {
        toast('评论发表成功！')
        this.setState({
          isSubmitting: false,
          inputFocus: false
        })
        $('.comment').css({'overflow-y': 'scroll'})
        this.refs.textarea.value = ''
      }
    })
  }

  cancelInput() {
    this.setState({
      inputFocus: false
    })
    $('.comment').css({'overflow-y': 'scroll'})
  }

  render() {
    let inputClass = this.state.inputFocus ? 'input-hover' : 'input-wrapper',
        inputColor = classnames("input-main", {
            "input-yellow": isQQ(),
            "input-orange": isApp(),
            "input-green": isWx(),
          }),
        btnSubmit = this.state.inputFocus ? <a className="btn-submit"  onClick={this.commitComment.bind(this)}>发送</a> : '';
      if (this.state.isSubmitting) {
        btnSubmit = <a className="btn-input">发送</a>
      } 

    return (
      <div className="comment-wrapper">
        <CommentView fresh={this.state.fresh} token={this.state.token}/>
          <div className={inputClass}>
            <div className="cancel-input" onClick={this.cancelInput.bind(this)}></div>
            <div className={inputColor}>
              <textarea maxLength="140" ref="textarea" placeholder="我也来说两句">
              </textarea>
              {btnSubmit}
            </div>
          </div>
      </div>
    )
  }
}

export default Comment