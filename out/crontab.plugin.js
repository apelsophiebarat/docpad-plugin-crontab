// Generated by CoffeeScript 1.6.3
(function() {
  var CronJob, jobs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CronJob = require('cron').CronJob;

  jobs = [];

  module.exports = function(BasePlugin) {
    var CrontabPlugin, _ref;
    return CrontabPlugin = (function(_super) {
      __extends(CrontabPlugin, _super);

      function CrontabPlugin() {
        _ref = CrontabPlugin.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      CrontabPlugin.prototype.name = 'crontab';

      CrontabPlugin.prototype.stopAllJobs = function(removeJobs) {
        var err, job, jobName, _i, _len, _ref1;
        if (removeJobs == null) {
          removeJobs = false;
        }
        if ((jobs != null ? jobs.length : void 0) > 0) {
          this.docpad.log('debug', "stop " + jobs.length + " jobs.");
        }
        for (_i = 0, _len = jobs.length; _i < _len; _i++) {
          _ref1 = jobs[_i], job = _ref1.job, jobName = _ref1.jobName;
          try {
            if (job != null) {
              job.stop();
            }
          } catch (_error) {
            err = _error;
            this.docpad.log('warn', "err stoping job " + jobName + ": " + err + ".");
          }
        }
        if (removeJobs) {
          jobs = [];
        }
        return this;
      };

      CrontabPlugin.prototype.startAllJobs = function() {
        var err, job, jobName, _i, _len, _ref1;
        if ((jobs != null ? jobs.length : void 0) > 0) {
          this.docpad.log('debug', "start " + jobs.length + " jobs.");
        }
        for (_i = 0, _len = jobs.length; _i < _len; _i++) {
          _ref1 = jobs[_i], job = _ref1.job, jobName = _ref1.jobName;
          try {
            if (job != null) {
              job.start();
            }
          } catch (_error) {
            err = _error;
            this.docpad.log('warn', "err starting job " + jobName + ": " + err + ".");
          }
        }
        return this;
      };

      CrontabPlugin.prototype.docpadReady = function() {
        var config, cronOpts, err, job, jobName;
        this.stopAllJobs(true);
        config = this.getConfig();
        for (jobName in config) {
          try {
            cronOpts = config[jobName];
            if (cronOpts.context == null) {
              cronOpts.context = {
                docpad: this.docpad,
                job: function() {
                  return this;
                }
              };
            }
            cronOpts.start = false;
            job = new CronJob(cronOpts);
            jobs.push({
              job: job,
              jobName: jobName
            });
          } catch (_error) {
            err = _error;
            this.docpad.log('warn', "invalid cronjob " + jobName + " format : " + err + ". Check the configuration");
          }
        }
        return this;
      };

      CrontabPlugin.prototype.renderBefore = function() {
        return this.stopAllJobs();
      };

      CrontabPlugin.prototype.renderAfter = function() {
        return this.startAllJobs();
      };

      CrontabPlugin.prototype.serverBefore = function() {
        return this.startAllJobs();
      };

      CrontabPlugin.prototype.docpadDestroy = function() {
        return this.stopAllJobs(true);
      };

      return CrontabPlugin;

    })(BasePlugin);
  };

}).call(this);