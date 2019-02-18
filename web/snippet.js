function loadImageAsync(url) {
    return new Promise((reslove, reject) => {
        let image = new Image();
        image.onload = () => {
            reslove(image);
        };
        image.onerror = () => {
            reject(new Error('load image failed' + url));
        };

        image.src = url;
    });
}

const getJson = function(url) {
    return new Promise((reslove, reject) => {
        const handler = function() {
            if (this.readyState != 4) {
                return;
            }
            if (this.status == 200) {
                reslove(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = handler;
        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send();
    });
};

getJson('/post/1.json')
    .then(function(post) {
        return getJson(post.commentURL);
    })
    .then(
        function(comments) {
            console.log('resloved:' + comments);
        },
        function(err) {
            console.log('rejected:' + err);
        }
    );

let count = 1;
const p1 = new Promise((reslove, reject) => {
    setTimeout(function() {
        reslove('p1');
    }, 2000);
});

const p2 = new Promise((reslove, reject) => {
    setTimeout(function() {
        reject(new Error('p2'));
    });
});

const p3 = new Promise((reslove, reject) => {});
