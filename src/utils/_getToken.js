import { REQUEST_JSONP } from 'utils/_fetch'
import { channelId } from 'utils/_configure'
import { isWx, isQQ, isApp, getParam, deparam } from 'utils/_utils'
import cookie from 'js-cookie'

const wxLoginUrl = `${COMMONCGIAPI}wxtoken/getWxId.php?channelId=3&code=`
const mqqLoginUrl = `${COMMONCGIAPI}mqq/login.php?channelId=28&code=`

//用户在微信打开 想要获取用户的登录信息需要获取授权
function getToken() {
	if (isWx() || isQQ()) {//微信渠道 或者 手Q渠道
		const param = deparam(window.location.href)
        let url_oauth,
            url_login;

        if ( isWx() ) {
            url_oauth = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92cf60f7577e2d48' +
                    '&redirect_uri=' + encodeURIComponent('http://wx.wepiao.com/cgi/bonus_proxy.php?url=' + location.href.split('#')[0] + '?v=1') +
                    '&response_type=code&scope=snsapi_base&state=#wechat_redirect'
            url_login = wxLoginUrl + param.code + '&jsonp=jsonp'
        }else {
            url_oauth = 'http://open.show.qq.com/cgi-bin/login_state_auth_redirect?appid=101233410&redirect_uri=' +  encodeURIComponent('http://mqq.wepiao.com/cgi/bonus_proxy.php?url=' + location.href.split('#')[0] + '?v=1' )
            url_login = mqqLoginUrl + param.code + '&jsonp=jsonp';
        }

        if (param.code) {
        	//获取微信授权
			REQUEST_JSONP(url_login, {}, 'POST').then(res => {
                if (res.ret === 0) {
                    let token
                    if (res.data.MqqOpenId) {
                        token = res.data.MqqOpenId
                    }else {
                        token = res.data.WxOpenId
                    }
                    let Period = new Date(new Date().getTime() + 55 * 60 * 1000) //从现在开始55分钟
                    cookie.set( 'token', token, {
                        'expires': Period
                    })
                	return token
                }
            })
        } else {
            if (param.code === '') {
                alert('授权不成功~~~~(>_<)~~~~')
            }else {
                window.location.replace(url_oauth)
            }
        } 
	}else if ( isApp() ) {
		const token = getParam('token')
        if (token) {
            cookie.set( 'token', token )
        }
		return token
	}
}

export {
	getToken
}
