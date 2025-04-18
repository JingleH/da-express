import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { ROOT, getDocs, body2Row, setToken } from './utils.js';

const { token } = await DA_SDK;
setToken(token);
function updateQueryParam(key, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, '', url);
}
updateQueryParam('test', 2);
async function init() {
  const main = document.body.querySelector('main');
  const results = main.querySelector('.results');
  const loader = main.querySelector('.loader');
  const header = document.body.querySelector('header');

  const hidingBlocks = new Set();

  const searchInput = header.querySelector('input.folder');
  const searchButton = header.querySelector('button.folder');
  searchButton.addEventListener('click', async () => {
    const folder = searchInput.value.trim();
    if (!folder) {
      return;
    }
    results.classList.add('hidden');
    loader.classList.remove('hidden');
    results.querySelectorAll('.row').forEach((row) => row.remove());
    const bodies = await getDocs(`${ROOT}${folder}`);
    const rows = bodies.map((body) => body2Row(body));
    loader.classList.add('hidden');
    results.classList.remove('hidden');
    results.append(...rows);

    const blocks = new Set(
      [...results.querySelectorAll('[data-block-name]')].map((node) =>
        node.getAttribute('data-block-name')
      )
    );
  });

  const filterInput = header.querySelector('input.filter');
  const filterButton = header.querySelector('button.filter');
  filterButton.addEventListener('click', () => {
    const filterValue = filterInput.value.trim();
    const regex = filterValue && new RegExp(filterValue);
    main.querySelectorAll('.row').forEach((row) => {
      if (regex && !regex.exec(row.querySelector('.path').textContent)) {
        row.classList.add('hide');
      } else {
        row.classList.remove('hide');
      }
    });
  });
  searchInput.value = '/express/template-docs';
}

init().catch(console.error);
