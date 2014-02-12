CronJob = require('cron').CronJob

jobs = []

# Export Plugin
module.exports = (BasePlugin) ->
  # Define Plugin
  class CrontabPlugin extends BasePlugin
    # Plugin name
    name: 'crontab'

    stopAllJobs: (removeJobs = false) ->
      @docpad.log 'debug', "stop #{jobs.length} jobs." if jobs?.length > 0
      for {job,jobName} in jobs
        try
          job?.stop()
        catch err
          @docpad.log 'warn', "err stoping job #{jobName}: #{err}."
      jobs = [] if(removeJobs)
      @

    startAllJobs: ->
      @docpad.log 'debug', "start #{jobs.length} jobs." if jobs?.length > 0
      for {job,jobName} in jobs
        try
          job?.start()
        catch err
          @docpad.log 'warn', "err starting job #{jobName}: #{err}."
      @

    docpadReady: ->
      @stopAllJobs(true)
      config = @getConfig()
      for jobName of config
        try
          cronOpts = config[jobName]
          cronOpts.context ?= {@docpad, job: () -> @}
          cronOpts.start = false
          job = new CronJob(cronOpts)
          jobs.push({job,jobName})
        catch err
          @docpad.log 'warn', "invalid cronjob #{jobName} format : #{err}. Check the configuration"
      @

    renderBefore: -> @stopAllJobs()

    renderAfter: -> @startAllJobs()

    serverBefore: -> @startAllJobs()

    docpadDestroy: -> @stopAllJobs(true)

