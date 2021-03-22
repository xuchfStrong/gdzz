import CryptoJS from 'crypto-js'
import save from '@/utils/save'
import { encrypt, randomWord } from '@/utils/rsa'
import moment from 'moment'
import { checkStatus } from '@/api/game'

export function checkFuzhuStatus(){
  return new Promise((reslove, reject) => {
    const gameLoginInfo = save.getGameLoginInfo()
    const usernamePlatForm = gameLoginInfo.usernamePlatForm
    const passwordPlatForm = gameLoginInfo.passwordPlatForm
    const userId = gameLoginInfo.userId

    const secretKey = randomWord(false, 16)
    const cipherUserId = CryptoJS.AES.encrypt(userId, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
    const cipherUsername = CryptoJS.AES.encrypt(usernamePlatForm, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
    const cipherPwd = CryptoJS.AES.encrypt(passwordPlatForm, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
    const params = {
      userId: cipherUserId,
      username: cipherUsername,
      password: cipherPwd,
      k: encrypt(secretKey) // ase的密钥
    }
    const reslove1 = reslove
    const reject1 = reject
    checkStatus(params).then(res => {
      let fuzhuStatusG = {}
      if (res.code === 200) {
        const resPlain = CryptoJS.AES.decrypt(res.data, CryptoJS.enc.Utf8.parse(secretKey), {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
        const resObj = JSON.parse(resPlain)
        const calcres = calsIsExpired(resObj.end_time)
        fuzhuStatusG = {
          fuzhu_vip: resObj.fuzhu_vip,
          end_time: calcres.end_time,
          isExpired: calcres.isExpired
        }
      }
      reslove1(fuzhuStatusG)
    }).catch(err => {
      reject1(err)
    })
  })
}

// 计算辅助到期时间
function calsIsExpired(endTime) {
  const isExpired = moment(endTime).isBefore(new Date())
  const fuzhuStatus = {}
  if (isExpired) {
    fuzhuStatus.isExpired = true
    fuzhuStatus.end_time = '已经过期，请购买！'
  } else {
    fuzhuStatus.isExpired = false
    fuzhuStatus.end_time = endTime
  }
  return fuzhuStatus
}