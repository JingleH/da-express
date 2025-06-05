/* eslint-disable arrow-body-style */
import { html, useState } from './htm-preact.js';
import getTopics from './topics.js';
import getDoc from './doc.js';
import { ROOT, DA_EDIT, postDoc } from './utils.js';

function ActionArea({ title }) {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const docTitle = title
    .toLowerCase()
    .replaceAll('\'', '')
    .replaceAll('’', '')
    .replaceAll(':', '')
    .replaceAll(' ', '-');
  const editSrc = `${DA_EDIT}${ROOT}/express/generated/2025-06/${docTitle}`;
  const link = generated ? html`<a href=${editSrc} target='_blank'>${editSrc}</a>` : null;
  const clickHandler = async () => {
    setLoading(true);
    const doc = getDoc(docTitle);
    await postDoc(`${ROOT}/express/generated/2025-06/${docTitle}`, doc.html);
    setGenerated(true);
    setLoading(false);
  };
  return html`<div class="action-area">
    <button class="generate-page" disabled=${loading || generated} onclick=${clickHandler}>Create Page</button>
    <div>
      ${loading ? html`<div class='spinner mini' role='status' aria-label='Loading'></div>` : link}
    </div>
  </div>`;
}

const topicsShowCnt = 4;
const totalTopicsCnt = getTopics().length;
const topics = getTopics();

function Topics({ topicsIndex, loading, showTopics }) {
  if (loading) return html`<div class='spinner' role='status' aria-label='Loading'></div>`;
  if (!showTopics) return null;
  return topics.slice(topicsIndex, topicsIndex + topicsShowCnt).map(({ title, p, tasks }) => {
    return html`<div class="topic">
      <strong>${title}</strong>
      <p>${p}</p>
      Recommended forms: ${tasks}
      <${ActionArea} title=${title} />
      <hr />
    </div>`;
  });
}

export default function App() {
  const [currTopicsIndex, setCurrTopicsIndex] = useState(0);
  const [showTopics, setShowTopics] = useState(false);
  const [loading, setLoading] = useState(false);

  const clickGenerateHandler = async () => {
    setLoading(true);
    await new Promise((res) => {
      setTimeout(res, 1500);
    });
    setShowTopics(true);
    if (showTopics) {
      setCurrTopicsIndex(
        (curr) => (curr + topicsShowCnt + totalTopicsCnt) % totalTopicsCnt,
      );
    }
    setLoading(false);
  };
  return html`
    <h2>Discover Trending Topics</h2>
    <button class="generate-topics" disabled=${loading} onclick=${clickGenerateHandler}>
      Generate Topics
    </button>
    <div class="topics">
      <${Topics}
        loading=${loading}
        showTopics=${showTopics}
        topicsIndex=${currTopicsIndex}
      />
    </div>
  `;
}
