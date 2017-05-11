import './style'
import classnames from 'classnames'
import { REQUEST } from 'utils/_fetch.js'
import { convertTime, isQQ, isApp, AppLogin } from 'src/utils/_utils'
import { channelId, activeId } from 'utils/_configure'
import cookie from 'js-cookie'

let likeStatus
class CommentItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      likeStatus: props.item.is_favor,
      likeAmount: props.item.favor_count,
      isUser: props.item.is_user,
      commentId: props.item.id,
    }
  }

  componentWillReceiveProps(props) {
    this.state = {
      likeStatus: props.item.is_favor,
      likeAmount: props.item.favor_count,
      isUser: props.item.is_user,
      commentId: props.item.id,
    }
  }

  requestLikeData() {
    const likeData = {
      channelId: channelId,
      token: cookie.get('token'),
      favor: likeStatus, //1：点赞 0：未点赞／取消点赞
    }
    const requestUrl = `${COMMENTAPI}v1/article-comment/${this.props.item.id}/favor`
    REQUEST(requestUrl, likeData, 'POST').then(resp => {
    })
  }

  handleClick() {
    he('send', 'event', 'explore_detail', 'click', 'comment_good', activeId)
    const token = cookie.get('token')
    if (!token && isApp()) {
      AppLogin()
      return
    }else {
      likeStatus = this.state.likeStatus ===  0 ? 1 : 0
      if(this.state.likeStatus){
        this.setState({
          likeStatus: 0,
          likeAmount: --this.state.likeAmount,
        })
      }else{
        this.setState({
          likeStatus: 1,
          likeAmount: ++this.state.likeAmount,
        })
      }
      this.requestLikeData()
    }
  }

  handleDel() {
    //删除评论
    const isDel = confirm("确定删除吗?")
    if (isDel == true){
      he('send', 'event', 'explore_detail', 'click', 'comment_delete', activeId)
      const deleteData = {
        channelId: channelId,
        token: cookie.get('token'),
      }
      const commentName = `comment${this.state.commentId}`
      REQUEST(COMMENTAPI + 'v1/article-comment/' + this.state.commentId, deleteData, 'DELETE').then(resp => {
        if (!resp.ret) {
          $(this.refs[commentName]).hide()
        }
      })
    }
  }

  render() {
    const { item } = this.props
    const commentName = `comment${this.state.commentId}`
    let likeClassName = classnames("icon-font", {
          "icon-like": !!!this.state.likeStatus,
          "icon-liked": !!this.state.likeStatus,
        }),
        itemClassName = classnames("comment-item", {
          "comment-app": isApp(),
          "comment-qq": isQQ(),
        })
    return (
      <li ref={commentName} key={this.state.commentId} className={itemClassName}>
        <div className="comment-info">
          <div className="comment-auther">
            <img src={item.user.photo} />
            <p>{item.user.nickName}</p>
          </div>
          { this.state.isUser ? <a className="comment-delete" onClick={this.handleDel.bind(this)}>删除</a> : '' }
        </div>
        <div className="comment-content">
          <p>{item.content}</p>
          <span className="created-time">{convertTime(item.created)}</span>
          <div className="comment-favor">
            <span>{this.state.likeAmount}</span>
            <i className={likeClassName} onClick={this.handleClick.bind(this)}></i>
          </div>
        </div>
      </li>
    )
  }
}

export default CommentItem
