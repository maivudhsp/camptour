const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.Cloudinary_name,
    api_key: process.env.Cloudinary_key,
    api_secret: process.env.Cloudinary_secret
})
 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'some-folder-name',
    allowsFormats: ['jpeg', 'png', 'jpg']
  },
});

module.exports = {
    cloudinary, storage
}