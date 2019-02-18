// set function parseTime,formatTime to filter
import getters from '@/store/getters'

export { parseTime, formatTime } from '@/utils'
import store from '@/store'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
export function parseUserName(userName) {
  return store.getters.allUserNameMap[userName]
}

export function parseOrderStatus(statusCode) {
  let status = ''
  if (statusCode === 0){
    status = '预览'
  } else if (statusCode === 1) {
    status = '生成预览中...'
  } else if (statusCode === 2) {
    status = '下载预览'
  }
  return status
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
