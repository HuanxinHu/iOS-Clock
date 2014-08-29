import Ember from 'ember';

var stopwatchController = Ember.ObjectController.extend({
	  title:'Stopwatch',
    isRunning:       false,
    startTime:       null,
    lapTime:         null,
    ellapsedTime:    0,
    ellapsedLapTime: 0,
    timeInterval:    10,
    leftButtonClass:'button-start',
    rightButtonClass:'button-lap disabled',
    leftButtonText:'Start',
    rightButtonText:'Lap',
    lapList:[],
    countLapTime:'00:00.00',
    countTotalTime:'00:00.00',
    actions: {
    	btstop: function(){
    		this.handleLeftButton();

    	},

    	btlap: function(){
    		this.handleRightButton();
    	}

    },

    handleLeftButton: function() {
      if(this.get('isRunning')) {
        this.stop();
      } else {
        this.start();
      }
    },
    
    handleRightButton: function() {
      if(this.get('isRunning')) {
        this.lap();
      } else {
        this.reset();
      }
    },
    
    start: function() {
      var self = this;
      this.set('leftButtonClass','button-stop').set('leftButtonText','Stop');
      this.set('rightButtonClass','button-lap').set('rightButtonText','Lap');
      self.startTime = new Date().getTime();
      self.lapTime   = new Date().getTime();
      
      self.startTime -= self.ellapsedTime;
      self.lapTime   -= self.ellapsedLapTime;
      
      this.set('isRunning',true);
      Em.run.later(function() {
        self.handleTimer();
      }, this.get('timeInterval'));
    },
    
    stop: function() {
      this.set('isRunning',false);
      this.set('leftButtonClass','button-start').set('leftButtonText','Start');
      this.set('rightButtonClass','button-reset disabled').set('rightButtonText','Reset');
    },
    
    lap: function() {
      var lapTime = this.lapTime;
      var listItem = {
        count: ($('.stopwatch-content ul').children().length+1)/3,
        lapitem: this.formatTimeFromMilliseconds(new Date().getTime()-lapTime),
      }
      this.lapList.pushObject(listItem);
        
      this.lapTime = new Date().getTime();
    },
    
    reset: function() {
      this.set('ellapsedTime',0);
      this.set('ellapsedLapTime',0);
      this.set('countTotalTime',this.formatTimeFromMilliseconds(0));
      this.set('countLapTime',this.formatTimeFromMilliseconds(0));
      this.set('lapList',[]);
      this.set('rightButtonClass','disabled').set('rightButtonText','Lap');
    },
    
    handleTimer: function() {
      var now       = new Date().getTime(),
          startTime = this.startTime,
          lapTime   = this.lapTime,
          self      = this;
          
        
      this.set('countTotalTime',this.formatTimeFromMilliseconds(now-startTime));
      this.set('countLapTime',this.formatTimeFromMilliseconds(now-lapTime));
      self.ellapsedTime    = now-startTime;
      self.ellapsedLapTime = now-lapTime;
      
      if(self.isRunning) {
        Ember.run.later(function() {
          self.handleTimer();
        }, this.get('timeInterval'));
      }
    },
    
    formatTimeFromMilliseconds: function(milliseconds) {
      var minutes = parseInt((milliseconds / 60 / 1000),10),
          seconds = parseInt(milliseconds / 1000, 10) - minutes*60,
          tenths  = parseInt((milliseconds - seconds*1000 - minutes*60000)/10, 10);

      return Utils.addZeroes(minutes)  + ":" + Utils.addZeroes(seconds) + "." + Utils.addZeroes(tenths); 
    },
    
    init: function() {
      var self = this;
      $(" .left-button").click(function() {
        self.handleLeftButton();
      });
      $(" .right-button").click(function() {
        self.handleRightButton()
      });
    }
 
});

var Utils = {
  addZeroes: function(value) {
    if(value < 10) {
      return '0'+value;
    }
    return value;
  }
};

export default stopwatchController;