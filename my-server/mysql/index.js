var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});

let query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          reject( err )
        } else {
          console.log("连接数据库成功")
          connection.query(sql, values, ( err, rows) => {
            if ( err ) {
              reject( err )
              console.log( err )
            } else {
             // console.log(rows)
              resolve( rows )
            }
            connection.release()
          })
        }
      })
    })
}
let createTable = function( sql ) {
  return query( sql, [] )
}
//-----web接口-----
//=====用户模块=====
//检查用户名
exports.checkLogin = function( userName ){
  let _sql = `SELECT * FROM admin where userName = "${userName}"`;
  return query(_sql)
}
//获取全部用户信息
exports.searchUser = function(){
  let _sql = 'SELECT * from userinfo right join user  on userinfo.userId = user.userId';
  return query(_sql)
}

//通过用户微信查找用户信息
exports.searchUserByName = function( nickName ){
  let _sql = `select * from user where nickName like "%${nickName}%"`;
  return query(_sql)
}
exports.deleteUser = function( userId ){
  let _sql = `delete from user where userId = "${userId}" `;
  return query(_sql)
}
//=====题目模块=====
//查看题目
exports.searcherQuestion = function(){
  let _sql = 'SELECT * FROM question';
  return query(_sql)
}
//添加题目信息
exports.addQuestionInfo = function( value ){
  let _sql = "insert into question(questionName, questionType, creatAt) values(?, ?, ?);"
  return query(_sql, value)
}
//添加题目选项信息
exports.addQuestionItemsInfo = function( value ){
  let _sql = "insert into questionitems(title, isRight, questionId, creatAt) values(?, ?, ?, ?);"
  return query(_sql, value)
}
//修改题目信息
exports.updateQuestionInfo = function(questionName, questionType ,questionId){
  let _sql =  `update question set questionName="${questionName}", questionType="${questionType}", updateAt=now() where questionId = "${questionId}" `;
  return query(_sql)
}
//查找题目1--无类别有关键字
exports.searchQuestion1 = function(questionName){
  let _sql = `select * from question where questionName like "%${questionName}%" `;
  return query(_sql)
}
//查找题目2--有类别无关键字
exports.searchQuestion2 = function(questionType){
  let _sql = `select * from question where questionType = "${questionType}"`;
  return query(_sql)
}
//查找题目3--有类别有关键字
exports.searchQuestion3 = function(questionType, questionName){
  let _sql = `select * from question where questionType = "${questionType}" and questionName like "%${questionName}%" `;
  return query(_sql)
}
//删除题目
exports.deleteQuestion = function( questionId){
  let _sql =  `delete question,questionitems from question left join questionitems on question.questionId=questionitems.questionId where question.questionId = "${questionId}"`;
  return query(_sql)
}
//删除题目选项
exports.deleteQuestionItems = function(questionId){
  let _sql = `delete from questionitems where questionId = "${questionId}" `;
  return query(_sql )
}


//=====设备模块=====
//获取设备
exports.getCameraInfo = function(){
  let _sql = 'select * from camera';
  return query(_sql )
}
//获取设备
exports.getCameraInfoById = function(cameraId){
  let _sql = `select * from camera where cameraId = "${cameraId}"`;
  return query(_sql )
}
//为摄像头添加推流地址
exports.addCameraPushUrl = function(pushUrl, playUrl, cameraId){
  let _sql =  `update camera set pushUrl="${pushUrl}", playUrl="${playUrl}" where cameraId = "${cameraId}" `;
  return query(_sql)
}
//查找设备
exports.searchCameraInfo = function(cameraName){
  let _sql = `select * from camera where cameraName like "%${cameraName}%"` ;
  return query(_sql )
}
//添加设备
exports.addCameraInfo = function(value){
  let _sql = "insert into camera(cameraName, cameraIP, address, creatAt) values(?, ?, ?, ?);"
  return query(_sql, value)
}
//将网页端信息与硬件绑定
exports.addhardware = function( value ){
  let _sql = "insert into hardware(cameraId, creatAt) values(?, ?);"
  return query(_sql, value)
}
//查找硬件
exports.searchCamera = function(){
  let _sql = `select * from hardware ` ;
  return query(_sql )
}
//启动设备更改设备状态码
exports.CameraStyleBegin = function(){
  let _sql = "update  hardware set useFlag = 1;" 
  return query(_sql)
}
//关闭设备更改设备状态码
exports.CameraStyleEnd = function(){
  let _sql = "update  hardware set useFlag = 0;" 
  return query(_sql)
}
//更新设备
exports.updateCameraInfo = function(cameraName, cameraIP, address, cameraId){
  let _sql =  `update camera set cameraName="${cameraName}", address="${address}", cameraIP="${cameraIP}", updateAt=now() where cameraId = "${cameraId}" `;
  return query(_sql)
}
//删除设备
exports.deleteCameraInfo = function(cameraId){
  let _sql = `delete from camera where cameraId = "${cameraId}" `;
  return query(_sql )
}
//历史会议模块
//获取历史会议
exports.getMeeting = function(){
  let _sql = `select * from roominfo ` ;
  return query(_sql )
}
//查询历史会议
exports.searchMeeting = function(roomName){
  let _sql = `select * from roominfo where roomName like "%${roomName}%"` ;
  return query(_sql )
}
//删除历史会议
exports.deleteMeetingInfo = function(roomId){
  let _sql = `delete from roominfo where roomNo = "${roomId}" `;
  return query(_sql )
}
//查询认证用户的真实姓名
exports.getTrueName = function(userId){
  let _sql = `select trueName from userinfo where userId = "${userId}"` ;
  return query(_sql )
}
//查询小程序上的历史记录
exports.getMyMeeting = function(userId){
  let _sql = `select * from roominfo where attendeeArray like "%${userId}%" or userId = "${userId}"` ;
  return query(_sql )
}
//查询小程序上的历史记录
exports.getMyCreat = function(userId){
  let _sql = `select * from roominfo where userId = "${userId}"` ;
  return query(_sql )
}
//查询小程序上的历史记录
exports.getMyAdd = function(userId){
  let _sql = `select * from roominfo where attendeeArray like "%${userId}%" and userId not in  ("${userId}") ` ;
  return query(_sql )
}

//----小程序接口------
//获取微信授权
exports.getAuthorize = function( value ){
  let _sql = "insert into user(sessionKey, nickName, avatarUrl, openId, creatAt, sessionId) values(?,?,?,?,?,?);"
  return query(_sql, value)
}
//认证用户更新用户信息
exports.getUserInfo = function( value ){
  let _sql = "insert into userinfo(userId, trueName, phone, email, sex) values(?,?,?,?,?);"
  return query(_sql, value)
}
//获取认证用户的信息
exports.searchWeixinUser = function(){
  let _sql = 'SELECT * from userinfo';
  return query(_sql)
}
//通过创建微信授权的时间获取用户id
exports.getUserId = function( time ){
  let _sql = `select userId from user where creatAt = "${time}"`;
  return query(_sql)
}
//添加微信用户信息
exports.addUser = function( userId, nickName, avatarUrl){
   let _sql = `update user set nickName="${nickName}" ,avatarUrl="${avatarUrl}", updatedAt=now() where userId = "${userId}" `;
   return query(_sql)
}
//查询用户信息

//添加用户创建直播间信息
exports.addRoom = function( value ){
  let _sql = "insert into roominfo(userId, roomName, recorder, attendeeArray, template, creatAt) values(?, ?, ?, ?, ?, ?);"
  return query(_sql, value)
}
//添加会议直播间的用户生成对应的推流地址和播放地址
exports.addRoomMembers = function( value ){
  let _sql = "insert into membersinfo(roomNo, userId, membersInfo, authority) values(?, ? ,?, ?);"
  return query(_sql, value)
}
// 通过userId和roomId查找用户的推流地址和播放地址
exports.searchRoomMembers = function( roomId, userId ){
  let _sql = `select membersInfo from membersinfo where roomNo = "${roomId}" and userId = "${userId}"`;
  return query(_sql)
}
// 通过userId和roomId查找出自己以外的用户url集 
exports.getRoomMembers = function( roomId, userId ){
  let _sql = `select membersInfo,userId from membersinfo where roomNo = "${roomId}" and userId not in ("${userId}")`;
  return query(_sql)
}
//根据roomId修改用户推理状态
// 通过userId和roomId查找用户的推流地址和播放地址
exports.changeRoomMembersPush = function( roomNo ){
  let _sql = `update membersInfo set flag = 1 where roomNo = "${roomNo}"`;
  return query(_sql)
}
// 通过roomId查找出改roomId下的的用户url集 
exports.getRoomMembersAll = function(roomId){
  let _sql = `select membersInfo,userId from membersinfo where roomNo = "${roomId}" `;
  return query(_sql)
}
// 通过roomId查找出自己要加入的房间信息 
exports.getRoomInfo = function( roomId ){
  let _sql = `select * from roomInfo where roomNo = "${roomId}"`;
  return query(_sql)
}

//用户签到模块
//用户签到信息录入
exports.getUserAddress = function(value){
  let _sql = "insert into attendance(userId, address, time, lat, lng) values(?, ? ,?, ?, ?);"
  return query(_sql, value)
}

//用户认证模块
//获取用户认证题目的选项信息
exports.getQuestionItems = function(){
  let _sql = `select * from questionitems`;
  return query(_sql)
}
//查找用户认证信息
exports.getUserAuthFlag = function(userId){
  let _sql = `select authFlag from user where userId = "${userId}"`;
  return query(_sql)
}
//添加用户认证信息
exports.addUserAuthFlag = function(userId){
  let _sql = `update user set AuthFlag = 1 where userId = "${userId}"`;
  return query(_sql)
}