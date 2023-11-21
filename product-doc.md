# Reader
Let's develop the first product document

## Milestone A (MVP stage, comleted)
In the first milestone we will focus on the minimal web reading experience. 

- person can register as an user and log in into their account (Aauth 0.1)
- they can add public internet url, it will be loaded and parsed by our server. We will store article content into db. (LoA 0.1)
- article can be read by the user in a clear interface (Reader v 0.1)
- list of articles can be viewed, as they are being added. (feed 0.1)

## Milestone B (MVP Stage; in progress)
In the second milestone we will focus on essential management of content

- content items can be tagged (Tags 0.1)
- feed can be ordered by time added, filtered by tags or domain, and title search (feed 0.2)
- full text serch (feed 0.3)
- default feed order can be changed by drag and drop (feed 0.4)

## Milestone C (MVP Stage; tbd)
In the third milestone we will focus on browser extension

- authentication system supports token based authentication (Auth 0.2)
- single tab can be saved by a special shortcut, or clicking extension icon (LoA 0.2)
- all the open tabs can be saved and stored under a tag (TabManager 0.1)

## Milestone D (MVP Stage; tbd)
In the fourth milestone we will focus on mobile experience

- PWA with offline support (all the saved articles can be read without internet connection)
- Share to save
- optional: email to special address to save (likely another stage when adding full support for newsletters)

## Milestone E (MVP stage; tbd)
In the fifth milestone, we will focus on highlighting, annotations and notes.

- text can be highlighted and annotated (Reader 0.2)
- notes can be taken per article
- special view shows all the highlights, annotations and notes
- everything can be exported (probably as json+markdown)

## Milestone F (MVP stage; tbd)
In the sixth milestone, we will focus on reading experience

- font can be adjusted (colour, type, size, letter spacing, row spacing)
- themes (at least dark and bright, likely we will want to allow user made themes)
- reading progress is tracked (reading length estimate, return where you left, progress indicator)

At this point we can conclude MVP stage, and start working with real users.
We should get a production domain at this point (with official product name)

## Milestone G (Alpha stage; tbd)
In the seventh milestone, we will focus on public bookmarks and presentation

- tag can become public, and be listed in the feed of public tags
- other users can like the public tag and read it's pages
- tags are unique to users (multiple users can have tag "music")
- bookmarks are unique to users as well (simplifies the design, duplication of data in db should not be a problem.)
- leaderboard of the most popular public tags (reward the users)

Expect 10 users at this stage

## Beta Stage

Expect 100 weekly active users

## Official stage

Expect 1k weekly active users