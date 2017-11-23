cssPolyfill();
function cssPolyfill(){
  if (isPolyFillTarget()){
    let links = document.getElementsByTagName("link");
    for(let index = 0; index < links.length; index++){
      let url = links[index].getAttribute("href");
      if (!url.includes("http://0.0.0.0:8080")){
        let parts = url.split("/");
        let file = parts[parts.length-1].split("?")[0];
        setCSS(file, links[index]);
      }
    }
  }
}
function setCSS(url, link){
  getHelper("/polyfill?file="+url).then(res=>{
    if(res.ok)
      return res.text();
    else
      return "";
  }).then(res =>{
    setPolyfill(res, link);
  });
}
function setPolyfill(css_data, link){
  let head = document.getElementsByTagName('head')[0];
  /*let style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css_data;
  } else {
    style.appendChild(document.createTextNode(css_data));
  }
  //style.innerHTML = css_data;
  head.appendChild(style);
  head.removeChild(link);*/
  file = buildBlob(css_data, 'text/css');
  url = window.URL.createObjectURL(file);
  link.setAttribute("href", url);
  document.getElementsByTagName('head')[0].appendChild(link);
}
function buildBlob(data, type){
  var file;
  try{
    file = new Blob([data], {type: type});
  }
  catch(e){
    window.BlobBuilder = window.BlobBuilder ||
      window.WebKitBlobBuilder ||
      window.MozBlobBuilder ||
      window.MSBlobBuilder;
    if(e.name == 'TypeError' && window.BlobBuilder){
      var bb = new BlobBuilder();
      bb.append(data);
      file = bb.getBlob(type);
    }
    else if(e.name == "InvalidStateError"){
      file = new Blob([data], {type: type});
    }
    else{
      console.log("No Blob building supported.");
    }
  }
  return file;
}
function getHelper(url) {
  return fetch(url, {
    headers: {
      Accept: 'charset=utf-8',
      },
      method: 'GET',
      credentials: 'include',
  });
}
function isPolyFillTarget(){
  let browser = getBrowser();
  return browser.includes("IE") || browser.includes("Safari");
}
function getBrowser(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}
