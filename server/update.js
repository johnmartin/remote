var window = Npm.require("jsdom").jsdom().parentWindow;
var $ = Npm.require('jquery')(window);

function UpdateJobs() {
  var rules = JSON.parse(Assets.getText('rules.json'));
  var boards = JSON.parse(Assets.getText('boards.json'));
  for (var i in boards) {
    console.log('Loading', boards[i].url);
    (function(board) {
      HTTP.get(board.url, function (error, results) {
        if (!error) {
          var doc_entries = $(results.content);
          $(board.rules.entries, doc_entries).each(function () {
            var me = this;
            var url = $(board.rules.url, me).prop('href');
            if (url) {
              if (url.substr(0, 7) == 'file://') {
                url = board.base_url+url.substr(7);
              }
              var check = Jobs.findOne({ url: url });
              if (!check) {
                HTTP.get(url, function (error, result) {
                  var doc_entry = $(result.content);
                  (function(board, me, doc_entry, url) {
                    var insert = {
                      created: new Date(),
                      site: board.site,
                      url: url,
                      title: false,
                      company: false,
                      type: false,
                      description: false,
                      where: false,
                      hidden: false,
                      visited: false
                    };
                    for (var i in rules) {
                      var rule = rules[i];
                      if (board.rules[rule]) {
                        var which_doc;
                        var position;
                        if (board.rules[rule].substr(0, 6) == '{page}') {
                          which_doc = doc_entry;
                          position = 7;
                        } else {
                          which_doc = me;
                          position = 8;
                        }
                        var selector = board.rules[rule].substr(position);
                        insert[rule] = $(selector, which_doc).text();
                      }
                    }
                    Jobs.insert(insert);
                  })(board, me, doc_entry, url);
                });
              }
            }
          });
        }
      });
    })(boards[i]);
  }
}

Meteor.startup(function () {
  UpdateJobs();
});

new Meteor.Cron({
  events: {
    "0 * * * *": UpdateJobs
  }
});
