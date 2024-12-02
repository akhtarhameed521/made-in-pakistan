"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middleware/upload.middleware");
const setting_controller_1 = require("../controllers/setting.controller");
const router = (0, express_1.Router)();
router.route('/setting').post(upload_middleware_1.upload.fields([
    { name: "headerLogo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 }
]), setting_controller_1.settingController);
router.route('/setting').get(setting_controller_1.getSettingController);
router.route('/setting/:id').put(upload_middleware_1.upload.fields([
    { name: "headerLogo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 }
]), setting_controller_1.updateSettingController);
router.route('/setting/:id').delete(setting_controller_1.deleteSettingController);
exports.default = router;
