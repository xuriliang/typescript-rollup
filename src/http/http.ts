export function getRequestUrl(service: string, url: string): string {
  url = service + url;
  if (url.indexOf('token=') >= 0) {
    return url;
  }
  if (url.indexOf('?') > 0) {
    url += '&token=' + getToken();
  } else {
    url += '?token=' + getToken();
  }
  return url;
}

export function getToken(): string {
  return '';
}

export function ajaxPost(url: string, param: object = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(param),
    })
      .then((resp) => {
        if (resp.status !== 200) {
          reject && reject();
        } else {
          resp.json().then((data) => {
            resolve && resolve(data);
          });
        }
      })
      .catch((err) => {
        reject && reject();
      });
  });
}
