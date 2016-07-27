var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'a7474310@gmail.com',
        pass: 'earik2123'
    }
});

var options = {
    from: 'a7474310@gmail.com',
    to: 'a7474310@gmail.com', 
    subject: '³o¬O node.js µo°eªº´ú¸Õ«H¥ó',
};

transporter.sendMail(options, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('123 ' + info.response);
    }
});

process.env.PORT || 5000;
console.log('port ' + (process.env.PORT || 5000));
