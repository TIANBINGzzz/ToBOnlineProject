import { get, post } from "../utils/request.js";

/**
 * @description 
 * @param {
 * email: string
 * telephone:string
 * usertype:'company| 'professional' | 'admin'
 * password:string
 * } params
 * @returns
 */
export function getProfessionalUserInfo(id) {
  return get(`/professional/${id}`);
}
/**
 * @description 
 * @param {
 * email: string
 * telephone:string
 * usertype:'company| 'professional' | 'admin'
 * password:string
 * } params
 * @returns
 */
export function updateProfessionalUserInfo(params, id) {
  return post(`/professional/update/${id}`, params);
}

/**
 * 
 * @param {*} id 
 * @returns 
 * "data": {
        "id": "886b859766db6cf49b2d20897f77bfa6",
        "email": "tianji@gmail.com",
        "password": "$2a$10$z3ixAioqDXJ47h/blSs1buAo5tttGCDujbIBa3pzOaGpLb5DE73Xm",
        "firstname": "Tianji",
        "lastname": "Chen",
        "addressStreet": "43 king st",
        "addressCity": "Sydney",
        "addressSuburb": "mascot",
        "addressPostCode": "2031",
        "addressCountry": "China",
        "telephone": "0415081238",
        "avatar": "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAA5klEQVR4nO3QQQkAIADAQLV/Z63gXiLcJRibe3BrvQ74iVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWYFZgVmBWcEBil4Bx/GEGnoAAAAASUVORK5CYII=",
        "profess": "Student",
        "company": "UNSW",
        "experienceYear": 2,
        "education": "UNSW",
        "age": 24,
        "skill": null,
        "professionalCertificate": null,
        "score": 9.0
    }
 */
export function getCompanyInfo(id) {
  return get(`/company/${id}`);
}

export function updateCompanyInfo(params, id) {
  return post(`/company/update/${id}`, params);
}
