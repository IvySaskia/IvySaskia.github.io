const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://api.escuelajs.co/api/v1/products';
const INITIAL = 5;
const ELEMENTS_PER_PAGE = 10;
const LIMIT = 200;

localStorage.removeItem('pagination');

const card = (p) => {
  return `<article class='Card' id='${p.id}' >
  <img src='${p.images[0]}' alt='${p.title}' />
  <h2>
    ${p.title}
    <small>$ ${p.price}</small>
  </h2>
</article>`
}

const getData = api => {
  console.log(api)
  fetch(api)
    .then(response => response.json())
    .then(response => {
      let products = response;
      let output = products.map((p) => {
        if (p.id > LIMIT) return;
        return card(p);
      });
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output.join('');
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = async() => {
  const offset = parseInt(localStorage.getItem('pagination')) + ELEMENTS_PER_PAGE || INITIAL;
  console.log(offset);
  localStorage.setItem('pagination', offset);

  const queryParams = new URLSearchParams({
    offset,
    limit: ELEMENTS_PER_PAGE,
  });

  await getData(API + '?' + queryParams);
}

const intersectionObserver = new IntersectionObserver(
  (entries) => entries.forEach(async (entry) => {
    const { isIntersecting } = entry;
    if (isIntersecting) {
      const ended = await loadData();
      if(ended) observer.disconnect();
  }
}),
  { rootMargin: '0px 0px 100% 0px' }
);

intersectionObserver.observe($observe);
