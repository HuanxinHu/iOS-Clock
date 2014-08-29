import Ember from 'ember';

var CanvasClockComponent = Ember.Component.extend({
  tagName: 'canvas',
  width: 70,
  height: 70,
  attributeBindings: ['width','height'],
  
  didInsertElement: function() {
    var width = this.get('width'),
	space = width/9,
	r = width/2;
	
	this.set('font', width/8); 
	this.set('lineThick', width/36);
	this.set('x', width/5);
	this.set('Hx', width/11);
	this.set('r', r);
	this.set('Hr', r - space);
	this.set('ctx', this.get('element').getContext('2d'));
    this.draw();
  },
  
  draw: function() {
    this.ctxempty();
    var context = this.get('ctx'),
	timetext = this.get('data'),
	timepart = timetext.split(" ")[0];
	this.set('ampm', timetext.split(" ")[1]);
	this.set('hour', timepart.split(":")[0]);
	this.set('minute', timepart.split(":")[1]);
	this.set('seconds', timepart.split(":")[2]);
	this.set('millisec', timepart.split(":")[3]);
 	context.font = this.get('font')+'px Arial'; 
	this.createcircle();
	this.createhands();
	this.createcenter();
	this.createnos();
	
  }.observes('width', 'height', 'data'),
  
  ctxempty: function() {
    var context = this.get('ctx');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, this.get('width'), this.get('height'));
  },

  createcircle: function() { 
  	var context = this.get('ctx'),
	hour = this.get('hour'),
	ampm = this.get('ampm');
  	context.beginPath(); 
	context.arc(this.get('width')/2, this.get('height')/2, this.get('r'), 0, Math.PI*2, true); 
    context.fillStyle = '#efefef';
	if (((hour >= 6 && hour!=='12') && ampm === 'PM')|| ((hour<6 || hour==='12') && ampm === 'AM')){
			context.fillStyle = 'black';
	}
    context.fill();
  },
  
  createnos: function() { 
	var nos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 
	ampm = this.get('ampm'),
	hour = this.get('hour'),
	angle = 0, 
	nowidth = 0,
	width = this.get('width'),
	height = this.get('height'),
	font = this.get('font'),
	Hr = this.get('Hr'),
	context = this.get('ctx');
	context.fillStyle = 'black';
	if (((hour >= 6 && hour!=='12') && ampm === 'PM')|| ((hour<6 || hour==='12') && ampm === 'AM')){
			context.fillStyle = 'white';
	}
	nos.forEach(function (numeral) { 
		angle = Math.PI/6 * (numeral-3); 
		nowidth = context.measureText(numeral).width; 
		context.fillText(numeral,width/2 + Math.cos(angle)*Hr - nowidth/2, 
		    height/2 + Math.sin(angle)*Hr + font/3); 
	}); 
  }, 
  
  createcenter: function() { 
	var context = this.get('ctx'),
	ampm = this.get('ampm'),
	hour = this.get('hour'),
	width = this.get('width'),
	height = this.get('height');
	context.beginPath(); 
	context.arc(width/2, height/2, this.get('lineThick'), 0, Math.PI*2, true); 
	context.fillStyle = 'black';
	if (((hour >= 6 && hour!=='12') && ampm === 'PM')|| ((hour<6 || hour==='12') && ampm === 'AM')){
		context.fillStyle = 'white';
	}
	context.fill(); 
  },
  
  createhand: function (loc, handType) { 
    var context = this.get('ctx'),
	ampm = this.get('ampm'),
	hour = this.get('hour'),
    width = this.get('width'),
    height = this.get('height'),
    millisec = this.get('millisec'),
    lineThick = this.get('lineThick'),
	angle = (Math.PI*2)*(loc/60) - Math.PI/2, 
	handRadius = handType === 'hour'?this.get('r')-this.get('x')-this.get('Hx'):this.get('r')-this.get('x');
    	
	context.beginPath();
	if (handType === 'second'){
	    handRadius = handRadius - lineThick;
	    angle = angle + (Math.PI*2/60)*(millisec/1000);
        context.lineWidth = lineThick/2;
		context.strokeStyle = 'red';
	}
	else{
		context.lineWidth = lineThick;
		context.strokeStyle = 'black';
		if (((hour >= 6 && hour!=='12') && ampm === 'PM')|| ((hour<6 || hour==='12') && ampm === 'AM')){
			context.strokeStyle = 'white';
		}
	}
	context.moveTo(width/2, height/2); 
	context.lineTo(width/2 + Math.cos(angle)*handRadius, height/2 + Math.sin(angle)*handRadius); 
	context.stroke(); 
  },
  
  createhands: function() { 
  	this.createhand(this.get('hour')*5 + (this.get('minute')/60)*5, 'hour',0.5);
    this.createhand(this.get('minute'), 'minute',0.5); 
	this.createhand(this.get('seconds'), 'second',0.2);
  }
});

export default CanvasClockComponent;