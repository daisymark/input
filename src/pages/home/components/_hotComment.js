import { Link } from 'react-router'
import CommentItem from 'src/components/comment/_commentItem'
import { activeId } from 'utils/_configure'
import { isApp, AppLogin } from 'utils/_utils'
import classnames from 'classnames'

class HotComment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: props.comments,
      totalComment: props.totalComment,
      token: props.token,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      comments: props.comments,
      totalComment: props.totalComment,
      token: props.token,
    })
  }

  renderCommentContent() {
    if (this.state.comments.length === 0) {
      return (
        <Link to="/comment" onClick={this.handshafaClick.bind(this)} className="comment-tips">什么都没留下，你还不抢个沙发</Link>
      )
    }
  }
  
  handshafaClick() {
    he('send', 'event', 'explore_detail', 'click', 'comment_first', activeId)
  }

  handmoreClick(){
    he('send', 'event', 'explore_detail', 'click', 'comment_more', activeId)
  }

  renderMoreComment() {
    if (this.state.totalComment > 3) {
      let commentClassNames = classnames("more-comment", {
            "more-comment-yellow": isApp(),
            "more-comment-blue": !isApp(),
          });
      return (
        <Link to="/comment" onClick={this.handmoreClick.bind(this)} className={commentClassNames}>查看全部{this.state.totalComment}条回复</Link>
      )
    }
  }

  render() {
    const commentItem = (item, i) => <CommentItem key={i} item={item}/>
    return (
      <div className="brief-comment">
        <div className="title-wrap">
          <p className="comment-title">热门回复</p>
        </div>
        { this.renderCommentContent() }
        <ul className="comment-list">
          { this.state.comments.map(commentItem) }
        </ul>
        { this.renderMoreComment()}
      </div>
    )
  }
}

export default HotComment
