const { net, session } = require('@electron/remote');
import { Base64 } from '@/utils/utils.js';
import md5 from 'js-md5';
const defaultRequest = {
  method: 'POST',
  protocol: 'http:',
  hostname: 'ipmp.spdb.com',
  port: 80,
  session: session.defaultSession,
  useSessionCookies: true,
};

export function loginIPMP(username, userpwd) {
  return new Promise((resolve, reject) => {
    let base = new Base64();
    const params = `username=${encodeURIComponent(
      base.encode(username)
    )}&userpwd=${encodeURIComponent(base.encode(userpwd))}`;
    let time = '' + new Date().getTime();
    let res;
    // let params = 'username=d2VudHk%3D&userpwd=MTQwNDU0ako%3D';
    const request = net.request({
      ...defaultRequest,
      path: '/ipmp/api/sys/users/v1/login?t=' + time,
      headers: {
        // 这里要将content-type改成这种提交form表单时使用的格式
        'Content-Type': 'application/x-www-form-urlencoded',
        Sign: md5(`${params + time + 'F7x_' + time.substr(-4)}`),
      },
    });
    request.on('response', (response) => {
      // str += `STATUS: ${response.statusCode}\n`;
      // str += `HEADERS: ${JSON.stringify(response.headers)}\n`;
      response.on('end', () => {
        resolve(res);
      });
      response.on('error', (chunk) => {
        reject(chunk);
      });
      response.on('data', (chunk) => {
        res = chunk;
      });
    });
    request.write(params);
    request.end();
  });
}

export function getIPMPPage(params) {
  return new Promise((resolve, reject) => {
    let time = '' + new Date().getTime();
    let res = '';
    params = JSON.stringify(params);
    // let params = 'username=d2VudHk%3D&userpwd=MTQwNDU0ako%3D';
    const request = net.request({
      ...defaultRequest,
      path: '/ipmp/api/biz/workload/manhour/comm/v1/register/page?t=' + time,
      headers: {
        // 这里要将content-type改成这种提交form表单时使用的格式
        'Content-Type': 'application/json',
        Sign: md5(`${params + time + 'F7x_' + time.substr(-4)}`),
      },
    });
    request.on('response', (response) => {
      // str += `STATUS: ${response.statusCode}\n`;
      // str += `HEADERS: ${JSON.stringify(response.headers)}\n`;
      response.on('end', () => {
        resolve(res);
      });
      response.on('error', (chunk) => {
        reject(chunk);
      });
      response.on('data', (chunk) => {
        res += chunk;
      });
    });
    request.write(params);
    request.end();
  });
}

export function fillHour(params) {
  return new Promise((resolve, reject) => {
    let time = '' + new Date().getTime();
    let res;
    params = JSON.stringify(params);
    // let params = 'username=d2VudHk%3D&userpwd=MTQwNDU0ako%3D';
    const request = net.request({
      ...defaultRequest,
      path: '/ipmp/api/biz/workload/manhour/comm/v1/add?t=' + time,
      headers: {
        // 这里要将content-type改成这种提交form表单时使用的格式
        'Content-Type': 'application/json',
        Sign: md5(`${params + time + 'F7x_' + time.substr(-4)}`),
      },
    });
    request.on('response', (response) => {
      // str += `STATUS: ${response.statusCode}\n`;
      // str += `HEADERS: ${JSON.stringify(response.headers)}\n`;
      response.on('end', () => {
        resolve(res);
      });
      response.on('error', (chunk) => {
        reject(chunk);
      });
      response.on('data', (chunk) => {
        res = chunk;
      });
    });
    request.write(params);
    request.end();
  });
}

export function rejectHour(params) {
  return new Promise((resolve, reject) => {
    let time = '' + new Date().getTime();
    let res;
    params = JSON.stringify(params);
    // let params = 'username=d2VudHk%3D&userpwd=MTQwNDU0ako%3D';
    const request = net.request({
      ...defaultRequest,
      path: '/ipmp/api/biz/workload/manhour/comm/v1/reject?t=' + time,
      headers: {
        // 这里要将content-type改成这种提交form表单时使用的格式
        'Content-Type': 'application/json',
        Sign: md5(`${params + time + 'F7x_' + time.substr(-4)}`),
      },
    });
    request.on('response', (response) => {
      // str += `STATUS: ${response.statusCode}\n`;
      // str += `HEADERS: ${JSON.stringify(response.headers)}\n`;
      response.on('end', () => {
        resolve(res);
      });
      response.on('error', (chunk) => {
        reject(chunk);
      });
      response.on('data', (chunk) => {
        res = chunk;
      });
    });
    request.write(params);
    request.end();
  });
}
