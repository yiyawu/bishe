const jwt  = require('jsonwebtoken');
//生成token
exports.buildToken = function(payload) {
  if(payload != null){
    let token = jwt.sign(payload, 'wcybysj');
    console.log(token);
    return token;
  }
}
//验证token
exports.checkToken = function(token) {
  let checkState = jwt.verify(token, 'wcybysj',(error, decoded) => {
    if (error) {
      console.log(error.message);
    }
    console.log(decoded);
    return 1;
  });
}