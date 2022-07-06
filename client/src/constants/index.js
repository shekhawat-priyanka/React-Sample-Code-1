export const PASSWORD_DEFAULT_LENGTH =
  Math.floor(Math.random() * (10 - 6 + 1)) + 6; // 10 >= length >= 6
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_SIZE_SECOND_OPTION = 40;
export const COUPON_DEFAULT_LENGTH = 8;
export const TABLE_BORDER_COLOR = "#f1f5f1";
export const IMAGE_MAX_SIZE = 1000000000; //bytes
export const ACCEPTED_IMAGE_TYPES =
  "image/x-png, image/png, image/jpg, image/jpeg";
export const ACCEPTED_IMAGE_TYPES_ARRAY = ACCEPTED_IMAGE_TYPES.split(",").map(
  (item) => {
    return item.trim();
  }
);
