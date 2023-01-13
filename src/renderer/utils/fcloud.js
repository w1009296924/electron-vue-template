import { getRSA } from "@/utils/rsa.js";
import store from "@/store";

let pubkey;
let exponent = "10001";

async function getKey() {
  const res = await fetchApi(
    "http://fcloud.spdb.com/api/auth/login/key",
    "GET"
  );
  pubkey = res.modulus;
  exponent = res.exponent;
}

async function fcloudLogin() {
  await getKey();
  const username = store.state.user.name;
  const password = store.state.user.password;
  const res = await fetchApiNotJson(
    "http://fcloud.spdb.com/api/auth/login",
    "POST",
    `username=${username}&password=${getRSA(
      password,
      pubkey,
      exponent
    )}&type=LDAP`
  );
  if (res.code == 200) {
    store.commit("SET_TOKEN", res.data);
    return true;
  } else {
    alert("账号密码错误！");
    return false;
  }
}

async function fcloudQueryTask() {
  const username = store.state.user.name;
  const res = await fetchApi(
    `http://fcloud.spdb.com/api/boards/projects/7060343/workspace/work-items?projectType=1&listStructure=1&queryMode=workitem&sort=updated_at-desc&pageSize=20&currentPage=1`,
    "POST",
    [
      { constValues: [], key: "type", operation: "eq", values: ["5"] },
      { constValues: [], key: "assignee", operation: "eq", values: [username] },
      {
        constValues: [],
        key: "attention_person",
        operation: "eq",
        values: [username],
      },
    ],
    true
  );
  if (res.code == 200) {
    return res.data;
  } else if (res.code == 401) {
    let res2 = await fcloudLogin();
    if (res2 == true) {
      const res3 = await fetchApi(
        `http://fcloud.spdb.com/api/boards/projects/7060343/workspace/work-items?projectType=1&listStructure=1&queryMode=workitem&sort=updated_at-desc&pageSize=20&currentPage=1`,
        "POST",
        [
          { constValues: [], key: "type", operation: "eq", values: ["5"] },
          {
            constValues: [],
            key: "assignee",
            operation: "eq",
            values: [username],
          },
          {
            constValues: [],
            key: "attention_person",
            operation: "eq",
            values: [username],
          },
        ],
        true
      );
      if (res.code == 200) {
        return res.data;
      } else {
        console.log(("fcloudQueryTask msg " + res.msg) | res.message);
        return null;
      }
    }
  } else {
    console.log(("fcloudQueryTask msg " + res.msg) | res.message);
    return null;
  }
}

async function fetchApi(url, method, params, needToken = false) {
  let headers = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  if (needToken) {
    headers.cdrdsauthen = store.state.user.token;
  }
  let fetchParam = {
    method: method,
    headers: headers,
  };
  if (params) {
    fetchParam.body = JSON.stringify(params);
  }
  let res = await fetch(url, fetchParam);
  if (res.status == 401) {
    return { code: 401 };
  }
  res = await res.json();
  return res;
}

async function fetchApiNotJson(url, method, params, needToken = false) {
  let headers = {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (needToken) {
    headers.cdrdsauthen = store.state.user.token;
  }
  let fetchParam = {
    method: method,
    headers: headers,
  };
  if (params) {
    fetchParam.body = params;
  }
  let res = await fetch(url, fetchParam);
  res = await res.json();
  return res;
}
