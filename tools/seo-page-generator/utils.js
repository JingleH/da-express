/* eslint-disable operator-linebreak */
export const DA_API = 'https://admin.da.live';
export const ORG = 'jingleh';
export const REPO = 'da-express';
export const ROOT = `/${ORG}/${REPO}`;

export const [getToken, setToken] = (() => {
  const config = {};
  return [
    () => config.token,
    (t) => {
      config.token = t;
    },
  ];
})();

export async function throwFetchErr(res) {
  const errorText = await res.text();
  throw new Error(`${res.status} - ${res.statusText}: ${errorText}`);
}

const MOCK_PAGE = `<body>
  <header></header>
  <main>
    <div>
      <div class="columns fullsize">
        <div>
          <div>
            <h1>Celebrate grads with custom ads made in minutes.</h1>
            <p>Honor the Class of 2025 with standout ads using Adobe Express. Whether you're cheering on a loved one or promoting a graduation event, create stunning designs in no time — no design skills required.</p>
            <p><a href="https://adobesparkpost.app.link/9m3BY52WtJb">Create now</a></p>
          </div>
          <div>
            <picture>
              <source srcset="https://main--express-milo--adobecom.aem.live/media_1019252070dece7a2ddadd7213264200dceaefb60.png">
              <source srcset="https://main--express-milo--adobecom.aem.live/media_1019252070dece7a2ddadd7213264200dceaefb60.png" media="(min-width: 600px)">
              <img src="https://main--express-milo--adobecom.aem.live/media_1019252070dece7a2ddadd7213264200dceaefb60.png" alt="" loading="lazy">
            </picture>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2>How to make your own graduation ad.</h2>
      <div class="steps highlight">
        <div>
          <div></div>
          <div>
            <h3>1. Choose a graduation ad template.</h3>
            <p>Browse designs tailored for graduation announcements, job-seeking support, and congratulatory messages. Whether you're a parent, educator, or business, there’s a style that fits.</p>
          </div>
        </div>
        <div>
          <div></div>
          <div>
            <h3>2. Make it uniquely yours.</h3>
            <p>Swap in photos, write your heartfelt message, and pick fonts that feel just right. Add school colors, inspiring quotes, or promotional offers to personalize your ad in seconds.</p>
          </div>
        </div>
        <div>
          <div></div>
          <div>
            <h3>3. Share online or print for the big day.</h3>
            <p>Download your final design as a social graphic, flyer, or postcard. Or get it professionally printed and delivered — just in time for the graduation celebration.</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="columns centered">
        <div>
          <div>
            <h2>Graduation ads designed to inspire and support.</h2>
            <p>From senior shoutouts to career fair promotions, create beautiful ads that uplift and empower graduates. With easy tools and ready-made templates, you can design something meaningful in no time.</p>
          </div>
          <div>
            <p><a href="https://main--express--adobecom.hlx.live/media_18ac7c5544b12070d3d0ecaa68ee493d0f8641884.mp4">https://main--express--adobecom.hlx.live/media_18ac7c5544b12070d3d0ecaa68ee493d0f8641884.mp4</a></p>
          </div>
        </div>
        <div>
          <div>
            <p><br>
              <picture>
                <source srcset="https://main--express-milo--adobecom.aem.live/media_1ff597af5f8536930f543695e125e564fc03d15f0.png">
                <source srcset="https://main--express-milo--adobecom.aem.live/media_1ff597af5f8536930f543695e125e564fc03d15f0.png" media="(min-width: 600px)">
                <img src="https://main--express-milo--adobecom.aem.live/media_1ff597af5f8536930f543695e125e564fc03d15f0.png" alt="" loading="lazy">
              </picture>
            </p>
          </div>
          <div>
            <h2>Give graduates the spotlight they deserve.</h2>
            <p>Support recent grads with a personalized message. Celebrate their hard work, or help promote their next steps — whether it's a new job, portfolio, or business venture.</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Print or share your grad ad with a click.</h2>
            <p>Bring your idea to life and let it travel far. Print your ad to display at parties or ceremonies, or post it on social to cheer on grads near and far.</p>
          </div>
          <div>
            <picture>
              <source srcset="https://main--express-milo--adobecom.aem.live/media_1a962903992a5a53c2e31ae155e85eda4d286854f.png">
              <source srcset="https://main--express-milo--adobecom.aem.live/media_1a962903992a5a53c2e31ae155e85eda4d286854f.png" media="(min-width: 600px)">
              <img src="https://main--express-milo--adobecom.aem.live/media_1a962903992a5a53c2e31ae155e85eda4d286854f.png" alt="" loading="lazy">
            </picture>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="template-x">
        <div>
          <div>
            <h2>Find free graduation templates and make them shine.</h2>
            <p>Graduation is a big milestone — make your message memorable. Use Adobe Express to craft thoughtful, vibrant designs without spending a dime.</p>
          </div>
        </div>
        <div>
          <div>
            <p><strong>Blank Template</strong></p>
          </div>
          <div>
            <picture>
              <source srcset="https://main--express-milo--adobecom.aem.live/media_1cb162cbc43ceab215886f87502f690f21a2c6473.png">
              <source srcset="https://main--express-milo--adobecom.aem.live/media_1cb162cbc43ceab215886f87502f690f21a2c6473.png" media="(min-width: 600px)">
              <img src="https://main--express-milo--adobecom.aem.live/media_1cb162cbc43ceab215886f87502f690f21a2c6473.png" alt="Icon: blank" loading="lazy">
            </picture>
          </div>
          <div>
            <p><a href="https://adobesparkpost.app.link/8JaoEy0DrSb">Start from scratch</a></p>
          </div>
          <div>
            <p>5:7</p>
          </div>
        </div>
        <div>
          <div>
            <p><strong>Q</strong></p>
          </div>
          <div>
            <p>graduation ad</p>
          </div>
        </div>
        <div>
          <div>
            <p><strong>Orientation</strong></p>
            <p><br> (Horizontal/Vertical)</p>
          </div>
          <div>
            <p>Vertical</p>
          </div>
        </div>
        <div>
          <div>
            <p><strong>Width</strong></p>
            <p><br>(<em>Full, Std, sixcols</em>)</p>
          </div>
          <div>
            <p>sixcols</p>
          </div>
        </div>
        <div>
          <div>
            <p><strong>Limit</strong></p>
            <p><br> (number of templates to load each pagination. Min. 5)</p>
          </div>
          <div>
            <p>23</p>
          </div>
        </div>
        <div>
          <div>
            <p><strong>Locales</strong></p>
          </div>
          <div>
            <p>EN</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="link-list">
        <div>
          <div>
            <h3>Discover even more.</h3>
            <p><a href="https://www.adobe.com/express/create/banner">Banner</a></p>
            <p><a href="https://www.adobe.com/express/create/post/social-media">Social Graphic</a></p>
            <p><a href="https://www.adobe.com/express/create/invitation">Invitation</a></p>
            <p><a href="https://www.adobe.com/express/create/video/slideshow">Slideshow</a></p>
            <p><a href="https://www.adobe.com/express/create/poster">Poster</a></p>
            <p><a href="https://www.adobe.com/express/create/photo-collage">Photo Collage</a></p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="banner">
        <div>
          <div>
            <h2>Effortlessly design stunning graduation ads with Adobe Express.</h2>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2>Frequently asked questions.</h2>
      <div class="faq">
        <div>
          <div>
            <p><strong>Can I create more than one graduation ad?</strong></p>
          </div>
          <div>
            <p>Absolutely! Design ads for multiple graduates or events. Save time by duplicating and customizing to fit each story.</p>
          </div>
        </div>
        <div>
          <div>
            <p><strong>How do I create front and back designs for printed ads?</strong></p>
          </div>
          <div>
            <p>Design your front page, duplicate the project, and build your back design with ease. Perfect for print-ready keepsakes or brochures.</p>
          </div>
        </div>
        <div>
          <div>
            <p><strong>Can I share my graduation ad on social media?</strong></p>
          </div>
          <div>
            <p>Yes! Download and post on Instagram, Facebook, LinkedIn, or anywhere grads and their supporters gather.</p>
          </div>
        </div>
        <div>
          <div>
            <p>Can I send my graduation ad digitally?</p>
          </div>
          <div>
            <p>Definitely. Download your design to email or post online. Add animations, music, or motion graphics for extra flair in the full editor.</p>
          </div>
        </div>
        <div>
          <div>
            <p>Can I get Adobe Express for free? If so, what’s included?</p>
          </div>
          <div>
            <p>Yes, Adobe Express has a free plan that includes core features like photo editing tools and effects and thousands of free templates. Learn more about our <a href="https://www.adobe.com/express/pricing">plans and pricing</a>.</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="metadata">
        <div>
          <div>
            <p>Title</p>
          </div>
          <div>
            <p>Free Online Graduation Ad Creator | Adobe Express</p>
          </div>
        </div>
        <div>
          <div>
            <p>Description</p>
          </div>
          <div>
            <p>Design graduation ads that inspire, uplift, and celebrate. Choose from beautiful free templates and customize in just minutes with Adobe Express.</p>
          </div>
        </div>
        <div>
          <div>
            <p>Short Title</p>
          </div>
          <div>
            <p>Graduation Ad</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer></footer>
</body>
`;

export async function post() {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const blob = new Blob([MOCK_PAGE], { type: 'text/html' });
  const body = new FormData();
  body.append('data', blob);
  // const url = `${DA_API}/source${file}`;
  const fullpath = `https://admin.da.live/source/${ORG}/${REPO}/drafts/jingleh/hello-world.html`;
  const opts = {
    headers,
    method: 'POST',
    body,
  };
  const resp = await fetch(fullpath, opts);
  console.log(resp.status);
}

export function createTag(tag, attributes, html, options = {}) {
  const el = document.createElement(tag);
  if (html) {
    if (
      html instanceof HTMLElement ||
      html instanceof SVGElement ||
      html instanceof DocumentFragment
    ) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  options.parent?.append(el);
  return el;
}

const apiKey = '';

const topicsPrompt = '';

export async function fetchTopics() {
  const body = JSON.stringify({
    // model: 'gpt-4',
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: topicsPrompt },
    ],
  });
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}
