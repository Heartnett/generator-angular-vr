'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({

  initializing: function () {
      if( this.fs.exists( this.destinationPath('app/scripts/app.js'))  || this.options.skipBaseAppInstall) {
        this.log("Angular base app found. Skipping angular install.\n");
        
        this.angularAppFound = true;
      }
      else {
        this.log("angular base app not found");
        this.angularAppFound = false;
      }
  },
  
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the epic ' + chalk.red('angular-vr (meta)') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
    },
  },

  install: function () {
    this.installDependencies();
  },

  end: function () {
    var spawn = require('child_process').spawn;
    var tty = require('tty');
    var async = require('async');

    var shell = function(cmd, opts, callback) {
      var p;
      process.stdin.pause();      
      process.stdin.setRawMode(false);

      p = spawn(cmd, opts, {        
        stdio: [0, 1, 2]
      });

      return p.on('exit', function() {        
        process.stdin.setRawMode(true);
        process.stdin.resume();
        return callback();
      });
    };

    async.series([    
      function(cb) {        
        if (!this.angularAppFound) {
          shell('yo', ['angular'], function() {
            cb(null,'a');
          });
        }
        else {
          cb(null, 'a');
        }
      }.bind(this),
      
      function(cb) {
        shell('yo', ['angular-vr-old'], function() {
          cb(null,'b');
        });
      }
    ],
    
    function(err, results){                   
      // final callback code
      return process.exit();
     }
    );
  }
});
