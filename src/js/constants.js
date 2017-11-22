let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}
export const MEETING_STATUS = {
    'past'    : 'last-time',
    'select'  : 'select-time',
    'reserve' : 'reserve-time',
    'normal'  : 'normal-time'
}