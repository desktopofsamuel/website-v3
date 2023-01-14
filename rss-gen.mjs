// import { writeFileSync } from 'fs'
// import RSS from 'rss'
// import { allDocuments } from "./.contentlayer/generated"
// import CONFIG from "./config.js"

// const feed = new RSS({
//   title: CONFIG.TITLE,
//   description: CONFIG.DESCRIPTION,
//   feed_url: CONFIG.URL + `/rss.xml`,
//   site_url: CONFIG.URL,
//   managingEditor: CONFIG.AUTHOR_NAME,
//   webMaster: CONFIG.AUTHOR_NAME,
//   copyright: CONFIG.COPYRIGHT,
//   language: CONFIG.LOCALE,
//   pubDate: new Date().toLocaleString(),
//   ttl: "60",
// });

// allDocuments.allPosts
//   .map((post) => ({
//     title: post.title,
//     description: post.body.raw,
//     url: CONFIG.URL + `/${post.slug}`,
//     date: blog.date,
//   }))
//   .forEach((item) => {
//     feed.item(item);
//   });

// writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
