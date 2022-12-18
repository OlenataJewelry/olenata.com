const FEEDS = {
  us: [
    // title, link, pubDate, content(short), contentSnippet(short), guid, isoDate
    // media:group[media:content(medium="image", type="image/jpeg", url)]
    // "http://rss.cnn.com/rss/cnn_topstories.rss",
    "http://rss.cnn.com/rss/cnn_us.rss",
    // "https://archive.nytimes.com/www.nytimes.com/services/xml/rss/index.html?mcubz=0",
    // title, link, pubDate, content(short), contentSnippet(short), guid, isoDate,
    // categories, creator, media:content(medium="image", url)
    "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
    // FOX News RSS Feeds / RSS Terms of Use
    // "https://www.foxnews.com/about/rss/",
    // title, pubDate, content(short), contentSnippet(short), guid, isoDate,
    // 'content:encoded'(long/html) 'content:encodedSnippet'(long/html), categories
    // 'media:content'(type: 'image/png', url)
    "https://moxie.foxnews.com/google-publisher/us.xml",
    // title, link, pubDate, content(short), guid, isoDate, image
    "https://www.cbsnews.com/latest/rss/us",
  ],

  world: [
    "http://rss.cnn.com/rss/cnn_world.rss",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://moxie.foxnews.com/google-publisher/world.xml",
    "https://www.cbsnews.com/latest/rss/world",
    "https://www.washingtontimes.com/rss/headlines/news/world/",
  ],

  tech: [
    "http://rss.cnn.com/rss/cnn_tech.rss",
    "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    "https://www.cbsnews.com/latest/rss/technology",
    "https://www.washingtontimes.com/rss/headlines/culture/technology/",
    "https://moxie.foxnews.com/google-publisher/tech.xml",
    "https://nypost.com/tech/feed/",
    "https://www.mercurynews.com/business/technology/feed/",
  ],

  sports: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml",
    "https://www.cbsnews.com/latest/rss/sports",
    "https://www.washingtontimes.com/rss/headlines/sports/",
    "https://moxie.foxnews.com/google-publisher/sports.xml",
    "https://nypost.com/sports/feed/",
    "https://www.chicagotribune.com/arcio/rss/category/sports/",
    "https://www.mercurynews.com/sports/feed/",
  ],

  politics: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
    "https://www.cbsnews.com/latest/rss/politics",
    "https://www.washingtontimes.com/rss/headlines/news/politics/",
    "https://moxie.foxnews.com/google-publisher/politics.xml",
    // title, link, pubDate, content(long/html), contentSnippet(short), guid, isoDate,
    // 'content:encoded'(long/html) 'content:encodedSnippet'(short/html)
    // 'media:content'(type: 'image/png', url), media:thumbnail
    // creator, dc:creator
    "https://www.politico.com/rss/politicopicks.xml",
  ],

  science: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml",
    "https://www.cbsnews.com/latest/rss/science",
  ],

  health: [
    "http://rss.cnn.com/rss/cnn_health.rss",
    "https://rss.nytimes.com/services/xml/rss/nyt/Well.xml",
    "https://www.cbsnews.com/latest/rss/health",
    "https://moxie.foxnews.com/google-publisher/health.xml",
    "https://www.washingtontimes.com/culture/health/",
    "https://nypost.com/health/feed/",
  ],

  fashion: [
    "https://rss.nytimes.com/services/xml/rss/nyt/FashionandStyle.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/tmagazine.xml",
    "https://nypost.com/fashion-and-beauty/feed/",
  ],

  arts: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/ArtandDesign.xml",
  ],

  entertainment: [
    "https://www.cbsnews.com/latest/rss/entertainment",
    "https://www.washingtontimes.com/rss/headlines/culture/entertainment",
    "https://nypost.com/entertainment/feed/",
    "https://www.chicagotribune.com/arcio/rss/category/entertainment/",
    "https://www.mercurynews.com/things-to-do/entertainment/feed/",
  ],

  "real-estate": [
    "https://rss.nytimes.com/services/xml/rss/nyt/RealEstate.xml",
    "https://nypost.com/real-estate/feed/",
    "https://www.mercurynews.com/business/real-estate/feed/",
  ],

  travel: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml",
    "https://moxie.foxnews.com/google-publisher/travel.xml",
    "https://www.washingtontimes.com/rss/headlines/culture/travel/",
    "http://rss.cnn.com/rss/cnn_travel.rss",
    "https://nypost.com/travel/feed/",
    "https://www.mercurynews.com/things-to-do/travel/feed/",
  ],

  rest: [
    "https://moxie.foxnews.com/google-publisher/latest.xml",
    // title, link, pubDate, content(short), contentSnippet(short), guid, isoDate,
    // enclosure(type: 'image/jpeg', url), comments
    "https://www.huffpost.com/section/front-page/feed?x=1",
    // title, link, pubDate, content(long/html), contentSnippet(short), guid, isoDate,
    // 'content:encoded'(long/html) 'content:encodedSnippet'(short/html)
    // enclosure(type: 'image/jpeg', url), creator, author, dc:creator
    // "https://rssfeeds.usatoday.com/usatodaycomnation-topstories&x=1",
  ],
};
