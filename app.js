if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js', { scope: './' })
    .then(function(registration) {
      console.log("Service Worker Registered");
    })
    .catch(function(err) {
      console.log("Service Worker Failed to Register", err);
    })

}


// Function to perform HTTP request
var get = function(url) {
  return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var result = xhr.responseText
                result = JSON.parse(result);
                resolve(result);
            } else {
                reject(xhr);
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send();

  }); 
};


/* const apiKey = 'd9afb932033b4d509b153558246d97a6'; */
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'the-washington-post';

window.addEventListener('load', async e => {
	updateNews();
	await updateSources();
	sourceSelector.value = defaultSource;
	sourceSelector.addEventListener('change', e => {
		updateNews(e.target.value);
	});
	
});

async function updateSources(){
const res = await fetch(`https://newsapi.org/v2/sources?&apiKey=d9afb932033b4d509b153558246d97a6`);
const json = await res.json();
sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');
}

async function updateNews(source = defaultSource) {
const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=d9afb932033b4d509b153558246d97a6`);
const json = await res.json();
main.innerHTML = json.articles.map(createArticle).join('\n');

	}

	function createArticle(article) {
		return `<div class="article">
		<a href="${article.url}">
		<h2> ${article.title}</h2>
		<img src="${article.urlToImage}">
		<p>${article.description}</p>
		</a>
		</div>
		`;
	}

