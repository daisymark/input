import reqwest from 'reqwest'

function REQUEST(url, data = {}, method = 'GET') {
  return reqwest({
    url: url,
    method: method,
    data: data,
  }).fail((err, msg) => {
    console.error(msg);
  }).then(resp => {
    return resp
  })
}

function REQUEST_JSONP(url, data = {}, method = 'GET') {
  return reqwest({
    url: url,
    method: method,
    contentType: 'application/json',
    jsonpCallbackName: 'jsonp',
    type: 'jsonp',
    data: data,
  }).fail((err, msg) => {
    console.error(msg);
  }).then(resp => {
    return resp
  })
}


export {
  REQUEST,
  REQUEST_JSONP
}
