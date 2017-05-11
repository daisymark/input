import './_articleRecommend.scss'
import { REQUEST_JSONP } from 'utils/_fetch.js'
import { channelId, activeId } from 'utils/_configure'
import { getParam } from 'utils/_utils'

class ArticleRecommend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: []
    }
  }

  handleComment(){
    he('send', 'event', 'explore_detail', 'click', 'recommend', activeId)
  }

  componentDidMount() {
    if (!window.location.search.includes('f_type')) {
      return
    }
    const requestUrl = COMMONCGIAPI + 'cms/getFindOtherCms.php'
    const cmsData = {
      channelId: channelId,
      id: activeId, //CMS的id
      t_id: getParam('f_type') //分类的id '2'
    }

    REQUEST_JSONP(requestUrl, cmsData, 'GET').then(resp => {
      if (!resp.ret && resp.data.length) {
        this.setState({
          articles: resp.data
        })
      }
    })
  }

  renderMoreArticle() {
    const articleItem = (item, i) => {
      const id = getParam('f_type')
      const Url = `${item.url}?f_type=${id}`
      const divStyle = {
        background: 'url(' + item.cover + ') center' 
      }
      return (<li key={i} className="article-item">
        <a href={Url} onClick={this.handleComment.bind(this)}>
          <div className="left-col">
            <p className="article-title">{item.title}</p>
            <p className="intro"></p>
            <div className="info-box">
              <i className="icon-font icon-eye"></i>
              <span>{item.reads}</span>
              <i className="icon-font icon-liked"></i>
              <span>{item.likes}</span>
            </div>
          </div>
          <div className="img" style={divStyle}></div>
        </a>
      </li>)
    }

    if (this.state.articles.length) {
      return (
        <div className="article-recommend">
         <p className="title">更多文章</p>
        <ul className="article-list">
          {this.state.articles.map(articleItem)}
        </ul>
      </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderMoreArticle()}
      </div>
    )
  }
}

export default ArticleRecommend
