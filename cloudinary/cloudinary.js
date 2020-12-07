const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'mytangerine', 
    api_key: '585552947596123', 
    api_secret: 'xzMRP4F_1xg6gdKHErybJqLkuPM' 
  });

module.exports = cloudinary;