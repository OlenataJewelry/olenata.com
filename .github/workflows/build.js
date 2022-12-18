const fs = require("fs");
const path = require("path");
const https = require("https");
const sharp = require("sharp");
const crypto = require("crypto");
const Parser = require("rss-parser");
const manifest = require("../../manifest.json");
const PAGES = require("./build.json");
const LINK_REL = "external noreferrer nofollow noopener";
const OG_IMAGE = "assets/images/og-image-1280x640.png";
const FEEDS = {};

const buildHomePage = async () => {
  let content = "";
  const hcwi = { className: "hcwi", count: 3 };
  const vcwi = { className: "vcwi", count: 1 };
  const text = { className: "text", count: 3 };

  const layouts = [
    [hcwi, vcwi, text],
    [text, hcwi, vcwi],
    [vcwi, text, hcwi],
  ];

  for (let index = 0; index < PAGES.length; ++index) {
    const data = PAGES[index];
    const uri = data.page;
    const layout = layouts[index % layouts.length];
    const feed = FEEDS[uri];

    content +=
      "<fieldset><legend><h2>" +
      `<a href="/${uri.replace("index.html", "")}">` +
      `${data.sections[0]}</a></h2></legend><div class="row">`;
    for (let i = 0; i < layout.length; ++i) {
      const cards = await getCards(feed, layout[i].count);
      content += `<div class="column ${layout[i].className}">${cards}</div>`;
    }
    content += "</div></fieldset>";
  }

  createPage("index.html", content, manifest.name, manifest.description);
};

const buildCommonPage = async (feed, sections) => {
  return `
    <fieldset>
      <legend><h2>${sections[0]}</h2></legend>
      <div class="row">
        <div class="column hcwi">${await getCards(feed, 4)}</div>
        <div class="column vcwi">${await getCards(feed, 2)}</div>
        <div class="column text">${await getCards(feed, 5)}</div>
      </div>
    </fieldset>
    <fieldset>
      <legend><h2>${sections[1] || "Most recent"}</h2></legend>
      <div class="row">
        <div class="column text">${await getCards(feed, 5)}</div>
        <div class="column hcwi">${await getCards(feed, 4)}</div>
        <div class="column vcwi">${await getCards(feed, 2)}</div>
      </div>
    </fieldset>
    <fieldset>
      <legend><h2>${sections[2] || "In case you missed"}</h2></legend>
      <div class="row">
        <div class="column vcwi">${await getCards(feed, 2)}</div>
        <div class="column text">${await getCards(feed, 5)}</div>
        <div class="column hcwi">${await getCards(feed, 4)}</div>
      </div>
    </fieldset>
  `;
};

const buildStaticPages = () => {
  const cwd = path.resolve("./");

  const terms = fs
    .readFileSync(path.join(cwd, "templates/terms.html"))
    .toString();
  createPage(
    "terms/index.html",
    terms,
    `Terms of Service - ${manifest.short_name}`
  );

  const privacy = fs
    .readFileSync(path.join(cwd, "templates/privacy.html"))
    .toString();
  createPage(
    "privacy/index.html",
    privacy,
    `Privacy Policy - ${manifest.short_name}`
  );

  const disclaimer = fs
    .readFileSync(path.join(cwd, "templates/disclaimer.html"))
    .toString();
  createPage(
    "disclaimer/index.html",
    disclaimer,
    `Disclaimer - ${manifest.short_name}`
  );

  const notFoundPage = fs
    .readFileSync(path.join(cwd, "templates/404.html"))
    .toString();
  createPage(
    "404.html",
    notFoundPage,
    `Page Not Found - ${manifest.short_name}`
  );
};

const createPage = (fileName, content, title, description) => {
  const cwd = path.resolve("./");
  const filePath = path.join(cwd, fileName);
  const header = fs
    .readFileSync(path.join(cwd, "templates/header.html"))
    .toString();
  const footer = fs
    .readFileSync(path.join(cwd, "templates/footer.html"))
    .toString();
  const date = new Date().toLocaleDateString("en-us", {
    timeZone: "America/New_York",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const slug = fileName.replace("index.html", "");
  const canonical = manifest.start_url.split("?")[0] + slug;
  const image = manifest.start_url.split("?")[0] + OG_IMAGE;
  fs.existsSync(path.dirname(filePath)) || fs.mkdirSync(path.dirname(filePath));
  fs.writeFileSync(
    filePath,
    (header + content + footer)
      .replace(/{{ title }}/gm, title)
      .replace(/{{ description }}/gm, description || title)
      .replace(/{{ canonical }}/gm, canonical)
      .replace(/{{ og-image }}/gm, image)
      .replace(/{{ slug }}/gm, slug.replace(/\W/g, ""))
      .replace(/{{ app-name }}/gm, manifest.short_name)
      .replace(/{{ theme-color }}/gm, manifest.theme_color)
      .replace(/{{ date-published }}/gm, date)
      .replace(/{{ year }}/gm, new Date().getFullYear())
  );
};

const getCards = async (items, count) => {
  items.sort(() => 0.5 - Math.random());
  let cards = "";
  for (let i = 0; i < count; ++i) {
    cards += getCard(await getNextItem(items));
  }
  return cards;
};

const getCard = (item) => {
  return item
    ? `
  <div itemscope itemtype="https://schema.org/NewsArticle" class="card">
    <meta itemprop="datePublished" content="${item.isoDate || item.pubDate}">
    <meta itemprop="dateModified" content="${item.isoDate || item.pubDate}">
    <link itemprop="mainEntityOfPage" href="${item.link}">
    <span itemprop="author" itemscope itemtype="https://schema.org/Person">
      <meta itemprop="name" content="${item.creator}">
    </span>
    <a itemprop="url" href="${item.link}" rel="${LINK_REL}" target="_blank">
      <div class="image" data-src="${item.image.url}">
        <noscript>
          <picture>
            <img src="${item.image.url}" 
                 itemprop="image" width="100%" loading="lazy" alt="" 
                 crossorigin="anonymous" referrerpolicy="no-referrer">
          </picture>
        </noscript>
      </div>
      <h3 itemprop="headline">${item.title}</h3>
      <p itemprop="text">${item.content.split("<")[0]}</p>
    </a>
  </div>`
    : "";
};

const getNextItem = async (items) => {
  if (items.length) {
    let item = items.pop();
    let image = await getImage(item);
    if (
      image &&
      item.title &&
      item.content &&
      item.content.trim() &&
      item.pubDate
    ) {
      item.image = image;
      item.link = item.link || item.guid;
      item.creator = getCreator(item);
      return item;
    }
    return await getNextItem(items);
  }
  return null;
};

const getImage = async (item) => {
  const group = item["media:group"] || item;
  const media = group["media:content"] || item["enclosure"];
  const image = (media &&
    (media.url
      ? media
      : Array.isArray(media)
      ? media[0]["$"]
      : media["$"])) || { url: item.image };

  if (image && image.url) {
    const originalImageURL = image.url;
    /**
     * https://static.politico.com/.../name.jpg
     * https://www.politico.com/dims4/resize/560x374!/quality/90/?url=https%3A%2F%2Fimage.jpg
     */
    if (/^https:\/\/(static\.)?politico\.com\//.test(image.url)) {
      image.url =
        "https://www.politico.com/dims4/strip/true/resize/560x374!/quality/90/?url=" +
        encodeURIComponent(image.url);
      image.width = 560;
      image.height = 374;
    } else if (/^https:\/\/(img\.)?huffingtonpost\.com\//.test(image.url)) {
      /**
       * https://img.huffingtonpost.com/.../name.jpeg?cache=by34au0e5v&ops=600_337
       */
      image.url = image.url.replace(/ops=(\d+)_(\d+)$/, "ops=600_337");
      image.width = 600;
      image.height = 337;
    } else if (/^https?:\/\/static\d+\.nyt\.com\//.test(image.url)) {
      /**
       * https://static01.nyt.com/images/.../uuid4-moth.jpg RSS
       * https://static01.nyt.com/images/.../uuid4-articleLarge.jpg?quality=75&auto=webp 600w,
       * https://static01.nyt.com/images/.../uuid4-facebookJumbo.jpg 1050x550
       */
      if (
        /[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}-moth.jpg$/i.test(
          image.url
        )
      ) {
        image.url = image.url.replace(
          "-moth.jpg",
          "-articleLarge.jpg?quality=75&auto=webp"
        );
        image.width = 600;
      } else if (image.url.endsWith("-moth.jpg")) {
        image.url = image.url.replace("-moth.jpg", "-facebookJumbo.jpg");
        image.width = 1050;
        image.height = 550;
      }
    } else if (/^https?:\/\/assets\d+\.cbsnewsstatic\.com\//.test(image.url)) {
      image.url = image.url.replace(/\/thumbnail\/\d+x\d+\//, "/");
    }

    try {
      const url = await downloadImage(image);
      // image.url = url || originalImageURL;
      if (url) {
        image.url = url;
      } else {
        return null;
      }
    } catch (ex) {
      console.error("Ex:", ex);
      console.error("Image:", image);
      // image.url = originalImageURL;
      return null;
    }

    return {
      url: image.url,
      height: image.height || 0,
      width: image.width || 0,
    };
  }

  return null;
};

const downloadImage = (image) => {
  const ext = image.url.split("?")[0].split(".").pop().slice(0, 3);
  const rnd = crypto.randomBytes(16).toString("hex");
  const filename = `${rnd}.${
    ["png", "jpg", "jpeg", "gif", "webp"].includes(ext) ? ext : "jpg"
  }`;
  const filepath = `assets/images/${filename}`;

  return new Promise((resolve, reject) => {
    https.get(image.url, (res) => {
      let chunks = [];
      res.on("data", (fragments) => chunks.push(fragments));
      res.on("error", (error) => reject(error));
      res.on("end", async () => {
        try {
          const content = Buffer.concat(chunks);
          const resized = await sharp(content)
            .resize({ width: 400 })
            .toFile(filepath);
          // console.log(resized);
          // fs.writeFileSync(filepath, content);
          resized && resolve("/" + filepath);
        } catch (ex) {
          reject(ex);
        }
      });
    });
  });
};

const getCreator = (item) => {
  let creator = item.creator || item.author || item["dc:creator"];
  if (!creator) {
    creator = (item.link.match(/^https?:\/\/(www\.)?(\w+)/) || [])[2] || "";
    const publishers = {
      cbsnews: "CBS News",
      foxnews: "Fox News",
      huffpost: "HuffPost",
      nytimes: "The New York Times",
      cnn: "CNN",
      politico: "Politico",
      washingtontimes: "The Washington Times",
    };
    creator = publishers[creator] || creator;
  }
  return creator || "";
};

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media:content", { keepArray: false }],
      ["media:description", "media:description", { keepArray: false }],
      ["media:group", "media:group", { keepArray: false }],
      ["image", "image", { keepArray: false }],
    ],
  },
});

const parseURL = async (url) => {
  try {
    let feed = await parser.parseURL(url);
    return feed.items || [];
  } catch (ex) {
    console.error("Could not parse feed:", url);
    console.error(ex);
  }
  return [];
};

const run = async () => {
  let counter = PAGES.length;
  PAGES.forEach((data) => {
    const promises = [];
    data.feeds.forEach((url) => promises.push(parseURL(url)));
    Promise.all(promises).then(async (feed) => {
      if (feed && Array.isArray(feed)) {
        feed = feed.flat();
        FEEDS[data.page] = feed;
        createPage(
          data.page,
          await buildCommonPage(feed, data.sections),
          `${data.title} - ${manifest.short_name}`,
          data.description
        );

        if (!--counter) {
          buildHomePage();
          buildStaticPages();
        }
      } else {
        console.error("Invalid RSS data:", data, feed);
      }
    });
  });
};

run();
