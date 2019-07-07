'use strict'

Object.assign(Date,{

  pad2(v){return String(v).padStart(2,0)}

, formate(format, date){
    format = format || 'J/MM/YYYY h:mm'
    date   = date || new Date()
    if ( typeof date === 'number' ) date = new Date(date)
    var fdate = format.replace(/([a-zA-Z]+)/g, function(all, grain){
      switch (grain) {
        case 'J'    :return date.getDate()
        case 'JJ'   :return Date.pad2(date.getDate())
        case 'M'    :return 1 + date.getMonth()
        case 'MM'   :return Date.pad2(1 + date.getMonth())
        case 'YY'   :return date.getYear()
        case 'YYYY' :return date.getFullYear()
        case 'h'    :return date.getHours()
        case 'hh'   :return Date.pad2(date.getHours())
        case 'm'    :return date.getMinutes()
        case 'mm'   :return Date.pad2(date.getMinutes())
        case 's'    :return date.getSeconds()
        case 'ss'   :return Date.pad2(date.getSeconds())
        default:
          return grain
      }
    })
    // format = format.replace(/([a-zA-Z]+)/g, '${$1}')
    // console.log("Je vais formater la date : ", format)
    // const J   = date.getDate()
    //     , JJ  = J.length > 2 ? J : `0${J}`
    //     , M   = ''+(1 + date.getMonth())
    //     , MM  = M.padStart(2,'0')
    //     , YY  = date.getYear()
    //     , YYYY  = date.getFullYear()
    //     , h     = ''+date.getHours()
    //     , hh    = h.padStart(2,'0')
    //     , m     = ''+date.getMinutes()
    //     , mm    = m.padStart(2,'0')
    //     , s     = ''+date.getSeconds()
    //     , ss    = s.padStart(2,'0')
    // let fdate = eval('`'+format+'`')
    console.log("Date finale = ", fdate)
    return fdate
  }
})
