let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}

const API_ROOT = extConfig.host || `https://t1.passenger.quchuxing.com.cn`

const api = require('./apiUtils')

import { _apiPOST, _apiGET, _apiPUT, _apiDELETE } from './apiUtils'

const REQUEST_TYPE = ['GET','POST','PUT','DELETE']

// export const getActivitiesInfo = (id, options) => _apiGET(`${API_ROOT}/activities/${id}`,options)
// 
// 乘客最近行程 /travel/latestOne
export const getPassengerRecentTrip = (options) => _apiPOST(`${API_ROOT}/travel/latestOne`, options)

// 乘客创建行程 /travel/passenger/create
export const postJounrey = (options) => _apiPOST(`${API_ROOT}/travel/passenger/create`, options)

// 乘客匹配车主 /travel/matching
export const postMatchCompany = (options) => _apiPOST(`${API_ROOT}/travel/matching`, options)

// 匹配乘客 /travel/matching/passenger
export const postMatchPeople = (options) => _apiPOST(`${API_ROOT}/travel/matching/passenger`, options)

// 支付
export const postPay = (options) => _apiPOST(`${API_ROOT}/orders/createlv4`, options)
