import Ember from 'ember';

var timerController = Ember.ObjectController.extend({
	title: 'Timer',
	isRunning: false,
	timeLeft: 0,
	timeInterval: 1000,
	snoozeDuration: 10 * 1000 * 60,
	leftbutton:'Start',
  leftButtonClass:'button-start',
	rightbutton:'Pause',
  rightButtonClass:'button-pause  disabled',
  inputShow:'display:;',
  counterShow:'display: none;',
  timerTotalTime:'00:00.0',
	actions:{
		btstart: function() {
			if(this.get('leftbutton')=='Start'){
				this.start();
			}else{
				this.cancel();
			}
		},
		btpause: function() {
			if(this.get('rightbutton')=='Pause'){
				this.pause();
			}else{
				this.resume();
			}
		},
	},

    start: function() {
      var timerDurationInMilliseconds = ($(".inputs .hours").val() * 3600000) +  ($(".inputs .minutes").val() * 60000);
      if(timerDurationInMilliseconds != 0) {
        this.set('leftButtonClass','button-cancel');
        this.set('leftbutton','Cancel');
        this.set('rightbutton','Pause');
        this.set('rightButtonClass','button-pause')
        this.set('timeLeft',timerDurationInMilliseconds);
        this.set('counterShow','display:;');
        this.set('inputShow','display: none;');
        
        this.set('isRunning',true);
        this.handleTimer(); 
      }
    },

    cancel: function() {
      $('.counter').hide();
      this.set('counterShow','display:none;');
      $('.inputs').show();
      this.set('inputShow','display:;');
      
      this.set('leftbutton','Start');
      this.set('leftButtonClass','button-start');
      this.set('rightbutton','Pause');
      this.set('rightButtonClass','disabled');

      this.set('isRunning',false);
      this.set('timeLeft',0);
    },

	pause: function() {
      this.set('rightbutton','Resume');
      this.set('isRunning',false);
    },

    resume: function() {
      if(!$(".right-button").hasClass('disabled')) {
        this.set('rightbutton','Pause');
        this.set('isRunning',true);
        this.handleTimer();
      }
    },

	handleTimer: function() {
      
      if(this.get('isRunning')) {
        var timeLeft    = this.get('timeLeft'),
            newTimeLeft = timeLeft-this.get('timeInterval'),
            self        = this;

        this.set('timeLeft',newTimeLeft);
        if(newTimeLeft <= 0) {
          this.alarm();
          return;
        }

        this.set('timerTotalTime',this.formatTimeFromMilliseconds(newTimeLeft));
        setTimeout(function() {
          self.handleTimer();
        }, this.get('timeInterval'));
      }
    },

    formatTimeFromMilliseconds: function(milliseconds) {
      var hours   = parseInt(milliseconds / 3600000, 10),
          minutes = parseInt(milliseconds / 60000, 10) - hours*60,
          seconds = parseInt(milliseconds / 1000, 10) - minutes*60 - hours*3600,
          ret     = '';
      
      if(hours != 0) {
        ret += hours + ':';
      }
      
      ret += Utils.addZeroes(minutes) + ':' + Utils.addZeroes(seconds);

      return ret;
    },	
});

var Utils = {
  addZeroes: function(value) {
    if(value < 10) {
      return '0'+value;
    }
    return value;
  }
};

export default timerController;
