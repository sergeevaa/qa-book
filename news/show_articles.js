const newsDiv = document.querySelector('.news__item-title');
const idsRequest = new XMLHttpRequest();
const url = 'https://olebbj.pythonanywhere.com/api';
title_k = 25;
description_k = 50;

function showArticles() {
  getArticleIds()
    .then(ids => {
      const articlePromises = ids.map(id => getArticle(id));
      return Promise.all(articlePromises);
    })
    .then(articles => {
      const articleElements = articles.map(article => createArticleElement(article));
      appendArticles(articleElements);
    })
    .catch(error => {
      console.error(error);
    });
}

function getArticleIds() {
  return new Promise((resolve, reject) => {
    const idsRequest = new XMLHttpRequest();
    idsRequest.open('GET', `${url}/article/ids`);
    idsRequest.onload = () => {
      if (idsRequest.status === 200) {
        const ids = JSON.parse(idsRequest.responseText);
        resolve(ids);
      } else {
        reject(Error(idsRequest.statusText));
      }
    };
    idsRequest.onerror = () => {
      reject(Error('Network Error'));
    };
    idsRequest.send();
  });
}

function getArticle(id) {
  return new Promise((resolve, reject) => {
    const articleRequest = new XMLHttpRequest();
    articleRequest.open('GET', `${url}/article/${id}`);
    articleRequest.onload = () => {
      if (articleRequest.status === 200) {
        const article = JSON.parse(articleRequest.responseText);
        resolve(article);
      } else {
        reject(Error(articleRequest.statusText));
      }
    };
    articleRequest.onerror = () => {
      reject(Error('Network Error'));
    };
    articleRequest.send();
  });
}

function createArticleElement(article) {
  const articleItem = document.createElement("h2");
  articleItem.className = "news__item-title";
  articleItem.textContent = article.title;

  const articleDescription = document.createElement("p");
  articleDescription.className = "news__item-description";
  articleDescription.textContent = article.description;
  
  const newsItem = document.createElement("div");
  newsItem.classList.add("news__item");
  
  showText(article.title, title_k, function(truncated_text) {
    articleItem.textContent = truncated_text;
    newsItem.appendChild(articleItem);
    showText(article.description, description_k, function(truncated_text) {
        articleDescription.textContent = truncated_text;
        newsItem.appendChild(articleDescription);
      });
  });
  return newsItem;
}

function appendArticles(articleElements) {
  const newsItemContent = document.querySelector(".news__item-content");
  articleElements.forEach(article => {
    newsItemContent.appendChild(article);
  });
}

function showText(text, k, callback) {
    const show_text = new XMLHttpRequest();
    show_text.open('PUT', `${url}/article/getText`);
    show_text.setRequestHeader('Content-Type', 'application/json');
    show_text.send(JSON.stringify({"text": text, "k": k}));
    show_text.onreadystatechange = async function() {
      if (show_text.readyState === XMLHttpRequest.DONE && show_text.status === 200) {
        const text_show_res = await JSON.parse(show_text.responseText);
        callback(text_show_res.text);
      }
    };
}

showArticles();