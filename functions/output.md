# Oedi API
Oedi API powered by Firebase Functions and Moralis, base_url: https://us-central1-oedi-a1953.cloudfunctions.net/api

## Version: 1.0.0

### Terms of service


### /stream/create

#### POST
##### Summary:

Creates a new stream on Moralis server

##### Parameters

| Name | Located in | Description | Required | Schema |
|------|------------|-------------|----------|--------|
|------|------------|-------------|----------|--------|

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Stream object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| JWT | |

### /stream/update/:id

#### PATCH
##### Summary:

Updates a stream on Moralis server

##### Parameters

| Name | Located in | Description             | Required | Schema |
|------|------------|-------------------------|----------|--------|
| id   | query      | Stream ID to be updated | Yes      | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Stream object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| JWT | |

### /stream/getAll

#### GET
##### Summary:

Gets all streams on Moralis server

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Stream object |

null

### /stream/delete/:id

#### DELETE
##### Summary:

Deletes a stream on Moralis server

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | query | Stream ID to be deleted | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Stream object |

null

### /stream/:id/add

#### POST
##### Summary:

Adds an address to a stream

##### Parameters

| Name | Located in | Description                            | Required | Schema |
|------|------------|----------------------------------------|----------|--------|
| id   | query      | Stream ID where address is to be added | Yes      | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Stream object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| JWT | |

### /stream/:id/remove

#### POST
##### Summary:

Removes an address from a stream

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | query | Stream ID where address is to be removed | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Stream object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| JWT | |

### /stream/:id/list

#### GET
##### Summary:

Gets all addresses from a stream

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | query | Stream ID where addresses are to be fetched | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Stream object |

null

### /profile/create

#### POST
##### Summary:

Creates a new user's profile on Firestore

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Profile object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| JWT | |

### /profile/update

#### PATCH
##### Summary:

Updates a user's profile on Firestore

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Profile object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| JWT | |

### /profile/get/:id

#### GET
##### Summary:

Gets a user's profile on Firestore

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | query | User ID to get profile | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Profile object |

null

### /profile/delete

#### DELETE
##### Summary:

Deletes a user's profile on Firestore

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | success object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| JWT | |

### /ext-moralis-auth-requestMessage

#### POST
##### Summary:

Request a message to be signed by the user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | The response object containing the message needs to be signed by the user |

null

### /ext-moralis-auth-issueToken

#### POST
##### Summary:

Issue a token for the user after verifying the signature

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | The response object containing the auth token(custom token) |

null
