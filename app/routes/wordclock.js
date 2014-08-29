import Ember from 'ember';

var WorldclockRoute = Ember.Route.extend({
/*	
	modeldata:'null',

	model:function(){
		return this.store.find('city');
		var self = this;
		return this.store.find('city').then(function(citys){
			var data =[];
			citys.map(function(city){
			  data.push({
			            id:city.get('id'),
			            cityName:city.get('cityName'),
			            timezoneName:city.get('timezoneName'),
			            timezoneOffset:city.get('timezoneOffset')
			        });
			});
			self.set('modeldata',data);
			return data;
		});
		
		//alert(this.get('modeldata'));
		//return this.get('modeldata');
	},
	setupController:function(controller,model){
		controller.set('model',model);
	}
*/
});
export default WorldclockRoute;