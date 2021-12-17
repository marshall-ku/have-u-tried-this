/* eslint-disable import/extensions */
import { Router } from "express";
import { unlink } from "fs";
import path from "path";
import { validation } from "../services/locations.js";
import {
  getAll,
  findById,
  findByTitle,
  createPost,
} from "../services/posts.js";
import uploadFile from "../middlewares/multer.js";
import PostDto from "../models/DTO/Post.js";
import asyncHandler from "../utils/async-handler.js";

const router = Router();

// 지역 별 포스트 리스트 페이지
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const location = {
      wideAddr: req.query.wide,
      localAddr: req.query.local,
    };

    const page = req.query.page || 1;
    const perPage = req.query.page || 9;

    const isExists = await validation(location);
    if (!isExists) {
      throw new Error("Not access");
    }

    const postsByAddr = await getAll(location, page, perPage);
    res.json(postsByAddr);
  }),
);

// 포스트 상세 페이지
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await findById(id);
    if (!post) {
      throw new Error("No Data");
    }
    res.json(post);
  }),
);

// 포스트 등록
router.post(
  "/",
  uploadFile,
  asyncHandler(async (req, res) => {
    const photos = req.files;
    const { title, content, wideAddr, localAddr } = req.body;

    const check = await findByTitle(title);
    // 타이틀 중복 시 업로드된 이미지 제거
    if (check) {
      photos.forEach((photo) => {
        // eslint-disable-next-line no-underscore-dangle
        const __dirname = path.resolve();
        unlink(path.join(__dirname, photo.path), () => {});
      });
      throw new Error("Already Exists");
    }

    const post = new PostDto(title, content, photos, wideAddr, localAddr);
    const postId = await createPost(post);
    res.json({ id: postId });
  }),
);

export default router;