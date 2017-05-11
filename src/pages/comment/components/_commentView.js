import 'utils/_upload'
import { REQUEST } from 'utils/_fetch.js'
import { getToken } from 'utils/_getToken'
import { channelId, activeId } from 'utils/_configure'
import CommentItem from 'src/components/comment/_commentItem'
import cookie from 'js-cookie'

const sortBy = ['new', 'reply', 'favor'] //时间维度 ,回复数,喜欢数
const token = cookie.get('token') ? cookie.get('token') : getToken()

const Data = {
  channelId,
  token: token,
  sortBy: sortBy[0],
  page: '1',
  num: '5'
}

const hotcommentData={
  ...Data,
  num: '3',
  sortBy : sortBy[2],
}

let commentData={
  ...Data,
  sortBy: sortBy[0]
}

const commentUrl = `${COMMENTAPI}v1/article/${activeId}/comments`

class CommentView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hotcomments: [],
      comments: [],
      page: '1',
      titleShow: false,
      hotShow: false
    }

    this.fetch = () => {
      REQUEST(commentUrl, hotcommentData).then(resp => {
        if (resp.data && resp.data.comments.length) {
          const hotcomments = resp.data.comments
          hotcomments.map((item)=> {
            if (item.favor_count > 0) {
              this.setState({
                hotShow: true,
              })
              return
            }
          })
          this.setState({
            hotcomments: hotcomments,
          })
        }
      })
      REQUEST(commentUrl, Data).then(resp => {
        if (resp.data && resp.data.comments.length) {
          const data = resp.data
          this.setState({
            comments: data.comments,
            titleShow: true
          })
        }
      })
    }

    this.scroll = () => {
      const upload = $('.comment').dropload({
        loadDownFn: () => {
          const comments = this.state.comments
          const page = parseInt(this.state.page, 0) + 1
          commentData.page = page
          REQUEST(commentUrl, commentData).then(resp => {
            if (resp.data.comments.length) {
              const data = resp.data
              this.setState({
                comments: comments.concat(data.comments),
                page
              })
            } else {
              upload.isData = false
            }
            upload.resetload()
          })
        },
      })
    }
  }

  componentDidMount() {
    //获取某个文章的评论列表
    this.fetch()
    this.scroll()
  }

  componentWillReceiveProps() {
    this.fetch()
    this.setState({
      page: '1'
    })
    $('.comment').scrollTop(0)
  }

  render() {
    const commentItem = (item, i) => <CommentItem key={i} item={item}/>
    const hotItem = (item, i) => {
      if (item.favor_count > 0) {
        return <CommentItem key={i} item={item}/>
      }else {
        return ''
      }
    }

    const state = this.state
    const titleShow = state.titleShow
    const hotShow = state.hotShow

    return (
      <div className="comment">
          { hotShow ? <p className="comment-title comment-hots">热门评论</p> : '' }
          <ul className="comment-list">
              {this.state.hotcomments.map(hotItem)}
          </ul>
          { titleShow ? '' : <p className="comment-tips">什么都没留下，你还不抢个沙发</p> }
          { titleShow ? <p className="comment-title comment-new">最新评论</p> : '' }
          <ul className="comment-list">
              {this.state.comments.map(commentItem)}
          </ul>
      </div>
    )
  }
}

export default CommentView
