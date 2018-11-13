/**
 * 日期时间过滤器
 */
import format from 'date-fns/format'
import Vue from 'vue'

Vue.filter('date-format',(val,formatStr='YYYY-MM-DD HH:mm:ss') =>{
  return format(val,formatStr)
})
