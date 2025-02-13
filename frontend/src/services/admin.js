import { get, post, delete1 } from "../utils/request.js";

export function updateAdmin(params) {
  console.log(params.permission);
  return post(`/admin/update/${params.id}`, { permission: params.permission });
}

export function deleteAdmin(adminId) {
  return delete1(`/admin/delete/${adminId}`);
}

export function getAdminList(params) {
  return get(`/admin/list`, params);
}

export function createAdmin(params) {
  return post(`/admin/register`, params);
}
