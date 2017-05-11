import wx from 'weixin-js-sdk'
import { REQUEST_JSONP } from 'utils/_fetch.js'
import { isWx, isQQ, getParam } from 'utils/_utils'
import {
  activeId,
  sShareTitle,
  sShareSummary,
  sShareLogo,
  shareData,
} from 'utils/_configure'

let sShareLink = location.href.split('?')[0],
    wxShareLike,
    qqShareLink;

//微信和QQ的分享地址需要加上f_type参数，而且微信分享后需要显示导航栏所以要加个标注
if (location.search.includes('f_type')) {
  let f_type = getParam('f_type')
  wxShareLike = `${sShareLink}?f_type=${f_type}&share=1`
  qqShareLink = `${sShareLink}?f_type=${f_type}`
}else {
  wxShareLike = `${sShareLink}?share=1`
  qqShareLink = `${sShareLink}`
}

const share_param = {
  title: sShareTitle,
  desc: sShareSummary,
  link: sShareLink,
  imgUrl: sShareLogo,
}

function wxShare(force) {
  let _force = force
  let verif_Url = [
      'http://promotion.wepiao.com',
      'http://pre.promotion.wepiao.com',
      'https://promotion.wepiao.com',
      'https://pre.promotion.wepiao.com',
    ]
    // if(verif_Url.indexOf(window.location.origin) === -1) return
  getCap(_force, false)

  function getCap(_force, _debug) {
    const Url = '//wxtoken.wepiao.com/CreateJsApiTicket.php'
    const Data = {
      url: window.location.href,
      force: _force
    }
    REQUEST_JSONP(Url, Data).then(resp => {
      if (resp.ret === 0) {
        let data = resp.data

        wx.config({
          beta: true,
          debug: _debug, //如果在测试环境可以设置为true，会在控制台输出分享信息； //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'launch3rdApp', 'getInstallState'] // 必填
        })

        wx.error(function (res) {
          //签名过期导致验证失败
          if (res.errMsg != 'config:ok') { //如果签名失效，不读缓存，强制获取新的签名
            console.log("签名失效");
          }
        })

        const _param = {
          title: share_param.title || '', // 分享标题
          link: share_param.link || '', // 分享链接
          imgUrl: share_param.imgUrl || '', // 分享图标
          desc: share_param.desc || '', // 分享描述,分享给朋友时用
          type: share_param.type || 'link', // 分享类型,music、video或link，不填默认为link,分享给朋友时用
          dataUrl: share_param.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空,分享给朋友时用
          callback: share_param.callback || function () {} //分享回调
        }

        wx.ready(function (res) {
          wx.showOptionMenu({
            menuList: [
              'menuItem:share:appMessage',
              'menuItem:share:timeline'
            ]
          })

          wx.checkJsApi({
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems'],
            success: function (res) {
              if ((res.checkResult.onMenuShareTimeline = !!false) || (res.checkResult.onMenuShareAppMessage = !!false)) {
                return false;
              }
            }
          })

          //分享到朋友圈
          wx.onMenuShareTimeline({
            title: _param.title,
            link: wxShareLike,
            imgUrl: _param.imgUrl,
            success: function (res) {
              // 用户确认分享后执行的回调函数
              he('send', 'event', 'explore_detail', 'share', 'share_success', activeId)
              _param.callback();
            },
            cancel: function (res) {
              // 用户取消分享后执行的回调函数
            }
          })

          //分享给朋友
          wx.onMenuShareAppMessage({
            title: _param.title,
            desc: _param.desc,
            link: wxShareLike,
            imgUrl: _param.imgUrl,
            type: _param.type,
            dataUrl: _param.dataUrl,
            success: function (res) {
              // 用户确认分享后执行的回调函数
              he('send', 'event', 'explore_detail', 'share', 'share_success', activeId)
              _param.callback();
            },
            cancel: function (res) {
              // 用户取消分享后执行的回调函数
            }
          })

          wx.onMenuShareQQ({
            title: _param.title,
            desc: _param.desc,
            link: qqShareLink,
            imgUrl: _param.imgUrl,
            success: (res) => {
              _param.callback();
              if (shareMaskState() == true){
                shareCallback && shareCallback();
              }
            },
            cancel: (res) => {

            }
          });

          wx.onMenuShareQZone({
            title: _param.title,
            desc: _param.desc,
            link: qqShareLink,
            imgUrl: _param.imgUrl,
            success: (res) => {
              _param.callback();
              if (shareMaskState() == true){
                shareCallback && shareCallback();
              }
            },
            cancel: (res) => {

            }
          });

          wx.onMenuShareWeibo({
            title: _param.title,
            desc: _param.desc,
            link: _param.link,
            imgUrl: _param.imgUrl,
            success: (res) => {
              _param.callback();
              if (shareMaskState() == true){
                shareCallback && shareCallback();
              }
            },
            cancel: (res) => {

            }
          });
        })
      }
    })
  }
}

function qqShare() {
  mqq.ui.setOnShareHandler(function (type) {
    let shareUrl
    if (type === 0 || type === 1) {
      shareUrl = qqShareLink
    }else if (type === 2 || type === 3) {
      shareUrl = wxShareLike
    }else {
      shareUrl = share_param.link
    }


    mqq.ui.shareMessage({
        title : share_param.title, // 分享标题
        desc : share_param.desc, // 分享描述
        share_type: type, // 分享类型（ 0:QQ好友 1:QQ空间 2:微信好友 3:微信朋友圈 ），可用以区分渠道并做个性设置
        share_url : shareUrl, // 分享地址
        image_url : share_param.imgUrl, // 分享图标
        back : true, // 分享操作完毕后是否返回原界面
        puin : 2897540680, // 手Q官方号，可产生认证图标
        sourceName: "QQ电影票" // 分享认证名称
    }, function (c) {
        // 获得分享类型
        var d = c && "0" == c.retCode ? "ok" : "cancel", e = ["ShareToQQ", "ShareToQzone", "ShareToWX", "ShareToPYQ"][type];
        // show share menu
        if ("0" == c.retCode) {
            // 分享完成
        } else {
            // 取消分享
        }
    })
  })
}

function appShare() {
  he('send', 'event', 'explore_detail', '点击分享', 'clickShare', activeId)
  const channelLink = {
    '1': sShareLink, //新浪微博
    '2': qqShareLink, //QQ空间
    '6': wxShareLike, //微信好友
    '7': wxShareLike //微信朋友圈
  }
  const shareArray = shareData.split(',')

  const platform = shareArray.map(channel => {
    const val = channelLink[channel]
    const plat = val ? { platForm: channel, url: val } : {}
    return plat
  })

  //排序 6,7,1,2
  let sortPlatform = []
  platform.forEach(plat => {
    plat.platForm === '6' ? sortPlatform[0] = plat : {}
    plat.platForm === '7' ? sortPlatform[1] = plat : {}
    plat.platForm === '1' ? sortPlatform[2] = plat : {}
    plat.platForm === '2' ? sortPlatform[3] = plat : {}
  })
  clientShare(sShareTitle, sShareLogo, sShareSummary, sortPlatform.filter(platform => platform !== null))

  //客户端分享
  function clientShare(title, imgUrl, desc, platform) {
    const shareLink = 'wxmovie://shareplatform?title=' +
        encodeURIComponent(sShareTitle) +
        '&icon=' + encodeURIComponent(sShareLogo) +
        '&content=' + encodeURIComponent(sShareSummary) +
        '&platform=' + encodeURIComponent(JSON.stringify(sortPlatform.filter(platform => platform!==null)));
    window.location.href = shareLink
  }
}

function initShare() {
  if ( isWx() ){
    wxShare(1)
  }else if ( isQQ() ) {
    qqShare()
  }
}

export {
 initShare,
 appShare
}
