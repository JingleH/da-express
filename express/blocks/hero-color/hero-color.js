import { expressObj, getLibs } from '../../scripts/utils.js';
import { addTempWrapperDeprecated } from '../../scripts/utils/decorate.js';
import isDarkOverlayReadable from '../../scripts/color-tools.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

function changeTextColorAccordingToBg(
  primaryColor,
  block,
) {
  block.classList.add(isDarkOverlayReadable(primaryColor) ? 'light' : 'dark');
}

function loadSvgInsideWrapper(svgId, svgWrapper, secondaryColor) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';

  // create svg element
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'color-svg-img hidden-svg');

  // create use element
  const useSvg = document.createElementNS(svgNS, 'use');
  useSvg.setAttributeNS(xlinkNS, 'xlink:href', `/express/icons/color-sprite.svg#${svgId}`);

  // append use element to svg element
  svg.appendChild(useSvg);

  // append new svg and remove old one
  svgWrapper.replaceChildren();
  svgWrapper.appendChild(svg);
  svgWrapper.firstElementChild.style.fill = secondaryColor;
}

function displaySvgWithObject(block, secondaryColor) {
  const svg = block.firstElementChild;
  const svgId = svg.firstElementChild.textContent;
  const svgWrapper = createTag('div', { class: 'color-svg' });

  svg.remove();
  loadSvgInsideWrapper(svgId, svgWrapper, secondaryColor);
  const svgContainer = block.querySelector('.svg-container');
  svgContainer.append(svgWrapper);
}

function decorateText(block) {
  const text = block.firstElementChild;
  text.classList.add('text-container');
  block.append(text);
}

function extractColorElements(colors) {
  const primaryColor = colors.children[0].textContent.split(',')[0].trim();
  const secondaryColor = colors.children[0].textContent.split(',')[1].trim();
  colors.remove();

  return { primaryColor, secondaryColor };
}

function decorateColors(block) {
  const colors = block.firstElementChild;
  const svgContainer = block.querySelector('.svg-container');
  const { primaryColor, secondaryColor } = extractColorElements(colors);

  if (svgContainer) svgContainer.style.backgroundColor = primaryColor;

  changeTextColorAccordingToBg(primaryColor, block);

  return { secondaryColor };
}

function getContentContainerHeight() {
  const contentContainer = document.querySelector('.svg-container');

  return contentContainer?.clientHeight;
}

function resizeSvgOnLoad() {
  const interval = setInterval(() => {
    if (document.readyState === 'complete') {
      const height = getContentContainerHeight();
      if (height) {
        const svg = document.querySelector('.color-svg-img');
        svg.classList.remove('hidden-svg');
        svg.style.height = `${height}px`;
        clearInterval(interval);
      }
    }
  }, 50);
}

export function resizeSvg(event) {
  const height = getContentContainerHeight();
  const svg = document.querySelector('.color-svg-img');
  if (event.matches) {
    svg.style.height = `${height}px`;
  } else {
    svg.style.height = '200px';
  }
}

function resizeSvgOnMediaQueryChange() {
  const mediaQuery = window.matchMedia('(min-width: 900px)');
  mediaQuery.addEventListener('change', resizeSvg);
}

function decorateCTA(block) {
  const primaryCta = block.querySelector('.text-container a.button');
  if (!primaryCta) return;

  primaryCta.classList.add('primaryCta');
  expressObj.primaryCtaUrl = primaryCta.href;
}

export default function decorate(block) {
  addTempWrapperDeprecated(block, 'hero-color');

  const svgContainer = createTag('div', { class: 'svg-container' });
  block.append(svgContainer);

  // text
  decorateText(block);

  // CTA
  decorateCTA(block);

  // colors
  const { secondaryColor } = decorateColors(block);

  // svg
  displaySvgWithObject(block, secondaryColor);
  resizeSvgOnLoad();
  resizeSvgOnMediaQueryChange();
}
