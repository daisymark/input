import moment from 'moment'
import _ from 'lodash'
import cookie from 'js-cookie'

//从现在页面的url中获取参数
function getParam(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]);
  return null
}

function deparam(str) {
  let toObj = {}
  let org = _.chain((str || '')
          .split(/([^\?#&]+?)[\?#&]/))
      .map(function(s) {
          return (s || '').split(/=/);
      }).filter(function(s) {
          return s && s.length === 2;
      }).value().map(function(s) {
          toObj[s[0]] = s[1]
      })
  return toObj;
} // end

//通过链接传来的update_time转换成以下逻辑的时间显示
/*
(1) 上线1分钟内：现在
(2) 上线1-60分钟：XX分钟前
(3) 上线1-24小时：XX小时前
(4) 上线1-7天：X天前
(5) 上线7天以上：X月X日
(6) 上线1年以上：XX年X月X日
*/
function updateTime() {
  let u_time = parseInt(getParam('update_time'))*1000

  if (u_time) {
    let _now = (new Date()).getTime(),
        secPast = parseInt((_now - u_time)/1000), // 过去的秒数
        minPast = parseInt(secPast/60), //过去的分钟数
        hPast = parseInt(secPast/(60 * 60)), //过去的小时数
        datePast = parseInt(secPast/(60 * 60 * 24)), //过去的天数
        yearPast = (new Date().getFullYear() - new Date(u_time).getFullYear()); //过去的年数
    if (yearPast > 0) {
      return  `${moment(Number(u_time)).format("YYYY年MM月DD日")}`
    }else if (datePast >= 7) {
      return  `${moment(Number(u_time)).format("MM月DD日")}`
    }else if (datePast > 0) {
      return `${datePast}天前`
    }else if (hPast > 0) {
      return `${hPast}小时前`
    }else if (minPast > 0) {
      return `${minPast}分钟前`
    }else {
      return `现在`
    }
  }else
    return false
}

function convertTime(create) {
  const _now = (new Date()).getTime() / 1000
  const created = create ? create : _now
    // 过去的秒数
  const datePast = _now - created
    // 转换成天
  const dateStr = parseInt(datePast / (60 * 60 * 24))
    // 转换成小时
  const hoursPast = parseInt(datePast / (60 * 60))
    // 转换成分钟
  const minutesPast = parseInt(datePast / 60)
  const minutesStr = minutesPast < 3 ? '刚刚' : (minutesPast + '分钟前')
  const hoursStr = hoursPast < 1 ? minutesStr : (hoursPast + '小时前')
    // 时间
  let dateShowStr = ''
  if (dateStr <= 3) {
    dateShowStr = dateStr < 1 ? hoursStr : dateStr + '天前'
  } else {
    dateShowStr = moment(Number(create) * 1000).format("YYYY-MM-DD")
  }
  return dateShowStr;
}

//音频控制
function audioControl() {
  let $audio = $("#audioTag")[0]
  let $player = $(".player")
  let imgUrl = document.getElementById('configure').getAttribute('data-sCover')
  $player.css("background", "url(" + imgUrl + ")")
  $player.css("backgroundSize", "cover")
  $player.addClass("paused")
  $(document).on('click', '.control', function (e) {
    if ($audio.paused) {
      $audio.play()
      $player.removeClass("paused")
      $player.addClass("running")
      $(this).addClass("pause")
    } else {
      $audio.pause()
      $player.removeClass("running")
      $player.addClass("paused")
      $(this).removeClass("pause")
    }
  })
}

//视频控制
function videoControl () {
  const elist = $("embed")
    elist.each(function(i,v){
      var src = $(v).attr("src")
      var index = src.indexOf("=")
      var vid = src.substring(index+1,src.length)
      $(v).parent().append("<iframe frameborder=\"0\" width=\"100%\" height=\"211\" src=\"https://v.qq.com/iframe/player.html?vid="+vid+"&tiny=0&auto=0\" allowfullscreen><\/iframe>")
      $(v).parent().css("marginTop","10px")
      $(v).remove()
    })
}

//图片触屏事件
function imgLongTap() {
  let pressTimer
  $("img").mouseup(function(){
    clearTimeout(pressTimer)
    return false;
  }).mousedown(function(){
    pressTimer = window.setTimeout(function() {
    let url = $(this).attr('src')
    window.location.href = 'wxmovie://onImageLongClick?imgUrl='+encodeURIComponent(url)
  }, 1000)
    return false
  })
}

function cardMap() {
  $('#article_main .card').map(function(item, index) {
    let movie_id = $(index).find('a').data('id'),
        movie_card = $(index).find('a').attr('class') === 'movie_card' ? true : false,
        url;
    if (isWx()) {
      url = movie_card ? '//wx.wepiao.com/movie_detail.html?movie_id=' : '//wechat.show.wepiao.com/detail/onlineId='
    }else if(isQQ()) {
      url = movie_card ? '//mqq.wepiao.com/#/movies/' : '//mqq.show.wepiao.com/detail/'
    }else {
      url = movie_card ? 'wxmovie://filmdetail?movieid=' : 'wxmovie://showdetail?onlineid='
    }
    $(index).find('a')[0].href = url + movie_id
  })
}

function AppLogin() {
  cookie.remove('token')
  window.location.href = 'wxmovie://usertoken?url=' + encodeURIComponent(window.location.href.split('#')[0])
}

function init() {
  cardMap()
  audioControl()
  videoControl()
  if (isApp()) {
    imgLongTap()
  }
}

function isWx(){
  // return navigator.userAgent.indexOf('MicroMessenger') > -1 ? true : false;
  return true
}

function isQQ(){
  return navigator.userAgent.toLowerCase().indexOf('qq') > -1 ? true : false;
}

function isWepiaoer(){
  return navigator.userAgent.toLowerCase().indexOf('wepiao') > -1 ? true : false;
}

function isiOS(){
  return navigator.userAgent.toLowerCase().indexOf('iphone') > -1 ||
    navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ? true : false;
}

function isAndroid(){
  return navigator.userAgent.toLowerCase().indexOf('android') > -1 ? true : false;
}

function isApp() {
  if (isWepiaoer() && (isiOS() || isAndroid())) 
    return true
  else
    return false
}

function isAuthorize() {
  if (isWx() || isQQ() || isApp())
    return true
  else
    return false
}

/***
后端不同平台对应的id
3 微信
28 qq
6 mobile web
8 微票ios app
9 微票android app
**/
function getChannelId() {
  if (isWx()) {
      return 3
  } else if (isQQ()) {
      return 28
  } else if ( isWepiaoer() && isiOS()) {
      return 8
  } else if ( isWepiaoer() && isAndroid()){
      return 9
  } else {
      return 6
  }
}

export {
  getParam,
  deparam,
  convertTime,
  updateTime,
  AppLogin,
  init,
  isWx,
  isQQ,
  isiOS,
  isAndroid,
  isApp,
  isAuthorize,
  getChannelId,
}
