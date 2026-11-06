-- One For The Girls — STEP 3: starter content (run after 02-security.sql)
-- Same sample content as content/en.json, so the site looks unchanged after connecting.
-- Jessica replaces/deletes these in /admin. Safe to skip if you want to start empty.

insert into public.events (title, category, status, date_text, time_text, location, summary, booking_url, sort) values
  ('Morning Reset: Yoga & Brunch', 'wellness', 'upcoming', 'Date TBC', 'Time TBC', 'Bangkok', 'A gentle flow followed by a slow brunch together. All levels welcome.', '', 0),
  ('Vision Board Workshop', 'creative', 'upcoming', 'Date TBC', 'Time TBC', 'Bangkok', 'Map out the year you want with magazines, scissors and good company.', '', 1),
  ('Padel for Beginners', 'sports', 'upcoming', 'Date TBC', 'Time TBC', 'Bangkok', 'Pick up a racket, learn the basics and play a few friendly games.', '', 2),
  ('Girls'' Dinner Club', 'social', 'upcoming', 'Date TBC', 'Time TBC', 'Bangkok', 'One long table, great food and a room full of new friends.', '', 3);

insert into public.events (title, category, status, date_text, recap, video_url, sort) values
  ('Picnic in the Park', 'social', 'past', '', 'Short recap of the event goes here.', '', 0),
  ('Padel Tennis', 'sports', 'past', '', 'Short recap of the event goes here.', '', 1),
  ('Dream Board Workshop', 'creative', 'past', '', 'Short recap of the event goes here.', '', 2),
  ('Sunrise Yoga', 'wellness', 'past', '', 'Short recap of the event goes here.', '', 3);

insert into public.albums (title, type, category, date_text, sort) values
  ('Picnic in the Park', 'highlights', 'social', '', 0),
  ('Setting up the Dream Board Workshop', 'bts', 'creative', '', 1),
  ('Padel Tennis Reel', 'videos', 'sports', '', 2),
  ('Girls'' Dinner Club', 'community', 'social', '', 3),
  ('Sunrise Yoga', 'albums', 'wellness', '', 4),
  ('Workshop Highlights', 'highlights', 'creative', '', 5);

insert into public.articles (slug, title, topic, date_text, excerpt, body, published) values
  ('article-one', 'Article title goes here', 'life', '', 'A short summary of the article to invite people to read more.', 'First paragraph of the article.', false),
  ('article-two', 'Article title goes here', 'career', '', 'A short summary of the article to invite people to read more.', 'First paragraph of the article.', false),
  ('article-three', 'Article title goes here', 'stories', '', 'A short summary of the article to invite people to read more.', 'First paragraph of the article.', false);

insert into public.partners (name, sort) values
  ('Partner name', 0),
  ('Partner name', 1),
  ('Partner name', 2),
  ('Partner name', 3),
  ('Partner name', 4),
  ('Partner name', 5);

insert into public.testimonials (quote, name, role, sort) values
  ('Partner testimonial goes here. A short quote about working with One For The Girls.', 'Name', 'Role, Brand', 0),
  ('Partner testimonial goes here. A short quote about working with One For The Girls.', 'Name', 'Role, Brand', 1);

insert into public.stats ("group", value, label, note, sort) values
  ('headline', '3k+', 'Instagram followers', '96% women', 0),
  ('headline', '130k', 'Monthly reach', 'Views per month', 1),
  ('headline', '15%', 'Engagement rate', '', 2),
  ('headline', '280+', 'Newsletter subscribers', '', 3),
  ('audience', '60%', 'live in Bangkok long term', '', 0),
  ('audience', '17%', 'are Thai locals', '', 1),
  ('audience', '21%', 'are on a short-term stay or split their time between cities', '', 2),
  ('audience', '2%', 'are just visiting', '', 3);

insert into public.updates (tag, title, text, date_text, sort) values
  ('Announcement', 'Our new home online', 'Everything One For The Girls in one place: events, stories and ways to get involved.', '', 0),
  ('Events', 'New events every month', 'From wellness mornings to dinner clubs, check What''s On for the latest dates.', '', 1),
  ('Partners', 'Brands, let''s work together', 'We''re welcoming partners who share our values. See Our Circle to find out how.', '', 2);

insert into public.faqs (question, answer, sort) values
  ('Who can join One For The Girls?', 'Every woman is welcome. Our community brings together Thai and international women in Bangkok.', 0),
  ('How do I book an event?', 'Each event has its own booking link on our What''s On page. Spaces can be limited, so book early.', 1),
  ('Can I come on my own?', 'Absolutely. Plenty of girls come solo and leave with new friends.', 2),
  ('I''m a brand. How can we work together?', 'Take a look at Our Circle for the options, then send us a partnership enquiry.', 3);

insert into public.settings (key, value) values
  ('stats_note', 'Figures as of November 2026.')
on conflict (key) do nothing;
