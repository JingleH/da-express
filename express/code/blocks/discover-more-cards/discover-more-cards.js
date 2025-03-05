import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;
function constructPayload(content) {
  return content.map(({ children: [imgDiv, titleDiv, detailsDiv] }) => ({
    img: imgDiv?.querySelector('img')?.src ?? null,
    cardTitle: titleDiv?.innerText?.trim() ?? '',
    cardDetails: detailsDiv?.innerText?.trim() ?? '',
  }));
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addTempWrapperDeprecated(block, 'discover-more-cards');

  const cardsWrapper = createTag('div', { class: 'discover-more-cards-wrapper' });
  const rows = [...block.children];
  const isBgImage = rows[0]?.querySelector('img')?.src;

  if (isBgImage) {
    cardsWrapper.style.setProperty('--bg-image', `url(${rows[0].querySelector('img').src})`);
    rows.shift();
  }

  const header = rows[0]?.querySelector('h1, h2, h3, h4, h5, h6');
  if (header) {
    const headerSection = createTag('div', { class: 'discover-more-cards-header' });
    const parent = header.parentElement;
    const grandparent = parent?.parentElement;

    headerSection.append(header);
    block.prepend(headerSection);
    rows.shift();

    // Clean up empty ancestors in order
    parent?.remove();
    grandparent?.children.length === 0 && grandparent.remove();
  }

  const content = [...block.children].filter((child) => child.tagName === 'DIV');
  content.splice(0, isBgImage ? 2 : 1);

  const payload = constructPayload(content);
  console.log('payload', payload);
}
