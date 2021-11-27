// import { http, httpForm } from '@/utils/request.js'
import {requestProxy, http, httpForm} from './request.js'

// 登录游戏平台
export function loginGame(params) {
  return http.get(
    'http://login.dgzz1.com:20002/',
    {params}
  )
}

// 获取装备信息
export function zhuangbei(params) {
  return http.get(
    'http://120.53.14.241:12001/zhuangbei/',
    {params}
  )
}

// 查询装备属性
export function taozhuang(data) {
  return http.post(
    'http://120.53.14.241:12001/taozhuang/',
    data
  )
}

// 通过自己写的proxy登录
export function loginByProxy(params) {
  return http.get(
    'http://192.144.211.81:11658/jqcm_proxy.php',
    {params}
  )
}

// 获取服务器时间
export function serverTime(params) {
  return http.get(
    'http://login.dgzz1.com:20002/ServerTime',
    {params}
  )
}

// 获取辅助状态
export function checkStatus(data) {
  return http.post(
    '/gdzznew/check_status.py',
    data
  )
}

// 检查用户
export function checkUser(params) {
  return http.get(
    '/gdzznew/check_user.php',
    {params}
  )
}

// 添加用户
export function addUser(data) {
  return http.post(
    '/gdzznew/add_user.py',
    data
  )
}

// 获取视图配置
export function getViewConfig(params) {
  return http.get(
    '/gdzznew/viewConfig.php',
    {params}
  )
}

// 获取更新信息
export function getUpdate(params) {
  return http.get(
    '/gdzznew/update.php',
    {params}
  )
}

// 获取服务器
export function getServer(params) {
  return http.get(
    '/gdzznew/server.php',
    {params}
  )
}

// 获取远端选项信息
export function getRemoteOptions(params) {
  return http.get(
    '/gdzznew/options.php',
    {params}
  )
}

// 登录辅助
export function loginFuzhu(params) {
  return http.get(
    '/gdzznew/api/denglu.py',
    {params}
  )
}

// 获取角色信息
export function getRoleInfo(params) {
  return http.get(
    '/gdzznew/get_role_info.php',
    {params}
  )
}

// 获取配置信息
export function getConfigInfo(params) {
  return http.get(
    '/gdzznew/get_setting.php',
    {params}
  )
}

// 修改配置信息
export function changeConfigInfo(data) {
  return http.post(
    '/gdzznew/change_setting.php',
    data
  )
}

export function getDescription(params) {
  return http.get(
    '/gdzznew/description.php',
    {params}
  )
}

export function getHelp(params) {
  return http.get(
    '/gdzznew/help_info.php',
    {params}
  )
}

export function getGonglue(params) {
  return http.get(
    '/gdzznew/gonglue.php',
    {params}
  )
}

export function startGuaji(params) {
  return http.get(
    '/gdzznew/start.php',
    {params}
  )
}

export function stopGuaji(params) {
  return http.get(
    '/gdzznew/stop.php',
    {params}
  )
}

export function getUtils(params) {
  return http.get(
    '/gdzznew/utils.php',
    {params}
  )
}

// 转移时间
export function transferTime(data) {
  return httpForm.post(
    '/gdzznew/transfer_time.php',
    data
  )
}

