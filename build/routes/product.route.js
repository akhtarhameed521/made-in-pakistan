"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middleware/upload.middleware"); // Adjust the path as necessary
const product_controllers_1 = require("../controllers/product.controllers");
const router = (0, express_1.Router)();
router.post('/product', upload_middleware_1.upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'addMoreImages', maxCount: 10 },
    { name: 'video', maxCount: 1 }
]), product_controllers_1.postController);
router.put('/product/:id', upload_middleware_1.upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'addMoreImages', maxCount: 10 },
    { name: 'video', maxCount: 1 }
]), product_controllers_1.updateController);
router.get('/product', product_controllers_1.getController);
router.delete('/product/:id', product_controllers_1.deleteController);
exports.default = router;
