import { channelId, sShareTitle, sShareSummary, sShareLogo, shareData, sShareOtherLink } from 'utils/_configure'

const sShareLink = location.href.split('?')[0]
const channelLink = {
	'1': sShareLink, //新浪微博
	'2': sShareLink, //QQ空间
	'6': sShareLink, //微信好友
	'7': sShareLink //微信朋友圈
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

const share_param = {
  shareTitle: sShareTitle,
  shareContent: sShareSummary,
  shareUrl: sShareLink,
  shareImg: sShareLogo,
  platform: sortPlatform.filter(platform => platform!==null)
}

function connectWebViewJavascriptBridge (callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge)
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', () => {
			callback(WebViewJavascriptBridge)
		}, false)
	}
}


function appinit () {
  if (window.isiOSInit) {
    window.isiOSInit = true
    connectWebViewJavascriptBridge((bridge) => {
      bridge.init((message, responseCallback) => {
        if (responseCallback) {
        	responseCallback()
        }
      })
    })
  }
}

function appShare () {
	const userAgent = navigator.userAgent;  

	if (userAgent.indexOf('iPhone') > 0) {//微票IOS渠道
		appinit()
		connectWebViewJavascriptBridge((bridge) => {
			bridge.callHandler('showShareButton', share_param)
		})
	}else if (userAgent.indexOf('Android') > 0) {//微票安卓渠道
		const index = userAgent.indexOf('wepiao')
		if(index >= 0){
		    const androidVersion = userAgent.slice(index+7,index+12)
		    if (androidVersion >= '6.3.0') {
        		alert(JSON.stringify(share_param))
		    }
		}
	}
}

export {
	appShare
}


