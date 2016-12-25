export const get = (endpoint) => (
  new Promise((resolve, reject) => {
    let collection;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      try {
        collection = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      resolve(collection);
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('GET', endpoint, true);
    xmlhttp.send();
  })
);
export const getFile = (url) => (
  new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      const fileReader = new FileReader();
      fileReader.onload = ({ target: { result } }) => {
        resolve({
          url,
          file: result,
        });
      };
      fileReader.readAsDataURL(xmlhttp.response);
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('GET', url, true);
    xmlhttp.responseType = 'blob';
    xmlhttp.send();
  })
);
