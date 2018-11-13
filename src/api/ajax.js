/**
 * Ajax请求函数
 */
import axios from 'axios'
export default function ajax(url ,data = {} ,type = 'GET') {
  return new Promise(function (resolve, reject) {
    let promise;
    if(type === 'GET'){
      let dataStr = '?'
      Object.keys(data)//得到对象中key转成数组
        .forEach(key => {
          dataStr += key + '=' + data[key] + '&'
        })
      if(dataStr != ''){
        dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'));
        url = url+dataStr;
      }
      console.log("url"+url);
      promise = axios.get(url);
    }else {
      promise = axios.post(url,data);
    }
    promise.then((response) => {
      //请求成功
      resolve(response.data);
    }).catch(function (error) {
      //请求失败
      reject(error)
    })
    return promise
  })
}
