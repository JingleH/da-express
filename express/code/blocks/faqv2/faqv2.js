import { createTag, getLibs } from '../../scripts/utils.js';

let replaceKey;
let getConfig;

function addStructuredData(questions) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ header, subHeader }) => ({
      '@type': 'Question',
      name: header,
      acceptedAnswer: {
        '@type': 'Answer',
        text: subHeader,
      },
    })),
  };

  const script = createTag('script', {
    type: 'application/ld+json',
  });
  script.textContent = JSON.stringify(faqSchema);
  document.head.appendChild(script);
}

function createIcon(config, isCollapsed = false) {
  return createTag('img', {
    src: `${config.codeRoot}/icons/${isCollapsed ? 'minus' : 'plus'}-heavy.svg`,
    alt: `${isCollapsed ? 'Collapse' : 'Expand'} answer`,
    class: 'toggle-icon',
    'aria-hidden': 'true',
    loading: 'lazy',
    width: '12',
    height: '12',
    fetchpriority: 'low',
  });
}

function buildTableLayout(block) {
  const config = getConfig();
  const isLongFormVariant = block.classList.contains('longform');
  const rows = [...block.children];

  const section = createTag('section', {
    class: 'faqv2-section',
    role: 'region',
    'aria-label': 'Frequently Asked Questions',
  });

  const parentContainer = createTag('div');
  section.appendChild(parentContainer);

  const headerText = rows.shift()?.innerText.trim();
  if (headerText) {
    const rowAccordionHeader = createTag('h2', {
      class: 'faqv2-accordion title',
      id: 'faq-section-heading',
    });
    rowAccordionHeader.textContent = headerText;

    if (isLongFormVariant) {
      const container = createTag('div', {
        class: 'faqv2-longform-header-container',
        'aria-labelledby': 'faq-section-heading',
      });
      container.appendChild(rowAccordionHeader);
      parentContainer.appendChild(container);
    } else {
      parentContainer.appendChild(rowAccordionHeader);
    }
  }

  const faqList = createTag('div', {
    class: 'faqv2-accordions-col',
    role: 'list',
    'aria-label': 'FAQ Items',
  });
  parentContainer.appendChild(faqList);

  const collapsibleRows = rows.map((row, index) => {
    const cells = [...row.children];
    return {
      header: cells[0]?.textContent.trim(),
      subHeader: cells[1]?.textContent,
      id: `faq-item-${index}`,
    };
  });

  // Add structured data for SEO
  addStructuredData(collapsibleRows);

  collapsibleRows.forEach(({ header, subHeader, id }) => {
    const rowWrapper = createTag('div', {
      class: 'faqv2-wrapper',
      role: 'listitem',
    });
    faqList.appendChild(rowWrapper);

    const headerAccordion = createTag('div', {
      class: 'faqv2-accordion expandable header-accordion',
      role: 'button',
      'aria-expanded': 'false',
      'aria-controls': `${id}-content`,
      tabIndex: 0,
    });
    rowWrapper.appendChild(headerAccordion);

    const headerDiv = createTag('h3', {
      class: 'faqv2-header expandable',
      id,
    });
    headerDiv.textContent = header;
    headerAccordion.appendChild(headerDiv);

    const iconElement = createIcon(config);
    headerDiv.appendChild(iconElement);

    const subHeaderAccordion = createTag('div', {
      class: 'faqv2-accordion expandable sub-header-accordion',
      id: `${id}-content`,
      role: 'region',
      'aria-labelledby': id,
    });
    rowWrapper.appendChild(subHeaderAccordion);

    const subHeaderDiv = createTag('div', {
      class: 'faqv2-sub-header expandable',
    });
    subHeaderDiv.textContent = subHeader;
    subHeaderAccordion.appendChild(subHeaderDiv);

    headerDiv.addEventListener('click', () => {
      const isCollapsed = subHeaderAccordion.classList.toggle('collapsed');
      headerAccordion.setAttribute('aria-expanded', isCollapsed);

      const newIcon = createIcon(config, isCollapsed);
      iconElement.replaceWith(newIcon);
      iconElement = newIcon;

      if (!isLongFormVariant) {
        headerAccordion.classList.toggle('rounded-corners', isCollapsed);
      }
    });

    headerAccordion.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        headerDiv.click();
      }
    });
  });

  block.replaceChildren(section);
}

async function buildOriginalLayout(block) {
  const viewMoreText = await replaceKey('view-more', getConfig());
  const viewLessText = await replaceKey('view-less', getConfig());
  const collapsibleRows = [];
  const rows = Array.from(block.children);

  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const header = cells[0];
    const subHeader = cells[1];
    collapsibleRows.push({
      header: header.textContent.trim(),
      subHeader: subHeader?.textContent,
    });
  });

  // Add structured data for SEO
  addStructuredData(collapsibleRows);

  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }

  const visibleCount = 3;
  let isExpanded = false;

  collapsibleRows.forEach((row, index) => {
    const { header, subHeader } = row;

    const accordion = createTag('div', { class: 'faqv2-accordion' });

    if (index >= visibleCount) {
      accordion.classList.add('collapsed');
    }

    block.append(accordion);

    const headerDiv = createTag('h3', { class: 'faqv2-header' });
    accordion.append(headerDiv);
    headerDiv.textContent = header;

    let subHeaderDiv;
    if (subHeader) {
      subHeaderDiv = createTag('div', { class: 'faqv2-sub-header' });
      subHeaderDiv.textContent = subHeader;
      accordion.append(subHeaderDiv);
    }
  });

  const toggleButton = createTag('a', {
    class: 'faqv2-toggle-btn button',
    'aria-expanded': false,
    'aria-label': 'Expand quotes',
    role: 'button',
    tabIndex: 0,
  });

  toggleButton.textContent = viewMoreText;
  if (collapsibleRows.length > visibleCount) {
    block.append(toggleButton);
  }

  toggleButton.addEventListener('click', () => {
    const hiddenItems = block.querySelectorAll('.faqv2-accordion');
    hiddenItems.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.toggle('collapsed');
      }
    });

    isExpanded = !isExpanded;
    toggleButton.setAttribute('aria-expanded', isExpanded);
    toggleButton.textContent = isExpanded ? viewLessText : viewMoreText;
  });

  toggleButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleButton.click();
    }
  });
}

export default async function decorate(block) {
  block.classList.add('faqv2-loading');
  block.style.visibility = 'hidden';

  const loadDependencies = async () => {
    const [utils, placeholders] = await Promise.all([
      import(`${getLibs()}/utils/utils.js`),
      import(`${getLibs()}/features/placeholders.js`),
    ]);
    return { utils, placeholders };
  };

  try {
    const depsPromise = loadDependencies();

    const section = createTag('section', {
      class: 'faqv2-section',
      role: 'region',
      'aria-label': 'Frequently Asked Questions',
    });
    block.replaceChildren(section);
    block.style.visibility = 'visible';

    const { utils, placeholders } = await depsPromise;
    ({ getConfig } = utils);
    ({ replaceKey } = placeholders);

    const isExpandableVariant = block.classList.contains('expandable');

    block.setAttribute('itemscope', '');
    block.setAttribute('itemtype', 'https://schema.org/FAQPage');

    if (!block.closest('[lang]')) {
      block.setAttribute('lang', 'en');
    }

    requestIdleCallback(() => {
      if (isExpandableVariant) {
        buildTableLayout(block);
      } else {
        buildOriginalLayout(block);
      }

      block.classList.remove('faqv2-loading');
      block.classList.add('faqv2-loaded');
    }, { timeout: 2000 });
  } catch (error) {
    console.error('Error in FAQ component:', error);
    block.classList.remove('faqv2-loading');
    block.style.visibility = 'visible';
  }
}
