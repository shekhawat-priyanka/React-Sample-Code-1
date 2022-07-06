
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const Setting = require('../../../models/Setting');
var response = require('../../../config/response');



// @route GET api/admin/setting/
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    let headerSetting = await Setting.findOne({key: "header_script"}).select(["_id"])
    let footerSetting = await Setting.findOne({key: "footer_script"})
    let copyrightSetting = await Setting.findOne({key: "copyright_text"})
    if (headerSetting===null&&footerSetting===null&&copyrightSetting===null)  
    { 
      headersetting.set('footer_setting', footersetting, {strict: false});
      headersetting.set('copyright_setting', copyrightsetting, {strict: false})
     return response.successResponse(res, headersetting, ' Setting data.');
    }
   else{
    let headerSetting = await Setting.findOne({key: "header_script"}).select([
      'value',
    ]);
    let footerSetting = await Setting.findOne({key: "footer_script"}).select([
      'value',
    ]);
    let copyrightSetting = await Setting.findOne({key: "copyright_text"}).select([
      'value',
    ]);
    headerSetting.set('footer_setting', footerSetting, {strict: false});
    headerSetting.set('copyright_setting', copyrightSetting, {strict: false});
    return response.successResponse(res, headerSetting, 'Setting data.');
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

// @route POST api/admin/setting/
// @access Private
router.post(
  '/',
  [
    auth,
  ],
  async (req, res) => {
   
    const { header_script, footer_script, copyright_text } = req.body;

    try {
    
      let headerSetting = await Setting.findOne({key: "header_script"})
      let footerSetting = await Setting.findOne({key: "footer_script"})
      let copyrightSetting = await Setting.findOne({key: "copyright_text"})
      let websiteSetting = [
        new Setting({
          key: "header_script",
          value: header_script,
          is_to_be_displayed: true,
        }),
        new Setting({
          key: "footer_script",
          value: footer_script,
          is_to_be_displayed: true,
        }),
        new Setting({
          key: "copyright_text",
          value: copyright_text,
          is_to_be_displayed: true,
        })
      ]
      if (headerSetting===null&&footerSetting===null&&copyrightSetting===null)
      {     
        websiteSetting.map(async (setting, index) => {
        await setting.save();
      });

        let setting = await Setting.find()
        let settings = await Setting.findOne({  key: "header_script" });
        let footersetting = await Setting.findOne({  key: "footer_script" });
        let copyrightsetting = await Setting.findOne({  key: "copyright_text" });
        settings.set('footer_setting', footerSetting, {strict: false});
        settings.set('copyright_setting', copyrightSetting, {strict: false});
        return response.successResponse(res, settings, 'Setting Updated.');
      }
      else{     
      let headerSettingUpdate = await Setting.findOneAndUpdate(
        { key: "header_script" },
        {
          value: header_script,
          is_to_be_displayed: true,
        }
      );         
          let footerSettingUpdate = await Setting.findOneAndUpdate(
            { key: "footer_script" },
            {
              value: footer_script,
              is_to_be_displayed: true,
            }
          );
          let copyrightSettingUpdate = await Setting.findOneAndUpdate(
            { key: "copyright_text" },
            {
              value: copyright_text,
              is_to_be_displayed: true,
            }
          );
        let settings = await Setting.findOne({  key: "header_script" });
        let footersetting = await Setting.findOne({  key: "footer_script" });
        let copyrightsetting = await Setting.findOne({  key: "copyright_text" });
        settings.set('footer_setting', footerSetting, {strict: false});
        return response.successResponse(res, settings, 'Setting Updated.');
    } 
  }catch (err) {
      console.error(err);
      return response.errorResponse(res, {}, 'Server Error.', 500);
    }
  }
);

module.exports = router;
