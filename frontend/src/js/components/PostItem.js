import LikesCount from "./LikesCount";
import { addClickEvent } from "../router";
import "../../css/PostItem.css";
import el from "../utils/dom";

export default function PostItem({ title, thumbnail, slug, likes }) {
  const anchor = el(
    "a",
    {},
    el(
      "figure",
      { className: "post-item__thumbnail" },
      el("img", { src: thumbnail }),
    ),
    el(
      "header",
      { className: "post-item__header" },
      el("h2", { className: "post-item__title" }, title),
      el("div", { className: "post-item__info" }, LikesCount("div", likes)),
    ),
  );

  addClickEvent(anchor, `/post/${slug}`);

  return el("article", { className: "post-item" }, anchor);
}