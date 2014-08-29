import Ember from 'ember';

var AddcityController = Ember.ArrayController.extend({
	inputVal:null,
	citydata:{
		cityNameAlpha:null,
		citys:[],
	},
	pleasetype:true,
	keeptype:false,
	noResult:false,
	citydataTest:[],
	actions: {
    	addcity: function(city){
    		var post = this.store.push('city',city);
    		post.save();
    		this.controllerFor('worldclock').initcity();
    		this.transitionTo('worldclock');
    	},
    	cancel: function(){
    		this.set('inputVal','');
    	}
    },
	searchInput:function(){
		var input = this.get('inputVal'),
		    inputlength = input.length;
		if(inputlength===0){
			this.set('pleasetype',true);
			this.set('keeptype',false);
			this.set('noResult',false);
		}else if(inputlength >0 && inputlength<3){
			this.set('pleasetype',false);
			this.set('keeptype',true);
			this.set('noResult',false);
		}else{
			this.set('pleasetype',false);
			this.set('keeptype',false);
			this.set('noResult',true);			
		}

		if(inputlength>2){
			this.set('citydata.cityNameAlpha',input.charAt(0).toUpperCase());
    		this.findList(input);
		}else{
			this.set('citydata.cityNameAlpha',null);
			this.findList('');
		}
	}.observes('inputVal'),
	
	dataHandeler:function(json){
		var citydata = [];
		for(var i=0;i<json.length;i++){
		  var firstLetter = json[i].cityName.charAt(0).toUpperCase();
		  var pos = citydata.map(function(e){
		    return e.firstLetter;
		  }).indexOf(firstLetter);
		  if(pos===-1){
		    citydata.push({
		      firstLetter:firstLetter,
		      citys:[json[i]]
		    });
		  }else{
		    citydata[pos].citys.push(json[i]);
		  }
		};
		this.set('citydataTest',citydata);
	},
	
    findList: function(param) {
      var self = this;
      $.ajax({
		    type:"GET",
		    async:false,
		    url:"http://coen268.peterbergstrom.com/timezones.php?search="+param,
		    dataType:"jsonp",
		    jsonp:"callback",
		    success:function(json){
				self.set('citydata.citys',json);
				self.dataHandeler(json);
		    }
	    });
    },
});

export default AddcityController;