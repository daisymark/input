import './style'
import { activeId } from 'utils/_configure'
import { isApp, getParam } from 'utils/_utils'

const downloadData = {
  'wepiao': {
    logoUrl: require('assets/images/logo.jpg'),
    title: '近期热门',
    intro: '好片什么值得看?',
    downloadUrl: "//promotion.wepiao.com/down/mobilelist/download.html?_wepiao_spm=0.0.e5yw.9qvj"
  }
}

let download = downloadData.wepiao

class Download extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isShow: !isApp(),
    }
  }

  handleIconClick() {
    he('send', 'event', 'explore_detail', 'click', 'appclose', activeId)
    this.setState({
      isShow: false
    })
  }

  handdownloadClick(){
    const Url = download.downloadUrl
    he('send', 'event', 'explore_detail', 'click', 'appdl', activeId)
    window.open(Url)
  }

  renderDownload() {
    if (this.state.isShow && !getParam('share')) {
      return (
        <div className="download-wrapper">
          <img className="inline-block img-logo" src={download.logoUrl}/>
          <div className="inline-block desc-download">
            <p className="download-title">{download.title}</p>
            <p className="download-intro">{download.intro}</p>
          </div>
          <div className="inline-block btn-block">
            <span className="inline-block btn-common btn-download" onClick={this.handdownloadClick.bind(this)}></span>
            <span className="inline-block btn-common btn-close" onClick={this.handleIconClick.bind(this)}></span>
          </div>  
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderDownload()}
      </div>
    )
  }
}

export default Download
