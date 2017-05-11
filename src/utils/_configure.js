import { getChannelId } from 'utils/_utils'

function getData(dataName) {
  return document.getElementById('configure').getAttribute(dataName)
}

let channelId = getChannelId(),
    sShareLogo = getData('data-sShareLogo'),
    sShareTitle = getData('data-sShareTitle'),
    sShareSummary = getData('data-sShareSummary'),
    activeId = getData('data-activeId'),
    shareData = getData('data-shareData'),
    sCover = getData('data-sCover'),
    sTitle = getData('data-sTitle'),
    iCopyright = getData('data-iCopyright'),  // 0是没有 1是原创 2是转载
    articleMain = document.getElementById('article_main'),
    movieCardDom = articleMain.querySelectorAll('.movie_card'),
    qrData = {
      qrImg: getData('data-qr') && getData('data-qr').length ? getData('data-qr') : false,
      author: getData('data-author'),
      summary: getData('data-summary'),
      longFollow: `长按关注“${getData('data-author')}”微信公众号`,
      longTouch: `长按关注该微信公众号`,
    },
    movieCard = {
      length: movieCardDom.length,
      date: movieCardDom[0] ? (movieCardDom[0].querySelectorAll('.date')[0].innerHTML).replace(/[^0-9]/ig,",") : '',
      id: movieCardDom[0] ? movieCardDom[0].getAttribute ('data-id') : '',
    };

export {
  sShareLogo,
  sShareTitle,
  sShareSummary,
  activeId,
  channelId,
  shareData,
  sCover,
  sTitle,
  iCopyright,
  qrData,
  movieCard,
}
