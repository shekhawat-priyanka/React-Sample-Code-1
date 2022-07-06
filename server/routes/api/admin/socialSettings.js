
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const Setting = require('../../../models/Setting');
var response = require('../../../config/response');



// @route GET api/admin/socialSetting/
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    let facebookSetting = await Setting.findOne({key: "facebook"});
    let instagramSetting = await Setting.findOne({key: "instagram"});
    let linkedInSetting = await Setting.findOne({key: "linkedIn"});
    let twitterSetting = await Setting.findOne({key: "twitter"});

    if (facebookSetting===null &&
      instagramSetting===null &&
      linkedInSetting===null &&
      twitterSetting===null) 
    { 
      facebookSetting.set('instagram_setting', instagramSetting, {strict: false})
      facebookSetting.set('linkedIn_setting', linkedInSetting,{strict: false})
      facebookSetting.set('twitter_setting', twitterSetting,{strict: false})
      
     return response.successResponse(res, facebookSetting, ' Setting data.');
    }
   else{
    let facebookSetting = await Setting.findOne({key: "facebook"}).select(['value','is_to_be_displayed']);
    let instagramSetting = await Setting.findOne({key: "instagram"}).select(['value','is_to_be_displayed']);
    let linkedInSetting = await Setting.findOne({key: "linkedIn"}).select(['value','is_to_be_displayed']);
    let twitterSetting = await Setting.findOne({key: "twitter"}).select(['value','is_to_be_displayed']);
    
    facebookSetting.set('instagram_setting', instagramSetting, {strict: false})
    facebookSetting.set(  'linkedIn_setting', linkedInSetting,{strict: false})
    facebookSetting.set(  'twitter_setting', twitterSetting,{strict: false})
  
    return response.successResponse(res, facebookSetting, 'Setting data.');
   }
  } catch (err) {
    // console.error(err.message);
    if (err.kind == 'ObjectId') {
      return response.errorResponse(
        res,
        { msg: 'Setting not found.' },
        'Setting not found.',
        400
      );
    }
    return response.errorResponse(res, {}, 'Server Error', 500);
  }
});

// @route POST api/admin/socialSetting/
// @access Private
router.post(
  '/',
  [
    auth
  ],
  async (req, res) => {
    
    const { 
      facebook, 
      instagram, 
      linkedIn, 
      twitter, 
      facebookCheck, 
      instagramCheck, 
      linkedInCheck, 
      twitterCheck } = req.body;
    
    try {
    
      let facebookSetting = await Setting.findOne({key: "facebook"});
      let instagramSetting = await Setting.findOne({key: "instagram"});
      let linkedInSetting = await Setting.findOne({key: "linkedIn"});
      let twitterSetting = await Setting.findOne({key: "twitter"});
      let socialSetting = [
        new Setting({
          key: "facebook",
          value: facebook,
          is_to_be_displayed: facebookCheck
         }),
         new Setting({
          key: "instagram",
          value: instagram,
          is_to_be_displayed: instagramCheck
         }),
         new Setting({
          key: "linkedIn",
          value: linkedIn,
          is_to_be_displayed: linkedInCheck
         }),
         new Setting({
          key: "twitter",
          value: twitter,
          is_to_be_displayed: twitterCheck
         }),

      ]
      if (facebookSetting===null &&
          instagramSetting===null &&
          linkedInSetting===null &&
          twitterSetting===null)
      {
        socialSetting.map(async (setting, index) => {
          await setting.save();
        });
    let setting = await Setting.find()
    let settings = await Setting.findOne({key: "facebook"});
    let instagramsetting = await Setting.findOne({key: "instagram"});
    let linkedinsetting = await Setting.findOne({key: "linkedIn"});
    let twittersetting = await Setting.findOne({key: "twitter"});
    
    settings.set('instagram_setting', instagramsetting, {strict: false});
    settings.set('linkedIn_setting', linkedinsetting,{strict: false});
    settings.set('twitter_setting', twittersetting,{strict: false});
    return response.successResponse(res, settings, 'Setting Updated.');
      }
      else{

        let facebookSettingUpdate = await Setting.findOneAndUpdate(
          { key: "facebook" },
          {
            value: facebook,
            is_to_be_displayed: facebookCheck,
          }
        );   
        let instagramSettingUpdate = await Setting.findOneAndUpdate(
          { key: "instagram" },
          {
            value: instagram,
            is_to_be_displayed: instagramCheck
          }
        );  
        let linkedInSettingUpdate = await Setting.findOneAndUpdate(
          { key: "linkedIn" },
          {
            value: linkedIn,
            is_to_be_displayed: linkedInCheck
          }
        );  
        let twitterSettingUpdate = await Setting.findOneAndUpdate(
          {key: "twitter" },
          {
            value: twitter,
            is_to_be_displayed: twitterCheck
          }
        );    
        let settings = await Setting.findOne({key: "facebook"});
        let instagramsetting = await Setting.findOne({key: "instagram"});
        let linkedinsetting = await Setting.findOne({key: "linkedIn"});
        let twittersetting = await Setting.findOne({key: "twitter"});
        
        settings.set('instagram_setting', instagramsetting, {strict: false});
        settings.set('linkedIn_setting', linkedinsetting,{strict: false});
        settings.set('twitter_setting', twittersetting,{strict: false}) ;
        return response.successResponse(res, settings, 'Setting Updated.');
    } 
  }catch (err) {
      // console.error(err.message);
      return response.errorResponse(res, {}, 'Server Error.', 500);
    }
  }
);

module.exports = router;
