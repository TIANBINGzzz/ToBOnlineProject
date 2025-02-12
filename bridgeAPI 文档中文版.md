# API 文档

## 目录

- [API 文档](#api-文档)
  - [目录](#目录)
  - [概述](#概述)
  - [通用说明](#通用说明)
  - [接口列表](#接口列表)
    - [用户](#用户)
      - [通用注册](#通用注册)
      - [用户登录](#用户登录)
      - [获取符合条件的专业人士信息（搜索）](#获取符合条件的专业人士信息搜索)
      - [更新用户的feedback评分](#更新用户的feedback评分)
      - [注册](#注册)
        - [专业人士注册（废弃）](#专业人士注册废弃)
        - [公司用户注册（废弃）](#公司用户注册废弃)
        - [管理员注册（废弃）](#管理员注册废弃)
      - [获取用户信息](#获取用户信息)
        - [获取专业人士用户信息](#获取专业人士用户信息)
        - [获取公司用户信息](#获取公司用户信息)
        - [获取管理员用户信息](#获取管理员用户信息)
      - [用户信息更新](#用户信息更新)
        - [公司用户信息更新](#公司用户信息更新)
        - [管理员用户信息更新](#管理员用户信息更新)
        - [专业用户信息更新](#专业用户信息更新)
      - [用户账户删除](#用户账户删除)
        - [公司用户账户删除](#公司用户账户删除)
        - [管理员用户账户删除](#管理员用户账户删除)
        - [专业用户账户删除](#专业用户账户删除)
    - [项目模块](#项目模块)
      - [项目创建](#项目创建)
      - [获取项目列表](#获取项目列表)
      - [获取指定公司项目列表](#获取指定公司项目列表)
      - [获取项目详情](#获取项目详情)
      - [项目详情信息更新](#项目详情信息更新)
      - [项目删除](#项目删除)
      - [申请项目，更新项目参与者人数](#申请项目更新项目参与者人数)
      - [内部feedback更新项目的评分和评分的人数](#内部feedback更新项目的评分和评分的人数)
      - [给project添加task](#给project添加task)
      - [完成某个project的某个task](#完成某个project的某个task)
    - [申请模块](#申请模块)
      - [用户对某项目提交申请](#用户对某项目提交申请)
      - [用户接收邀请](#用户接收邀请)
      - [公司处理申请](#公司处理申请)
      - [公司和用户互相打分](#公司和用户互相打分)
      - [获取申请信息](#获取申请信息)
      - [拉取某一个项目的参与完成列表](#拉取某一个项目的参与完成列表)
    - [通知模块](#通知模块)
      - [生成通知](#生成通知)
      - [拉取当前用户的通知](#拉取当前用户的通知)
      - [批量生成通知](#批量生成通知)
      - [点击通知](#点击通知)
  - [错误码说明](#错误码说明)

---

## 概述

本 API 文档用于描述前后端交互的接口规范，定义各模块的 API，包括接口请求格式、参数说明、响应格式及错误处理方式。

- **更新日期：** 2024-10-25

---

## 通用说明

- **接口根地址：** `https://127.0.0.1/8080:`
- **请求方法：**
  - `GET`：获取资源
  - `POST`：创建资源
  - `PUT`：更新资源
  - `DELETE`：删除资源
- **请求格式：** `application/json`
- **认证方式：** 采用 JWT 认证，在请求头中加入 `Authorization: Bearer <token>`。

---

## 接口列表

### 用户


#### 通用注册
- **接口描述：** 通用注册接口。
- **请求方法：** `POST`
- **接口路径：** `/user/register`
- **请求参数：**

| 参数名   | 类型   | 是否必填 | 描述                                        |
| -------- | ------ | -------- | ------------------------------------------|
| usertype | string | 是       | 用户类型 company，professional或者admin     |
| telephone| string | 是       | 用户电话                                   |
| email    | string | 是       | 用户邮箱                                   |
| password | string | 是       | 用户密码                                   |

- **请求示例：**

```json
{
    "email": "test@gmail.com",
    "telephone": "123456778",
    "password": "123456",
    "userType": "professional"

}

```

- **返回值：**

| 字段名     | 类型   | 描述                                   |
| --------  | ------ | ----------------------------------     |
| id        | string | 用户ID                                 |
| email     | string |                                        |
| telephone | string | 用户电话                                |
| password  | string | 用户密码                                |
| userType  | string | 用户类型 company，professional或者admin  |
- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzQ4ZDc4MTU2YWZhMzcxZmRjZDdlYzk1MTk5OWM4YyIsIm5hbWUiOiIiLCJyb2xlIjoicHJvZmVzc2lvbmFsIiwiZXhwIjoxNzI5ODgzOTM3fQ.v7N_fNwp3uIHFi5JBqh53OliVP0wahs-1wsCShhKZt_Npy1lvfqWBGCOVpzm5HHMQpgOguNhKYxVcAdvE8DO-A",
    "data": {
        "id": "1348d78156afa371fdcd7ec951999c8c",
        "email": "test@gmail.com",
        "telephone": "123456778",
        "password": "$2a$10$uKwhmcdhL1L67q8vWRXvM.R9haIXjp3cn1LvcQlF6BzofAnHELRce",
        "userType": "professional"
    }
}
```

#### 用户登录


- **接口描述：** "用户登录"
- **请求方法：** `POST`
- **接口路径：** `/user/login`
- **请求参数：**

<!-- | 参数名   | 类型   | 是否必填 | 描述           |
| -------- | ------ | -------- | ------------ |
| usertype | int    | 是       | 用户角色      |
| username | string | 是       | 用户名或邮箱  |
| password | string | 是       | 用户密码      | -->

- **请求示例：**

```json
{
    "email": "yang@gmail.com",
    "password": "123456"
}

```

- **返回值：**

| 字段名   | 类型   | 描述           |
| -------- | ------ | -------------- |
| email    | string | 用户身份令牌   |
| password   | string | 用户 ID        |

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwYjUwYjY2MS0yMWIwLTQzNzctYTcxYi1kZjRhZTkzZGE4YTAiLCJwYXNzd29yZCI6IiQyYSQxMCRybDJueUtFZTRza1lFcXRmYnRCclRPb2xDUUJXS0V1Q09ISS5EdmlQMXAvdmNnamlmYzJ4TyIsInJvbGUiOiJhZG1pbi1zdXBlciIsImV4cCI6MTcyODM3MTE2OX0.e-txctOXdVUVBGa91bHg5WntWKQ2ROkudjI3nvZGxOY9DIpxF0GlCeDLCeGP9sfDHbiSOum_ABKXT92WBzYMfA",
    "data": {
        "id": "0b50b661-21b0-4377-a71b-df4ae93da8a0",
        "email": "yang@gmail.com",
        "telephone": "0435071222",
        "password": "$2a$10$rl2nyKEe4skYEqtfbtBrTOolCQBWKEuCOHI.DviP1p/vcgjifc2xO",
        "userType": "admin-super"
    }
}
``` 
#### 获取符合条件的专业人士信息（搜索）


- **接口描述：** "获取符合条件的专业人士信息，应用于搜索"
- **请求方法：** `GET`
- **接口路径：** `/professional/list`
- **请求参数：**

skill是 list类型，里面是string

skill和name至少填一个，因为是筛选条件

可以按符合技术的tag搜索，也可以人名搜索

| 参数名   | 类型            | 是否必填 | 描述                                |
| -------- | ------------   | -------- | ------------                       |
| start    | int            | 是       | 起始index，至少为1                  |
| size     | string         | 是       |  至少为1                            |
| skill    | list <string>  | 否       | list类型，里面是string。和tag对应的  |
| name     | string         | 否       | professional的名字                   |

- **请求示例：**

```json

127.0.0.1:8080/professional/list?start=1&size=4&name=Tianji Chen

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述           |
| -------- | ------ | -------------- |
| email    | string | 用户身份令牌   |
| password   | string | 用户 ID        | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "total": 0,
        "records": [
            {
                "id": "886b859766db6cf49b2d20897f77bfa6",
                "email": null,
                "password": null,
                "firstname": "Tianji",
                "lastname": "Chen",
                "addressStreet": "43 king st",
                "addressCity": "Sydney",
                "addressSuburb": "mascot",
                "addressPostCode": "2031",
                "addressCountry": "China",
                "telephone": null,
                "avatar": "[-119, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 100, 0, 0, 0, 100, 8, 2, 0, 0, 0, -1, -128, 2, 3, 0, 0, 0, -26, 73, 68, 65, 84, 120, -100, -19, -48, 65, 9, 0, 32, 0, -64, 64, -75, 127, 103, -83, -32, 94, 34, -36, 37, 24, -101, 123, 112, 107, -67, 14, -8, -119, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -127, 89, -63, 1, -118, 94, 1, -57, -15, -124, 26, 122, 0, 0, 0, 0, 73, 69, 78, 68, -82, 66, 96, -126]",
                "profess": "Student",
                "company": "UNSW",
                "experienceYear": 2,
                "education": "UNSW",
                "age": 24,
                "skill": null,
                "professionalCertificate": null,
                "score": null
            }
        ]
    }
}
```
---

#### 更新用户的feedback评分


- **接口描述：** "更新用户的feedback评分"
- **请求方法：** `PUT`
- **接口路径：** `user/feedback/{id}`
- **请求参数：**

路径参数id是 user的id

| 参数名   | 类型            | 是否必填 | 描述                |
| -------- | ------------   | -------- | ------------       |
| score    | int            | 是       | 对应的评价等级的分数 |

- **请求示例：**

```json

127.0.0.1:8080/user/feedback/886b859766db6cf49b2d20897f77bfa6?score=9

```

- **返回值：**

无

- **返回值示例：**

```json
无
```
---
#### 注册

##### 专业人士注册（废弃）

- **接口描述：** 专业人士注册接口。
- **请求方法：** `POST`
- **接口路径：** `/professional/register`
- **请求参数：**

<!-- | 参数名   | 类型   | 是否必填 | 描述           |
| -------- | ------ | -------- | ------------ |
| usertype | int    | 是       | 用户角色      |
| username | string | 是       | 用户名或邮箱  |
| password | string | 是       | 用户密码      | -->

- **请求示例：**

```json
{
    "email": "yangshuo@gmail.com",
    "password": "123456",
    "firstname": "SHUO",
    "lastname": "YANG",
    "addressStreet": null,
    "addressCity": null,
    "addressSuburb": "104278",
    "addressPostCode": "111111",
    "addressCountry": "China",
    "telephone": "0435071235",
    "avatar": "2321321321",
    "profess": null,
    "company": null,
    "experienceYear": 2,
    "education": "UNSW",
    "age": 24,
    "skill": [
        "Python",
        "C",
        "Linux"
    ],
    "professionalCertificate": null
}

```

- **返回值：**

| 字段名   | 类型   | 描述           |
| -------- | ------ | -------------- |
| token    | string | 用户身份令牌   |
| userId   | string | 用户 ID        |
| usertype | string | 用户角色（如 admin, user）|

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlOWVlNDY4YmMwNzRmNGI0MjgwOTk4Y2YxNWYxYTY0NyIsInBhc3N3b3JkIjoiJDJhJDEwJHlEVzhGSEU3dU9nSTFDRFMvLmkuck9pNDAvWFNNa2diWDNqdTlpZFkueGlvVE9lUFZrdkx1Iiwicm9sZSI6InByb2Zlc3Npb25hbCIsImV4cCI6MTcyODM2NDkyM30.2rUK0DKjqsm9_IRDmTtvP8TSPqxzlOM7ENsOeCgE8Es9TPH7wrGwZhWTqlG8Pqi0EmJ2Yns5Dl1smPnADYK2qw",
    "data": {
        "id": "e9ee468bc074f4b4280998cf15f1a647",
        "email": "yangshuo112@gmail.com",
        "telephone": "0435071235",
        "password": "$2a$10$yDW8FHE7uOgI1CDS/.i.rOi40/XSMkgbX3ju9idY.xioTOePVkvLu",
        "userType": "professional"
    }
}
```

---

##### 公司用户注册（废弃）

- **接口描述：** 公司用户注册接口。
- **请求方法：** `POST`
- **接口路径：** `/company/register`
- **请求参数：**

<!-- | 参数名   | 类型   | 是否必填 | 描述           |
| -------- | ------ | -------- | -------------- |
| usertype | int    | 是       | 用户角色      |
| username | string | 是       | 用户名或邮箱   |
| password | string | 是       | 用户密码       | -->

- **请求示例：**

```json
{
  "name": "Google",
  "addressStreet": null,
  "addressCity": null,
  "addressSuburb": null,
  "addressPostCode": 108336,
  "addressCountry": "China",
  "telephone": "0491692452",
  "email": "yangshuo111@gmail.com",
  "password": "123456",
  "logo": "23424242423342"
}
```

- **返回值：**

<!-- | 字段名   | 类型   | 描述           |
| -------- | ------ | -------------- |
| token    | string | 用户身份令牌   |
| userId   | string | 用户 ID        |
| usertype | string | 用户角色（如 admin, user）| -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMWJmN2JhZWVlYTBmMWQ4MDllZmFhZmU2OWE1MTBlYiIsInBhc3N3b3JkIjoiJDJhJDEwJHJsMm55S0VlNHNrWUVxdGZidEJyVE9vbENRQldLRXVDT0hJLkR2aVAxcC92Y2dqaWZjMnhPIiwicm9sZSI6ImNvbXBhbnkiLCJleHAiOjE3MjgzNjQ0MzN9.nmzUKOJSPGFNoyYw2NnJwJaJdQBDbbynVoN6uiOjlT8AW9VVaSkhmDQkL6Lto3BWrZ-dnyKmpHkRBvd0at9UNQ",
    "data": {
        "id": "11bf7baeeea0f1d809efaafe69a510eb",
        "email": "yangshuo111@gmail.com",
        "telephone": "0491692452",
        "password": "$2a$10$rl2nyKEe4skYEqtfbtBrTOolCQBWKEuCOHI.DviP1p/vcgjifc2xO",
        "userType": "company"
    }
}
```

---

##### 管理员注册（废弃）

- **接口描述：** 管理员注册接口。
- **请求方法：** `POST`
- **接口路径：** `/admin/register`
- **请求参数：**

<!-- | 参数名   | 类型   | 是否必填 | 描述           |
| -------- | ------ | -------- | -------------- |
| usertype | int    | 是       | 用户角色      |
| username | string | 是       | 用户名或邮箱   |
| password | string | 是       | 用户密码       | -->

- **请求示例：**

```json
{
  "email": "yangshuo111@gmail.com",
  "password": "123456",
  "role": "super",
  "firstname": "SHUO",
  "lastname": "YANG",
  "addressStreet": null,
  "addressCity": null,
  "addressSuburb": null,
  "addressPostCode": 108336,
  "addressCountry": "China",
  "telephone": "0491692452",
  "age": 24
}
```

- **返回值：**

<!-- | 字段名   | 类型   | 描述           |
| -------- | ------ | -------------- |
| token    | string | 用户身份令牌   |
| userId   | string | 用户 ID        |
| usertype | string | 用户角色（如 admin, user）| -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMDE5YTFhZGQ4MjIzMzFjYTZlNjhhY2M1M2E0ZjRkYSIsInBhc3N3b3JkIjoiJDJhJDEwJFh5OVFiUUVFdW04SFZpYTZzTUZoZi52Tkg0aTA1Z0xmdTY1bVdXOTBoYy5kS1ZZMGcuTWpHIiwicm9sZSI6InByb2Zlc3Npb25hbCIsImV4cCI6MTcyODM2Njc2NX0.6D-Ql9dAp0ehfNOb27Ztqic8shCaqN-itac8xXamTi5IjaeSD58varX3GYaH-Y5T8qLqTMwqtVbhB4F4rAljfg",
    "data": {
        "id": "1019a1add822331ca6e68acc53a4f4da",
        "email": "yangshuo122@gmail.com",
        "telephone": "0435071236",
        "password": "$2a$10$Xy9QbQEEum8HVia6sMFhf.vNH4i05gLfu65mWW90hc.dKVY0g.MjG",
        "userType": "professional"
    }
}
```


#### 获取用户信息

##### 获取专业人士用户信息

- **接口描述：**  获取专业人士用户信息。
- **请求方法：** `GET`
- **接口路径：** `/professional/{id}`
- **请求参数：**

路径参数id是 professional的id

- **请求示例：**

```json
127.0.0.1:8080/professional/886b859766db6cf49b2d20897f77bfa6

```

- **返回值：**



- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
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
}
```

---

##### 获取公司用户信息

- **接口描述：**  获取公司用户信息。
- **请求方法：** `GET`
- **接口路径：** `/company/{id}`
- **请求参数：**

路径参数id是company的id

- **请求示例：**

```json
127.0.0.1:8080/company/886b859766db6cf49b2d20897f77bfa6

```

- **返回值：**



- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "id": "14551e7a5f77704c131c5625f4f1295f",
        "email": "google@gmail.com",
        "name": "Google",
        "addressStreet": "1600 Amphitheatre Parkway",
        "addressCity": "Mountain View",
        "addressSuburb": null,
        "addressPostCode": "94043",
        "addressCountry": "United States",
        "telephone": "16502530000",
        "password": "$2a$10$aD63K9uO/chqPNUEPENUMuNQrqml/GawRcpWti2/aKSSSSKXi54Ui",
        "logo": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAr8A/0Kl9PgAAAAASUVORK5CYII=",
        "score": 0.0
    }
}
```
---

---

##### 获取管理员用户信息

- **接口描述：**  获取管理员用户信息。
- **请求方法：** `GET`
- **接口路径：** `/admin/{id}`
- **请求参数：**

路径参数id是admin的id

- **请求示例：**

```json
127.0.0.1:8080/admin/0b50b661-21b0-4377-a71b-df4ae93da8a0

```

- **返回值：**



- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "id": "0b50b661-21b0-4377-a71b-df4ae93da8a0",
        "email": "admin1@gmail.com",
        "password": "$2a$10$rl2nyKEe4skYEqtfbtBrTOolCQBWKEuCOHI.DviP1p/vcgjifc2xO",
        "role": "super",
        "firstname": "1",
        "lastname": "admin",
        "age": 22,
        "addressStreet": "1 King st",
        "addressCity": "Sydney",
        "addressSuburb": "NSW",
        "addressPostCode": "2031",
        "addressCountry": "AU",
        "telephone": "0435071111"
    }
}
```
---

#### 用户信息更新

##### 公司用户信息更新

- **接口描述：** "公司用户信息更新"
- **接口路径：** `/company/update/{id}`  id是company对应的id 
- **请求方法：** `POST`
- **示例：** 127.0.0.1:8080/company/update/11bf7baeeea0f1d809efaafe69a510eb
- **请求参数：**

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json
{
  "name": "Google",
  "addressStreet": "1",
  "addressCity": null,
  "addressSuburb": null,
  "addressPostCode": "108336",
  "addressCountry": "China",
  "telephone": "0491692452",
  "email": "yangshuo111@gmail.com",
  "password": "123456",
  "logo": "23424242423342"
}

```

- **返回值：**

| 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             |

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMWJmN2JhZWVlYTBmMWQ4MDllZmFhZmU2OWE1MTBlYiIsInBhc3N3b3JkIjoiJDJhJDEwJFZBT0k2YlBPNlB2YlUuamVSZHFDWWVoYnAvUlJSM295QUhrMUJFNWVYUXpTRmFYODdtS3Z5IiwiZXhwIjoxNzI4NDI1MTI2fQ.sqT-G-7C26at226G1-lwU9DwpJUjuJ5posQqRofa0KZXykpL8lEaDsEs8MBVngSbICAGT9wyW8pGOJyjh3lpAg",
    "data": ""
}
```
---

##### 管理员用户信息更新

- **接口描述：** "管理员用户信息更新"
- **请求方法：** `POST`
- **接口路径：** `/admin/update/{id}`  id是admin对应的id 
- **示例：** 127.0.0.1:8080/admin/update/11bf7baeeea0f1d809efaafe69a510eb
- **请求参数：**

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json
{
  "email": "yang@gmail.com",
  "password": "123456",
  "role": "super",
  "firstname": "SHUO",
  "lastname": "YANG",
  "addressStreet": "1",
  "addressCity": null,
  "addressSuburb": null,
  "addressPostCode": "108336",
  "addressCountry": "China",
  "telephone": "0491624542",
  "age": 24
}

```

- **返回值：**

| 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             |

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZjRhZTkzZGE4YTAiLCJwYXNzd29yZCI6IiQyYSQxMCRMVnlnZjhaaGMzM3hiVXFOVUpOc1BlSHZYSWFSVXhqUUtrOU5ZZEljMi5CRVJxUVFvT0V1QyIsInJvbGUiOiJudWxsLXN1cGVyIiwiZXhwIjoxNzI4NDI1ODQ2fQ.-AWyXmRoq0S3Ej_ntLt0iNPtP52JfeeHalJOuuwjheZgnxzo2DGEfgrmqBE2hAx3uzc-6d1VUMgXRZvGgiYk8Q",
    "data": ""
}
```

---

##### 专业用户信息更新

- **接口描述：** "专业用户信息更新"
- **请求方法：** `POST`
- **接口路径：** `/professional/update/{id}`  id是professional对应的id 
- **示例：** 127.0.0.1:8080/professional/update/5beb89ed2f99e9aba006aa14e861098f
- **请求参数：**

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json
{
    "email": "tianji@gmail.com",
    "password": "123456",
    "firstname": "TIAN",
    "lastname": "JI",
    "addressStreet": null,
    "addressCity": null,
    "addressSuburb": "104278",
    "addressPostCode": "111111",
    "addressCountry": "China",
    "telephone": "0415081238",
    "avatar": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4/8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
    "profess": null,
    "company": null,
    "experienceYear": 2,
    "education": "UNSW",
    "age": 24,
    "skill": [
        "Python",
        "C",
        "Linux"
    ],
    "professionalCertificate": null
}

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1YmViODllZDJmOTllOWFiYTAwNmFhMTRlODYxMDk4ZiIsInBhc3N3b3JkIjoiJDJhJDEwJFp1ZTBSSGE4QlpDczBaREJ1N0hUSWVabnoySDJ3clpvLlNVVlpzbVpjbUNBQWxJZWdYdnBXIiwiZXhwIjoxNzI4NDMyMDcyfQ.j6wjaUwn87Q-4pLUffzuZh-eKkt4EJr0w5qDwINQIbp-OBI3HfIMi5YDN6YbONkugq-Lqhm-Lz9xI7cnLp06rg",
    "data": ""
}
```

#### 用户账户删除

##### 公司用户账户删除

- **接口描述：** "公司用户账户删除"
- **接口路径：** `/company/delete/{id}`  
- **请求方法：** `DELETE`
- **示例：** 127.0.0.1:8080/company/update/11bf7baeeea0f1d809efaafe69a510eb
- **请求参数：**
路径参数id是company对应的id 
<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json
127.0.0.1:8080/company/update/11bf7baeeea0f1d809efaafe69a510eb
```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```
---

##### 管理员用户账户删除

- **接口描述：** "管理员用户账户删除"
- **请求方法：** `DELETE`
- **接口路径：** `/admin/delete/{id}`  
- **示例：** 127.0.0.1:8080/admin/delete/11bf7baeeea0f1d809efaafe69a510eb
- **请求参数：**
路径参数id是admin对应的id 
<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json
127.0.0.1:8080/admin/delete/11bf7baeeea0f1d809efaafe69a510eb
```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```

---

##### 专业用户账户删除

- **接口描述：** "专业用户信息更新"
- **请求方法：** `DELETE`
- **接口路径：** `/professional/delete/{id}`  
- **示例：** 127.0.0.1:8080/professional/delete/1348d78156afa371fdcd7ec951999c8c
- **请求参数：**
路径参数id是professional对应的id 

- **请求示例：**

```json
127.0.0.1:8080/professional/delete/1348d78156afa371fdcd7ec951999c8c
```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```
---
### 项目模块

#### 项目创建

- **接口描述：** "项目创建"
- **请求方法：** `POST`
- **接口路径：** `/project`
- **请求参数：**

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json
{
  "name": "Robotics Control System",
  "introduction": "A robotics control platform to automate warehouse operations, featuring path planning, obstacle avoidance, and real-time inventory management.",
  "location": "South Korea",
  "skill": [
    "ROS",
    "C++",
    "Python",
    "Computer Vision"
  ],
  "requirements": "Experience with robotics control frameworks, proficiency in path planning algorithms, and knowledge of computer vision techniques.",
  "rolesAndResponsibilities": "Develop navigation systems for autonomous robots, integrate vision-based object detection, and optimize warehouse operations.",
  "workAndTime": "Contract-based, requires on-site testing and regular remote updates.",
  "teamInformation": "Team of 5, including robotics engineers, computer vision experts, and warehouse operation specialists.",
  "startTime": "2025-10-17",
  "endTime": "2028-10-17"
}

```

- **返回值：**

| 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             |

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "id": "a3500861-3fa0-41f8-8fa8-c8eade2451e0",
        "name": "Robotics Control System",
        "introduction": "A robotics control platform to automate warehouse operations, featuring path planning, obstacle avoidance, and real-time inventory management.",
        "location": "South Korea",
        "skill": [
            "ROS",
            "C++",
            "Python",
            "Computer Vision"
        ],
        "companyId": "14551e7a5f77704c131c5625f4f1295f",
        "companyName": "Google",
        "startTime": "2025-10-17",
        "endTime": "2028-10-17",
        "createTime": "2024-10-24"
    }
}
```

---


#### 获取项目列表

-  !!!!!!! 注意，只返回开始时间比现在晚的项目
-  
- **接口描述：** "获取项目列表"
- **接口路径：** `/project/list`
- **示例：** 127.0.0.1:8080/project/list?start=0&size=5
- **请求方法：** `GET`
- **请求参数：**

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| start  | string | 是       | 项目 ID               |
| size     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json
{
    "start": 0,
    "size": 5,
    "sort": null,
    "order": null
}

```

- **返回值：**

| 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             |

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "total": 1,
        "records": [
            {
                "id": "a3500861-3fa0-41f8-8fa8-c8eade2451e0",
                "name": "Robotics Control System",
                "introduction": "A robotics control platform to automate warehouse operations, featuring path planning, obstacle avoidance, and real-time inventory management.",
                "location": "South Korea",
                "skill": [
                    "ROS",
                    "C++",
                    "Python",
                    "Computer Vision"
                ],
                "companyId": "14551e7a5f77704c131c5625f4f1295f",
                "companyName": "Google",
                "startTime": "2025-10-17",
                "endTime": "2028-10-17",
                "createTime": "2024-10-24"
            }
        ]
    }
}
```
---

#### 获取指定公司项目列表
- **接口描述：** "获取指定公司项目列表。"
- **请求方法：** `GET`
- **接口路径：** `/project/profile/{id}`
- - **示例：** `127.0.0.1:8080/project/profile/14551e7a5f77704c131c5625f4f1295f?start=0&size=5&status=0`
- **请求参数：**

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| userid     | string | 是       |         ID          |
| keywords   | string | 否       |    关键字搜索        | -->

- **请求示例：**

```json

127.0.0.1:8080/project/profile/14551e7a5f77704c131c5625f4f1295f?start=0&size=5&status=0

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "total": 1,
        "records": [
            {
                "id": "a3500861-3fa0-41f8-8fa8-c8eade2451e0",
                "name": "Robotics Control System",
                "introduction": "A robotics control platform to automate warehouse operations, featuring path planning, obstacle avoidance, and real-time inventory management.",
                "location": "South Korea",
                "skill": [
                    "ROS",
                    "C++",
                    "Python",
                    "Computer Vision"
                ],
                "startTime": "2025-10-17",
                "endTime": "2028-10-17",
                "companyId": "14551e7a5f77704c131c5625f4f1295f",
                "companyName": "Google",
                "participantNumber": null,
                "score": -1.0,
                "createTime": "2024-10-24T01:02:54.754"
            }
        ]
    }
}
```

---
#### 获取项目详情

- **接口描述：** "获取项目详情"
- **接口路径：** `/project/{id}`
- **示例：** 127.0.0.1:8080/project/58d282e1-f323-4af0-8722-54b4dda12060
- **请求方法：** `GET`
- **请求参数：**

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

- **请求是路径参数**
- **示例：** 127.0.0.1:8080/project/{id}


- **返回值：**

| 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             |

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "id": "a3500861-3fa0-41f8-8fa8-c8eade2451e0",
        "name": "Robotics Control System",
        "introduction": "A robotics control platform to automate warehouse operations, featuring path planning, obstacle avoidance, and real-time inventory management.",
        "location": "South Korea",
        "skill": [
            "ROS",
            "C++",
            "Python",
            "Computer Vision"
        ],
        "requirements": "Experience with robotics control frameworks, proficiency in path planning algorithms, and knowledge of computer vision techniques.",
        "rolesAndResponsibilities": "Develop navigation systems for autonomous robots, integrate vision-based object detection, and optimize warehouse operations.",
        "workAndTime": "Contract-based, requires on-site testing and regular remote updates.",
        "teamInformation": "Team of 5, including robotics engineers, computer vision experts, and warehouse operation specialists.",
        "startTime": "2025-10-17",
        "endTime": "2028-10-17",
        "companyId": "14551e7a5f77704c131c5625f4f1295f",
        "companyName": "Google",
        "participantNumber": null,
        "task": [],
        "resource": null,
        "score": -1.0,
        "createTime": "2024-10-24T01:02:54.754"
    }
}
```
---
#### 项目详情信息更新

- **接口描述：** "项目详情信息更新"
- **接口路径：** `/project/update/{id}`
- **示例：** 127.0.0.1:8080/project/update/8c6a3319-b938-4945-a24c-56963023e4df
- **请求方法：** `POST`
- **请求参数：**

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**
```json
{
  "name": "AI-Powered Smart Farming System",
  "introduction": "An intelligent farming platform designed to optimize crop yield and reduce water usage through predictive analytics, automated irrigation, and drone-based field monitoring.",
  "location": "Netherlands",
  "skill": [
    "Machine Learning",
    "Python",
    "IoT",
    "Data Analytics"
  ],
  "requirements": "Experience with machine learning algorithms, familiarity with IoT devices, and proficiency in data analytics for real-time monitoring.",
  "rolesAndResponsibilities": "Develop predictive models for crop growth, manage sensor data integration, and implement automated irrigation control systems.",
  "workAndTime": "Full-time with hybrid work options, occasional travel to remote farms for on-site testing.",
  "teamInformation": "Team of 7, including agronomists, data scientists, IoT engineers, and software developers.",
  "startTime": "2024-12-30",
  "endTime": "2026-11-01"
}

```

- **请求是路径参数**
- **示例：** 127.0.0.1:8080/project/update/{id}


- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->


- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```
---
#### 项目删除

- **接口描述：** 项目删除，只有项目的创建公司可以删除项目。
- **请求方法：** `DELETE`
- **接口路径：** `project/delete/{id}`
- **请求参数：** 路径参数id是project的id

<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| projectId  | string | 是       | 项目 ID               |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```

---

#### 申请项目，更新项目参与者人数

- **接口描述：** 一个没有返回值的接口，这个不是为了专业用户准备的接口，参数是新参与者的人数。
- **请求方法：** `PUT`
- **接口路径：** `/project/apply/{id}`
- **请求参数：**

| 参数名     | 类型   | 是否必填 | 描述                    |
| ---------- | ------ | -------- | --------------------- |
|  number    | Integer | 是       |  本次申请项目的人数    |

- 
- **请求示例：**

```json
127.0.0.1:8080/project/apply/a3500861-3fa0-41f8-8fa8-c8eade2451e0?number=2
```

- **返回值：**

无

- **返回值示例：**

```json
无
```
---

#### 内部feedback更新项目的评分和评分的人数

- **接口描述：** 更新项目的评分和评分的人数。
- **请求方法：** `PUT`
- **接口路径：** `/project/feedback/{id}`
- **请求参数：**

| 参数名     | 类型     | 是否必填  | 描述                 |
| --------   | -----   | ------   | -------------------- |
| score      | Integer | 是       | 给项目打的分           |

- 
- **请求示例：**

```json

127.0.0.1:8080/project/feedback/a3500861-3fa0-41f8-8fa8-c8eade2451e0?score=5

```

- **返回值：**

无

- **返回值示例：**

```json
无
```
---


#### 给project添加task

- **接口描述：** 给project添加task，暂时是在introduction字段传入一个string。
- **请求方法：** `POST`
- **接口路径：** `/project/task/{id}`
- **请求参数：**

路径参数id是project的id

| 参数名        | 类型   | 是否必填 | 描述                   |
| ----------   | ------ | -------- | ---------------------|
| introduction | string |    是    | task的描述            |

- **请求示例：**

```json
127.0.0.1:8080/project/task/a3500861-3fa0-41f8-8fa8-c8eade2451e0
```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```
---


#### 完成某个project的某个task

- **接口描述：** 完成某个project的某个task。
- **请求方法：** `PUT`
- **接口路径：** `/project/task/complete`
- **请求参数：**


| 参数名        | 类型    | 是否必填 | 描述                  |
| ----------   | ------  | -------- | ---------------------|
| projectId    | string  |    是    | task的id             |
| taskId       | Integer |    是    | task的id,是int型      |
- **请求示例：**

```json
127.0.0.1:8080/project/task/complete?projectId=a3500861-3fa0-41f8-8fa8-c8eade2451e0&taskId=1
```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```

---

### 申请模块

#### 用户对某项目提交申请
- **接口描述：** 用户申请加入项目，id是项目id。
- **请求方法：** `PUT`
- **接口路径：** `/application/apply/{id}`
- - **示例：** `127.0.0.1:8080/application/apply/a3500861-3fa0-41f8-8fa8-c8eade2451e0`
- **请求参数：**
路径参数id是项目的id
<!-- | 参数名     | 类型   | 是否必填 | 描述                  |
| ---------- | ------ | -------- | --------------------- |
| userid     | string | 是       |         ID          |
| keywords   | string | 否       |    关键字搜索        | -->

- **请求示例：**

```json

127.0.0.1:8080/application/apply/a3500861-3fa0-41f8-8fa8-c8eade2451e0

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
// 重复
{
    "code": 400,
    "msg": "Already applied for this project",
    "token": null,
    "data": null
}
```

---

#### 用户接收邀请

- **接口描述：** 用户接受加入项目邀请。
- **请求方法：** `PUT`
- **接口路径：** `/application/invite/{id}`
- **请求参数：**

路径参数id是project的id

<!-- | 参数名     | 类型   | 是否必填 | 描述                   |
| ---------- | ------ | -------- | ---------------------|
| id        | string |  是       | 专业用户（申请者）id   |
| rating     | int    | 是       | 评分值（1-5）         |
| comments   | string | 否       | 评分的评价            | -->

- **请求示例：**

```json

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```

---
#### 公司处理申请

- **接口描述：** 公司处理各种申请，用户退出/公司开除之类。
- **请求方法：** `PUT`
- **接口路径：** `/application/process/{id}`
- **请求参数：**

路径参数id是application的id

| 参数名     | 类型   | 是否必填 | 描述                   |
| ---------- | ------ | -------- | ---------------------|
| status     | int    |  是       | 申请的id，1=拒绝，2=同意，4=退出   |


- **请求示例：**

```json
127.0.0.1:8080/application/process/1?status=2
```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```
---
#### 公司和用户互相打分

- **接口描述：** 在项目完成之后，公司和专业人士互相打分。
- **请求方法：** `PUT`
- **接口路径：** `/application/feedback/{projectId}`
- **请求参数：**

projectId是路径参数，是公司的某项目的id。

参数类型：query

| 参数名     | 类型    | 是否必填  | 描述                                            |
| ---------- | ------ | -------- | ----------------------------------------------- |
| feedback   | int    | 是       | 评分的的等级                                     |
| userId     | string | 否       | 如果是公司给专业人士评价，那么要传专业人士的id      |

- **请求示例：**

```json

127.0.0.1:8080/application/feedback/a3500861-3fa0-41f8-8fa8-c8eade2451e0?feedback=5

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```

---

#### 获取申请信息

- **接口描述：** 在项目完成之后，公司和专业人士互相打分。
- **请求方法：** `GET`
- **接口路径：** `/application/list`
- **请求参数：**


参数类型：query

| 参数名     | 类型    | 是否必填  | 描述                                                                 |
| ---------- | ------ | -------- | ------------------------------------------------------------------- |
| id         | string | 是       | 表示professional或者company用户的id                                   |
| role       | string | 是       | 值是company或者professional，表明角色                                  |
| status     | int    | 是       | 表示查什么类型数据 (0-applying/reject; 2-working; 3-done, 4-quit)      |
| start      | int    | 是       | 分页查询，表起始页码，从1开始                                           |
| size       | int    | 是       | 分页查询，表查询数量，大于0                                             |

- **请求示例：**

```json

127.0.0.1:8080/application/list?id=886b859766db6cf49b2d20897f77bfa6&role=professional&status=2&start=1&size=5

```

- **返回值：**


| 字段名               | 类型           | 描述                                                             |
| -------------------- | -------------- | ----------------------------------------------------------------|
| id                   | int            | application的id标识符。                                          |
| userId               | string         | 用户的唯一标识符。                                                |
| userName             | string         | 申请人姓名，用first name + last name，空格连接拼成的完整姓名        |
| projectId            | string         | 项目的id。                                                       |
| projectTitle         | string         | 项目的标题或名称。                                                |
| startTime            | string         | 项目开始时间，格式为 `YYYY-MM-DD`。                               |
| endTime              | string         | 项目结束时间，格式为 `YYYY-MM-DD`。                               |
| companyId            | string         | 公司的id                                                         |
| companyName          | string         | 公司名字                                                         |
| status               | int            | 项目状态 0-applying 1-reject 2-working 3-done 4-quit）。          |
| companyFeedback      | int            | 公司对专业用户的反馈评分（-1 表示暂无评分）。                       |
| professionalFeedback | int            | 专业用户给公司这个项目的反馈评分（-1 表示暂无评分）。                |
| updateTime           | string / null  | 记录最后更新时间，格式为 `YYYY-MM-DD`，`null` 表示未更新过          |


- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "total": 0,
        "records": [
            {
                "id": 3,
                "userId": "886b859766db6cf49b2d20897f77bfa6",
                "userName": "Tianji Chen",
                "projectId": "d0939afd-df23-4505-9a43-353528270870",
                "projectTitle": "AI-Powered Smart Farming System",
                "startTime": "2024-09-11",
                "endTime": "2026-11-01",
                "companyId": "14551e7a5f77704c131c5625f4f1295f",
                "companyName": "Google",
                "status": 2,
                "companyFeedback": -1,
                "professionalFeedback": -1,
                "updateTime": null
            }
        ]
    }
}
```

---
#### 拉取某一个项目的参与完成列表

- **接口描述：** 拉取某一个项目的参与完成列表（用于公司反馈）。
- **请求方法：** `GET`
- **接口路径：** `/application/project/{id}`
- **请求参数：** 路径参数id是project的id  query参数:  无


- **请求示例：**

```json

127.0.0.1:8080/application/project/d0939afd-df23-4505-9a43-353528270870

```

- **返回值：**


| 字段名               | 类型           | 描述                                                             |
| -------------------- | -------------- | ----------------------------------------------------------------|
| id                   | int            | application的id标识符。                                          |
| userId               | string         | 用户的唯一标识符。                                                |
| userName             | string         | 申请人姓名，用first name + last name，空格连接拼成的完整姓名        |
| projectId            | string         | 项目的id。                                                       |
| projectTitle         | string         | 项目的标题或名称。                                                |
| startTime            | string         | 项目开始时间，格式为 `YYYY-MM-DD`。                               |
| endTime              | string         | 项目结束时间，格式为 `YYYY-MM-DD`。                               |
| companyId            | string         | 公司的id                                                         |
| companyName          | string         | 公司名字                                                         |
| status               | int            | 项目状态 0-applying 1-reject 2-working 3-done 4-quit）。          |
| companyFeedback      | int            | 公司对专业用户的反馈评分（-1 表示暂无评分）。                       |
| professionalFeedback | int            | 专业用户给公司这个项目的反馈评分（-1 表示暂无评分）。                |
| updateTime           | string / null  | 记录最后更新时间，格式为 `YYYY-MM-DD`，`null` 表示未更新过          |


- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "total": 1,
        "records": [
            {
                "id": 3,
                "userId": "886b859766db6cf49b2d20897f77bfa6",
                "userName": "Tianji Chen",
                "projectId": "d0939afd-df23-4505-9a43-353528270870",
                "projectTitle": "AI-Powered Smart Farming System",
                "startTime": "2024-09-11",
                "endTime": "2026-11-01",
                "companyId": "14551e7a5f77704c131c5625f4f1295f",
                "companyName": "Google",
                "status": 2,
                "companyFeedback": -1,
                "professionalFeedback": -1,
                "updateTime": null
            }
        ]
    }
}
```
---
### 通知模块

#### 生成通知
- **接口描述：** 生成通知。
- **请求方法：** `POST`
- **接口路径：** `/notification`
- - **示例：** `127.0.0.1:8080/notification`
- **请求参数：**

| status | 描述                     |
| ------ | ------------------------ |
|   0    | apply                    |
|   1    | reject                   |
|   2    | enroll                   |
|   3    | done                     |
|   4    | userQuit                 |
|   5    | userFeedback             |
|   6    | companyFeedback          |
|   7    | invite                   |

|     参数名     | 类型     | 是否必填 | 描述                  |
| -------------  | ------  | -------- | ---------------------|
| applicationId  | int     | 否       |         ID          |
| userId         | string  | 是       |         ID          |
| userName       | string  | 是       |         name        |
| projectId      | string  | 是       |         ID          |
| projectTitle   | string  | 是       |         ID          |
| companyId      | string  | 是       |         ID          |
| companyName    | string  | 是       |         name        |
| status         | int     | 是       |    参见上表          |
| feedback       | int     | 否       |    数字评定星级       |
- **请求示例：**

```json

127.0.0.1:8080/notification

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}

```
#### 拉取当前用户的通知
- **接口描述：** 拉取当前用户的通知，和JWT即现在登录的人的身份有关系。
- **请求方法：** `GET`
- **接口路径：** `/notification`
- - **示例：** `127.0.0.1:8080/notification?page=0&size=5`
- **请求参数：**

|     参数名     | 类型     | 是否必填 | 描述                  |
| -------------  | ------  | -------- | ---------------------|
| page           | int     | 是       |   page从0开始         |
| size           | int     | 是       |   每次请求拉取的大小   |
- **请求示例：**

```json

127.0.0.1:8080/notification?page=0&size=5

```

- **返回值：**

|     参数名     | 类型     | 描述                  |
| -------------  | ------  | ---------------------|
| id             | int     |   notification的id   |
| applicationId  | int     |         ID           |
| userId         | string  |         ID           |
| userName       | string  |         name         |
| projectId      | string  |         ID           |
| projectTitle   | string  |         ID           |
| companyId      | string  |         ID           |
| companyName    | string  |         name         |
| status         | int     |    参见上表           |
| feedback       | int     |    数字评定星级       |
| click          | bool    |    是否点击过         |
| createTime     | string  |    创建的时间         |
- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": {
        "total": 0,
        "records": [
            {
                "id": 3,
                "applicationId": null,
                "userId": "886b859766db6cf49b2d20897f77bfa6",
                "userName": "Tianji Chen",
                "projectId": "a3500861-3fa0-41f8-8fa8-c8eade2451e0",
                "projectTitle": "AI-Powered Smart Farming System",
                "companyId": "14551e7a5f77704c131c5625f4f1295f",
                "companyName": "Google",
                "status": 2,
                "feedback": null,
                "click": false,
                "createTime": "2024-10-25T19:42:48"
            },
            {
                "id": 2,
                "applicationId": null,
                "userId": "886b859766db6cf49b2d20897f77bfa6",
                "userName": "Tianji Chen",
                "projectId": "d0939afd-df23-4505-9a43-353528270870",
                "projectTitle": "AI-Powered Smart Farming System",
                "companyId": "14551e7a5f77704c131c5625f4f1295f",
                "companyName": "Google",
                "status": 2,
                "feedback": null,
                "click": false,
                "createTime": "2024-10-25T19:30:23"
            },
            {
                "id": 1,
                "applicationId": null,
                "userId": "886b859766db6cf49b2d20897f77bfa6",
                "userName": "Tianji Chen",
                "projectId": "d0939afd-df23-4505-9a43-353528270870",
                "projectTitle": "AI-Powered Smart Farming System",
                "companyId": "14551e7a5f77704c131c5625f4f1295f",
                "companyName": "Google",
                "status": 2,
                "feedback": null,
                "click": false,
                "createTime": "2024-10-25T18:48:56"
            }
        ]
    }
}

```

#### 批量生成通知
- **接口描述：**批量生成通知。
- **请求方法：** `POST`
- **接口路径：** `/notification/batch`
- - **示例：** `127.0.0.1:8080/notification/batch`
- **请求参数：**

参数是一个list！！！ 是application类型的list

|     参数名     | 类型     | 是否必填 | 描述                  |
| -------------  | ------  | -------- | ---------------------|
| applicationId  | int     | 否       |         ID          |
| userId         | string  | 是       |         ID          |
| userName       | string  | 是       |         name        |
| projectId      | string  | 是       |         ID          |
| projectTitle   | string  | 是       |         ID          |
| companyId      | string  | 是       |         ID          |
| companyName    | string  | 是       |         name        |
| status         | int     | 是       |    参见上表          |
| feedback       | int     | 否       |    数字评定星级       |

- **请求示例：**

```json

127.0.0.1:8080/notification/batch

```

- **返回值：**

暂无
- **返回值示例：**

```json
无

```

---
#### 点击通知
- **接口描述：** 用户点击通知。
- **请求方法：** `PUT`
- **接口路径：** `/notification/click/{id}`
- - **示例：** `127.0.0.1:8080/notification/click/3`
- **请求参数：**
路径id是notification的id

- **请求示例：**

```json

127.0.0.1:8080/notification/click/3

```

- **返回值：**

<!-- | 字段名   | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| success  | bool   | 评分是否成功         |
| message  | string | 结果信息             | -->

- **返回值示例：**

```json
{
    "code": 200,
    "msg": null,
    "token": null,
    "data": null
}
```

---

## 错误码说明

| 错误码 | 描述                     |
| ------ | ------------------------ |
| 400    | 请求参数错误             |
| 401    | 未授权，用户未登录       |
| 403    | 权限不足                 |
| 404    | 请求的资源不存在         |
| 500    | 服务器内部错误           |

0-apply 1-reject 2-enroll 3-done 4-userQuit 5-userFeedback 6-companyFeedback 7-invite

notification中的status

| status | 描述                     |
| ------ | ------------------------ |
|   0    | apply                    |
|   1    | reject                   |
|   2    | enroll                   |
|   3    | done                     |
|   4    | userQuit                 |
|   5    | userFeedback             |
|   6    | companyFeedback          |
|   7    | invite                   |

application中的status

| status | 描述                     |
| ------ | ------------------------ |
|   0    | applying/reject          |
|   2    | working                  |
|   3    | done                     |
|   4    | quit                     |

