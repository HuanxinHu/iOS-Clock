import Ember from 'ember';

var worldclockController = Ember.ArrayController.extend({
	  title: 'World Clock',
    timerInterval: 1000/6,
    citydata:[],
    jsondata:[],
    editState:false,
    timeDisapper:false,
    shiftRight:false,
    isDigi:true,
    isAna:false,
    editDone:'Edit',
    actions: {

      deletecity:function(city){
        console.log(city.id);
        this.store.find('city',city.id).then(function(post){
          post.destroyRecord();
        });
        this.initcity();
      },
    
      digAnaShow:function(){
        var isDigi = this.get('isDigi');
        if(isDigi){
          this.set('isAna',true);
          this.set('isDigi',false);
        }else{
          this.set('isAna',false);
          this.set('isDigi',true);
        }
      },
    
      toggle:function(){
        if(this.get('editDone')==='Edit'){
          this.set('editState',true);
          this.set('timeDisapper',true);
          this.set('shiftRight',true);
          this.set('editDone','Done');
        }else{
          this.set('editState',false);
          this.set('timeDisapper',false);
          this.set('shiftRight',false);
          this.set('editDone','Edit');
        }
      }
    },
    changeFreq:function(){
      if(this.get('editState')){
        this.set('timerInterval',2000);
      }else{
        this.set('timerInterval',1000/6);
      }
    }.observes('editState'),

    updateTime: function() {
      var data = this.get('jsondata');
      this.myResponseHandler(data);
      var self = this;
      setTimeout(function() {
        self.initcity();
      }, this.get('timerInterval'));
      
    },

    timeInfoForItemAtIndex: function(index) {
      var dataAtIndex = index,
          myTime      = new Date(),
          utcTime     = new Date(new Date().setMinutes(new Date().getMinutes()+myTime.getTimezoneOffset())),
          cityTime    = new Date(new Date(utcTime.getTime()).setMinutes(new Date().getMinutes()+dataAtIndex.timezoneOffset)); 

      var isToday     = cityTime.getDate() == myTime.getDate(),
          isTomorrow  = cityTime.getDate() > myTime.getDate(),
          isYesterday = cityTime.getDate() < myTime.getDate();
      
      var hourTimeDiff = Math.floor((cityTime.getTime() - myTime.getTime()) / (1000 * 60 * 60));

      var diffString = '';
      if(hourTimeDiff <  0) {
        diffString = ", " + (-1*hourTimeDiff) + ' hours behind';
      } if(hourTimeDiff >  0) {
        diffString = ", " + (hourTimeDiff) + ' hours ahead';
      }
      
      var localTime = '',
          localAnaTime = '',
          hours     = cityTime.getHours(),
          minutes   = cityTime.getMinutes(),
          seconds    = cityTime.getSeconds(),
          millisec   = cityTime.getMilliseconds();
  
      if (hours > 11) {
        localTime = (hours - 12) + ':' + Utils.addZeroes(minutes) + ' PM';
        localAnaTime = (hours - 12) + ':' + minutes + ':' + seconds + ':' + millisec + ' PM';
      } else {
        localTime = hours + ':' + Utils.addZeroes(minutes) + ' AM';
        localAnaTime = hours + ':' + minutes + ':' + seconds + ':' + millisec + ' AM';
      }
      
     return {
        cityName: dataAtIndex.cityName,
        day: isToday ? "Today" : isTomorrow ? "Yesterday" : "Tomorrow",
        hours: diffString,
        localTime: localTime,
        localAnaTime: localAnaTime
      };
      
    },

    myResponseHandler:function(result){
      for(var i=0;i<result.length;i++){
      		var info = this.timeInfoForItemAtIndex(result[i]);
          result[i].day = info.day;
      		result[i].hours = info.hours;
      		result[i].localTime = info.localTime;
          result[i].localAnaTime = info.localAnaTime;
      	}
      	this.set('citydata',result);
    },

    initcity: function() {
      var self = this;
      this.store.find('city').then(function(citys){
        var data =[];
        citys.map(function(city){
          data.push({
                    id:city.get('id'),
                    cityName:city.get('cityName'),
                    timezoneName:city.get('timezoneName'),
                    timezoneOffset:city.get('timezoneOffset')
                });
        });
        self.myResponseHandler(data);
        self.set('jsondata',data);
        self.updateTime();
      });   
    },

    init:function(){
      this.initcity();
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
export default worldclockController;