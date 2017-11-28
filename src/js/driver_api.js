let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}

const API_ROOT = extConfig.host || `https://test.driver.quchuxing.com.cn`

const api = require('./apiUtils')

import { _apiPOST, _apiGET, _apiPUT, _apiDELETE } from './apiUtils'

const REQUEST_TYPE = ['GET','POST','PUT','DELETE']

// export const postUnlockByNetWorking = (options) => _apiPOST(`${API_ROOT}/locks/unlock_by_networking`, options)
export const postWechatLogin = (options) => _apiPOST(`${API_ROOT}/weapp/login`, options)

// travel/nearby/person 附近的人（车主 乘客）
export const postNearbyOfPeople = (options) => _apiPOST(`${API_ROOT}/travel/nearby/person`, options)