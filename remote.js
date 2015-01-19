Jobs = new Mongo.Collection("jobs");

Router.route('/click/:_id', function() {
  var id = this.params._id;
  var job = Jobs.findOne(id);
  if (job) {
    Jobs.update(id, { $set: { visited: true }});
    this.response.writeHead(301, { Location: job.url });
    this.response.end();
  }
}, { where: 'server' });

Router.route('/what/:q', function() {
  var q = this.params.q;
  this.render('Jobs', {
    data: {
      "jobs": function() {
        var search_or = [
          { title: new RegExp(q) },
          { description: new RegExp(q) },
          { company: new RegExp(q) }
        ];
        return Jobs.find({ $or: search_or });
      },
      "query": this.params.q
    }
  });
});

Router.route('/', function() {
  this.render('Home');
});

if (Meteor.isClient) {
  Template.registerHelper('formatDate', function(date) {
    return moment(date).format('DD-MM-YYYY');
  });
  Template.Job.events({
    "click .remove": function () {
      Jobs.update(this._id, {$set: {hidden: true}});
      return false;
    }
  });
  Template.Job.helpers({
    isVisited: function (visited) {
      if (visited === true) {
        return "visited";
      } else {
        return "";
      }
    }
  });
}

if (Meteor.isServer) {
}
