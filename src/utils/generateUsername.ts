import { randomUUID } from "crypto"
import slugify from "slugify";

/**
 * @description 生成随机用户名
 * @param {string} name - google account用户名
 * @returns {string} 随机用户名
 */
export const generateUsername = (name: string) => {
  // 删除name中所有空格并且加上uuid
  return slugify(name) + randomUUID();
}