# Remote
A roll-your-own remote job board aggregator (specifically for freelance developers / designers).

## Dependancies
Just [Meteor][1]. That's it.

## Installation
    git clone git@github.com:johnmartin/remote.git
    cd remote
    meteor

## Why?
Because I was tired of manually visiting the job boards from [Awesome Remote Job][2]. So I wrote this, to make freelance work searching a little easier. At the moment it's only indexing three of them, but I'd love for people to extend

## How?
1. On server startup + once an hour it'll check your list of job boards (located `./private/boards.json`) for new jobs
2. Using the CSS selector rules in `./private/boards.json` it'll extract the job details from the page. Note: `{entry}` puts the context of each job item on the listing page and `{page}` makes the context the actual final job entry page.
3. Open your browser to <http://localhost:3000/>
4. Profit.

[1]: [http://meteor.com/] "Meteor"
[2]: [https://github.com/lukasz-madon/awesome-remote-job/] "Awesome Remote Job"
