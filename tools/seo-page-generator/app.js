/* eslint-disable arrow-body-style */
import { html, useState } from './htm-preact.js';
import getTopics from './topics.js';

function ActionArea() {
  return html`<div class="action-area">
    <button class="generate-page">Create Page</button>
  </div>`;
}

const topicsShowCnt = 4;
const totalTopicsCnt = getTopics().length;
const topics = getTopics();

async function loadTopics() {
  await new Promise((res) => {
    setTimeout(res, 2000);
  });
  return topics;
}

function Topics({ topicsIndex, loading, showTopics }) {
  if (loading) return html`<div class='spinner' role='status' aria-label='Loading'></div>`;
  if (!showTopics) return null;
  return topics.slice(topicsIndex, topicsIndex + topicsShowCnt).map(({ title, p, tasks }) => {
    return html`<div class="topic">
      <strong>${title}</strong>
      <p>${p}</p>
      Recommended forms: ${tasks}
      <${ActionArea} />
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
    await loadTopics(currTopicsIndex);
    setCurrTopicsIndex(
      (curr) => (curr + topicsShowCnt + totalTopicsCnt) % totalTopicsCnt,
    );
    setShowTopics(true);
    setLoading(false);
  };
  return html`
    <h2>Discover Trending Topics</h2>
    <button class="generate-topics" onclick=${clickGenerateHandler}>
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
