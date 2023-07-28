export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
// 判断版本号
export const compareVersion=(v2:string)=> {
    const version = wx.getSystemInfoSync().SDKVersion;
    let v1 = version.split('.')
    let v2Arr = v2.split('.')
    const len = Math.max(v1.length, v2Arr.length)
  console.log('version',version)
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2Arr.length < len) {
        v2Arr.push('0')
    }
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
  
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  }
