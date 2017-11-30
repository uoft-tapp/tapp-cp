cssPolyfill();
function cssPolyfill(){
  if (isPolyFillTarget()){
    let links = document.getElementsByTagName("link");
    for(let index = 0; index < links.length; index++){
      let url = links[index].getAttribute("href");
      if (!url.includes("http://0.0.0.0:8080")){
        let parts = url.split("/");
        let file = parts[parts.length-1].split("?")[0];
        setPolyfill(file, links[index]);
      }
    }
  }
}
function setPolyfill(file, link){
  let head = document.getElementsByTagName('head')[0];
  let full_url = window.location.href;
  let domain = full_url.replace(window.location.pathname, "");
  let style = document.createElement("link");
  console.log("link: "+domain+"/polyfill/"+file);
  style.setAttribute("href", domain+"/polyfill/"+file);
  style.setAttribute('type', 'text/css');
  style.setAttribute('rel', 'stylesheet');
  head.appendChild(style);
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
