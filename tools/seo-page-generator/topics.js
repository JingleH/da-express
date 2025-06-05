const str = `[[Labubu Summer Drop Craze]]
{{Labubu, the beloved collectible figure, made waves with its limited-edition summer releases. Fans are showing off their finds and styling toy-themed content. Adobe Express enables the community to create fun TikTok edits, photo collages, and animated stories to celebrate their collections.}}
||TikTok videos, Instagram stories, photo collages||

[[Summer Solstice Celebrations 2025]]
{{The summer solstice, marking the longest day of the year, has inspired festivals, spiritual gatherings, and themed parties. Adobe Express allows users to design stunning flyers, banners, and digital content to promote and commemorate solstice events with vibrant, seasonal templates.}}
||flyers, banners, posters, Instagram stories||

[[Euro 2025 Championship Buzz]]
{{With Europe buzzing over the UEFA Euro 2025 football tournament, fans are creating game-day promotions, party invites, and highlight content. Adobe Express helps users design sports-themed content with dynamic templates perfect for match-day posters and social media excitement.}}
||posters, Instagram stories, Facebook stories, YouTube thumbnails||

[[Grunge Revival: 90s Style Returns in 2025]]
{{Grunge fashion, characterized by flannel shirts, thrifted pieces, and a DIY ethos, is making a comeback in 2025. Embraced by a new generation seeking authenticity, this trend is reflected in fashion and music scenes. Adobe Express enables users to design promotional materials and social media content that embody the grunge aesthetic.}}
||posters, Instagram stories, YouTube thumbnails||

[[Pride Month 2025 Visual Campaigns]]
{{June marks Pride Month, and brands and individuals alike are celebrating LGBTQ+ identities through colorful campaigns and heartfelt messages. Adobe Express offers inclusive templates for bold posters, banners, and social content that champion equality and love.}}
||posters, banners, reels, TikTok videos, Instagram stories||

[[Festival of Colors Summer Parties]]
{{Inspired by Holi, many summer events now include color-throwing parties. Adobe Express can help hosts create vibrant flyers, posters, and reels to promote these joy-filled events with bursts of color and energy.}}
||flyers, posters, reels, Instagram posts||

[[Graduation Season 2025]]
{{Graduations are in full swing across high schools and universities. From digital invites to celebratory reels, Adobe Express helps users craft beautiful cards, banners, and social media posts to honor graduates and share the milestone with friends and family.}}
||cards, banners, Instagram stories, reels, Facebook stories||

[[Father’s Day 2025 DIY Gifts]]
{{Families embraced DIY expressions of love for Father’s Day, with handmade cards and memory photo collages leading the way. Adobe Express helped users create heartfelt digital and printable gifts to celebrate father figures everywhere.}}
||cards, photo collages, posts, Facebook stories||

[[Beachcore Aesthetic & Travel Moodboards]]
{{The beachcore aesthetic is defining summer 2025 with a nostalgic, breezy vibe. Users are creating dreamy moodboards and travel visuals using Adobe Express templates, showcasing shells, sand, pastels, and sun-soaked adventures.}}
||photo collages, Instagram stories, posts, YouTube thumbnails||

[[Taylor Swift’s Eras Tour Finale]]
{{Taylor Swift’s globally streamed tour finale sparked emotional fan reactions and fan-made content. Adobe Express makes it easy for Swifties to create tribute posters, social media countdowns, and concert memory collages.}}
||posters, reels, photo collages, Instagram stories||

[[Hot Girl Walk 2.0: Wellness Goes Social]]
{{The “Hot Girl Walk” trend has evolved into a social wellness movement, combining mental health, exercise, and aesthetic sharing. Adobe Express can help users design motivational quote cards, wellness trackers, and stylish Instagram stories to support their wellness journeys.}}
||cards, Instagram stories, posts, reels||

[[June National Donut Day 2025]]
{{Donut shops and creators celebrated this sweet holiday with giveaways, branding posts, and playful content. Adobe Express templates made it easy to design delicious-looking flyers, banners, and ads for donut-themed promotions.}}
||flyers, banners, advertisements, Instagram posts||

[[Y2K Fashion is Still Going Strong]]
{{The Y2K revival continues to dominate fashion, with metallics, mini skirts, and flip phones leading the style narrative. Adobe Express is ideal for designing nostalgic posters, TikTok lookbooks, and themed YouTube thumbnails that channel early-2000s flair.}}
||posters, TikTok videos, YouTube thumbnails, Instagram posts||

[[Summer Music Festival Posters]]
{{From Glastonbury to Lollapalooza, summer music festivals are a hotspot for visual promotion. Adobe Express offers energetic poster and banner templates that help organizers and attendees design custom event visuals and after-party recaps.}}
||posters, banners, Instagram stories, reels||

[[Juneteenth Awareness & Celebration]]
{{Juneteenth, now widely recognized and celebrated, inspired educational content and celebration announcements. Adobe Express empowers users to create visually compelling posters, banners, and social media stories that honor the holiday's significance.}}
||posters, banners, Instagram stories, reels||

[[#BookshelfWealth Home Decor Trend]]
{{Interior design lovers are curating their bookshelves as status symbols. Adobe Express helps creators style visual posts and reels showcasing their collections in elegant or cozy themes that tap into this visual trend.}}
||photo collages, posts, reels, Instagram stories||

[[Tour de France Anticipation Content]]
{{As cycling fans gear up for the 2025 Tour de France, content around training routines, athlete spotlights, and viewing parties is trending. Adobe Express supports this excitement with sporty template sets for posters and video recaps.}}
||posters, YouTube thumbnails, Instagram stories, Facebook stories||

[[Summer Romance & Rom-Com Revival]]
{{Streaming platforms have reignited love for rom-coms, sparking a trend in romantic content creation. Adobe Express makes it easy to create movie-style posters, relationship recap videos, and social content with dreamy templates.}}
||posters, reels, TikTok videos, Instagram stories||

[[Cottagecore Picnic Culture]]
{{Cottagecore remains a seasonal favorite, with users sharing floral-filled picnic spreads and vintage decor. Adobe Express offers templates for romanticized picnic invites, dreamy photo edits, and story highlights.}}
||flyers, photo collages, Instagram stories, cards||

[[Digital Detox Retreats: Reconnecting with Nature]]
{{In response to digital fatigue, people are seeking retreats that offer a break from technology. These experiences focus on mindfulness, nature immersion, and personal growth. Adobe Express can aid in creating promotional materials and reflective journals to enhance the digital detox experience.}}
||flyers, banners, Instagram stories, posts||`;
const topics = str.split('\n\n').map((topicStr) => {
  const title = /\[\[(.*?)\]\]/g.exec(topicStr)[1];
  const p = /{{(.*?)}}/g.exec(topicStr)[1];
  const tasks = /\|\|(.*?)\|\|/g.exec(topicStr)[1];
  return { title, p, tasks };
});
export default function getTopics() {
  return topics;
}
