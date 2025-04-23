// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { ROOT, getDocs, convertBody, setToken, createTag } from './utils.js';

const { token } = await DA_SDK;
setToken(token);

async function init() {
  const main = document.body.querySelector('main');
  const results = main.querySelector('.results');
  const loader = main.querySelector('.loader');
  const header = document.body.querySelector('header');
  const blockList = header.querySelector('.block-list');
  const sectionList = header.querySelector('.section-list');

  // const hidingBlocks = new Set();

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
    const blockNames = new Set();
    let maxSectionCnt = 0;
    const rows = bodies.map((body) => {
      const { row, blockSet, sectionCnt } = convertBody(body);
      maxSectionCnt = Math.max(sectionCnt, maxSectionCnt);
      blockSet.forEach((blockName) => blockNames.add(blockName));
      return row;
    });
    loader.classList.add('hidden');
    results.classList.remove('hidden');
    results.append(...rows);

    blockList.innerHTML = '';
    blockNames.forEach((blockName) => {
      blockList.append(createTag('button', { class: 'block-button active' }, blockName));
    });
  });
  header.addEventListener('click', ({ target }) => {
    if (!target.classList.contains('block-button') && !target.classList.contains('section-button')) return;
    const isActive = target.classList.contains('active');
    if (target.classList.contains('block-button')) {
      target.classList.remove(isActive ? 'active' : 'inactive');
      target.classList.add(isActive ? 'inactive' : 'active');
      [...main.querySelectorAll('.node-wrapper.block')].forEach((block) => {
        if (block.classList.contains(target.textContent)) {
          block.classList.toggle('hidden');
        }
      });
    }
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
