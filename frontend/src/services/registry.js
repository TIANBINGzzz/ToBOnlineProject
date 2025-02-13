import { get, post } from "../utils/request.js";

/**
 *
 * @param {
 * email: string
 * telephone:string
 * usertype:'company| 'professional' | 'admin'
 * password:string
 * } params
 * @returns
 */
export function register(params) {
  return post("/user/register", params);
}
