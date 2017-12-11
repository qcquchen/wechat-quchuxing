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

// 个人主页
export const getUserInfo = (options) => _apiPOST(`${API_ROOT}/driver/personalInfo`, options)

// 附近群列表
export const getNearTheGroup = (options) => _apiPOST(`${API_ROOT}/driver/group/nearby`, options)

// 创建群
export const creatGroup = (options) => _apiPOST(`${API_ROOT}/driver/group/creatGroup`, options)

// 支付完成之后查看该订单详情 /travel/travelInfo_Driver
export const getOrderInfo = (options) => _apiPOST(`${API_ROOT}/travel/travelInfo_Driver`, options)

// 加入附近的群 driver/group/joinGroup
export const postJoinGroup = (options) => _apiPOST(`${API_ROOT}/driver/group/joinGroup`, options)

// 我的群 driver/group/myGroup
export const getMyGroupList = (options) => _apiPOST(`${API_ROOT}/driver/group/myGroup`, options)

// 群详情 driver/group/groupInfo
export const getGroupInfo = (options) => _apiPOST(`${API_ROOT}/driver/group/groupInfo`, options)

// /driver/group/detailGroup 家公司群内详情信息
export const getGroupDetails = (options) => _apiPOST(`${API_ROOT}/driver/group/detailGroup`, options)

// driver/group/detailGrouph 会议群内详细信息
export const getMeetingGroupDetails = (options) => _apiPOST(`${API_ROOT}/driver/group/detailGrouph`, options)

// /driver/upload/audit_weapp 车主认证
export const postCarInfo = (options) => _apiPOST(`${API_ROOT}/driver/upload/audit_weapp`, options)

// travel/detaillv2 车主查看已订座乘客
export const getBookedPeople = (options) => _apiPOST(`${API_ROOT}/travel/detaillv2`, options)