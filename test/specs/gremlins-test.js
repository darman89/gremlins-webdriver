
function loadScript(callback) {	
	var s = document.createElement('script');  
  s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
  if (s.addEventListener) {
    s.addEventListener('load', callback, false);
  } else if (s.readyState) {
    s.onreadystatechange = callback;
  }
  document.body.appendChild(s);
  
  
  
}
function loadScript2(callback) {	
	var s = document.createElement('script');

	s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js';
	if (s.addEventListener) {
	s.addEventListener('load', callback, false);
	} else if (s.readyState) {
	s.onreadystatechange = callback;
	}
	document.body.appendChild(s);
	 
}


	

function unleashGremlins(ttl, callback) {
  function stop() {
    horde.stop();
    callback();
  }
  
  
  var focusedClickerGremlin = window.gremlins.species
	.clicker()
	.clickTypes(['click'])
	.canClick(function(element) {
		var data=0;
		if( $(element).parents('a').length){
		  data= $(element).parents('a').length;
		}else if( $(element).parents('button').length){
		  data=$(element).parents('button').length;
		}	  
    return data;
    }) 
	
	
	var focusedFormFillerGremlin = window.gremlins.species
		.formFiller()
		.canFillElement(function(element) {
		return 1;//$(element).parents('input').length;
  })
  
  
 var horde=window.gremlins.createHorde() // First, create our horde 
  .gremlin(focusedClickerGremlin)
  .gremlin(focusedFormFillerGremlin);

  horde.strategy(gremlins.strategies.distribution()
  .delay(50) // wait 50 ms between each action
  .distribution([0.3, 0.3, 0.3, 0.1]) // the first three gremlins have more chances to be executed than the last
  /*
	0.3, // clicker
	0.3, // formFiller
	0.3, // todoCreator
	0.1, // scroller
  */
) 
  
  
  horde.seed(1234);

  horde.after(callback);
  window.onbeforeunload = stop;
  setTimeout(stop, ttl);
  horde.unleash();
}

describe('Monkey testing with gremlins ', function() {

  it('it should not raise any error', function() {
    browser.url('/');
    browser.click('button=Cerrar');

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(loadScript);
	
	browser.timeoutsAsyncScript(60000);
    browser.executeAsync(loadScript2);
	

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(unleashGremlins, 50000);
  });

  afterAll(function() {
    browser.log('browser').value.forEach(function(log) {
      browser.logger.info(log.message.split(' ')[2]);
    });
  });

});