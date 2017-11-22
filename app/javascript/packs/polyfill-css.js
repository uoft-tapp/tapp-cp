cssPolyfill();
function cssPolyfill(){
  if (isPolyFillTarget()){
    let links = document.getElementsByTagName("link");
    for(let index = 0; index < links.length; index++){
      let url = links[index].getAttribute("href");
      if (!url.includes("http://0.0.0.0:8080")){
        setCSS(url, index);
      }
    }
  }
}
function setCSS(url, index){
  let links = document.getElementsByTagName("link");
  copy = links[index]
  copy.setAttribute("href", "/polyfill?file="url);
  document.getElementsByTagName('head')[0].appendChild(copy);
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
