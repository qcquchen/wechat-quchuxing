let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}

const API_ROOT = extConfig.host || `https://t1.driver.quchuxing.com.cn`

const api = require('./apiUtils')

import { _apiPOST, _apiGET, _apiPUT, _apiDELETE } from './apiUtils'

const REQUEST_TYPE = ['GET','POST','PUT','DELETE']

// export const postUnlockByNetWorking = (options) => _apiPOST(`${API_ROOT}/locks/unlock_by_networking`, options)
export const postWechatLogin = (options) => _apiPOST(`${API_ROOT}/weapp/login`, options)

// travel/nearby/person 附近的人（车主 乘客）
export const postNearbyOfPeople = (options) => _apiPOST(`${API_ROOT}/travel/nearby/person`, options)

// 检测用户是否登录
export const postFindLogin = (options) => _apiPOST(`${API_ROOT}/checkUser`, options)

// 登录注册 login_weixinapp
export const postLogin = (options) => _apiPOST(`${API_ROOT}/login_weixinapp`, options)

// 获取验证码
export const postSendCaptcha = (options) => _apiPOST(`${API_ROOT}/sendCaptcha`,options)

// 车主最近行程
export const postRecentTrip = (options) => _apiPOST(`${API_ROOT}/travel/latestOne`,options)

// 检测是否有家庭地址和公司地址 driver/address/searchAddressWeapp
export const getSearchAddress = (options) => _apiPOST(`${API_ROOT}/driver/address/searchAddressWeapp`, options)

// 添加公司/家地址
export const postHomeAndCompanyAddress = (options) => _apiPOST(`${API_ROOT}/driver/address/changeAddressWeapp`, options)

// 车主发布行程 /travel/createlv2
export const postCompanyJonrey = (options) => _apiPOST(`${API_ROOT}/travel/createlv2`, options)

// 路径规划 /travel/pathPlanning
export const getLine = (options) => _apiPOST(`${API_ROOT}/travel/pathPlanning`, options)