const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Execute this with node ste-21-cloudinary-upload.js
// Make sure CLOUDINARY_URL is set in your environment. Example:
// export CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@dzlatnokr

cloudinary.config({
  secure: true
});

const BRAND_DIR = path.join(__dirname, 'apps/web/public/brand');

async function uploadAssets() {
  if (!process.env.CLOUDINARY_URL) {
    console.error('Error: CLOUDINARY_URL environment variable is missing.');
    console.error('Please set it using the credentials for the "dzlatnokr" cloud.');
    process.exit(1);
  }

  try {
    const files = fs.readdirSync(BRAND_DIR);
    
    for (const file of files) {
      if (!file.match(/\.(webp|png|jpg|jpeg|svg|gif)$/i)) continue;
      
      const filePath = path.join(BRAND_DIR, file);
      console.log(`Uploading ${file}...`);
      
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'steadywrk/brand',
          use_filename: true,
          unique_filename: false,
          overwrite: true
        });
        console.log(`✅ Uploaded ${file} to: ${result.secure_url}`);
      } catch (err) {
        console.error(`❌ Failed to upload ${file}:`, err.message);
      }
    }
    
    console.log('\nAll brand assets processed.');
  } catch (error) {
    console.error('Error reading brand directory:', error);
  }
}

uploadAssets();
