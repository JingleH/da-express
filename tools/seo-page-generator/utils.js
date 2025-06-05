/* eslint-disable operator-linebreak */
export const DA_API = 'https://admin.da.live';
export const DA_EDIT = 'https://da.live/edit#';
export const ORG = 'jingleh';
export const REPO = 'da-express';
export const ROOT = `/${ORG}/${REPO}`;

export const [getToken, setToken] = (() => {
  const config = {};
  return [
    () => config.token,
    (t) => {
      config.token = t;
    },
  ];
})();

export async function postDoc(dest, html) {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const blob = new Blob([html], { type: 'text/html' });
  const body = new FormData();
  body.append('data', blob);
  const fullpath = `${DA_API}/source${dest}.html`;
  const opts = {
    headers,
    method: 'POST',
    body,
  };
  const resp = await fetch(fullpath, opts);
  console.log(resp.status);
}
