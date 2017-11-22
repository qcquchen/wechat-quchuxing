let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}
console.log(extConfig,'-------------extConfig')

// const API_ROOT = extConfig.host || `https://devapi.kuban.io/api/v1`

// const api = require('./apiUtils')
// import { _apiPOST, _apiGET, _apiPUT, _apiDELETE } from './apiUtils'

// const REQUEST_TYPE = ['GET','POST','PUT','DELETE']

// export const getDomainUrl = (optioins) => _apiGET(`${API_ROOT}/uploads/token?bucket=kuban`,optioins)
// export const getActivitiesInfo = (id, options) => _apiGET(`${API_ROOT}/activities/${id}`,options)
// export const postUnlockByNetWorking = (options) => _apiPOST(`${API_ROOT}/locks/unlock_by_networking`, options)