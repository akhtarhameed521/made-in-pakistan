"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_middleware_1 = require("../middleware/upload.middleware");
const post_controllers_1 = require("../controllers/post.controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route("/post").post(upload_middleware_1.upload.single("postImage"), post_controllers_1.postController);
router.route("/post").get(post_controllers_1.getPostController);
router.route("/post/:id").put(upload_middleware_1.upload.single("postImage"), post_controllers_1.updatePostController);
router.route("/post/:id").delete(post_controllers_1.deletePostController);
exports.default = router;
