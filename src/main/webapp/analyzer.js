/*-
 * $Id$
 */

var defaultText = "\
- Ах, не говорите мне про Австрию! Я ничего не понимаю, может быть, но \
  Австрия никогда не хотела  и  не  хочет войны. Она предает нас. Россия  одна \
  должна быть  спасительницей  Европы.  Наш  благодетель  знает  свое  высокое \
  призвание  и будет  верен  ему.  Вот одно, во  что я  верю. Нашему доброму и \
  чудному государю предстоит величайшая  роль  в мире, и он так добродетелен и \
  хорош, что Бог не оставит его, и он  исполнит  свое призвание задавить гидру \
  революции, которая теперь еще ужаснее в  лице этого убийцы и злодея. Мы одни \
  должны  искупить  кровь  праведника...  На   кого  нам   надеяться,   я  вас \
  спрашиваю?... Англия с  своим коммерческим духом не поймет и не может понять \
  всю высоту  души императора  Александра. Она отказалась очистить Мальту. Она \
  хочет   видеть,   ищет  заднюю  мысль   наших  действий.  Что  они   сказали \
  Новосильцову?... Ничего. Они не поняли,  они  не могут понять самоотвержения \
  нашего  императора, который ничего не хочет для себя  и  все хочет для блага \
  мира. И что они обещали? Ничего. И что обещали, и  того не будет! Пруссия уж \
  объявила, что Бонапарте непобедим и  что  вся  Европа ничего не может против \
  него... И я  не  верю ни  в одном  слове ни  Гарденбергу, ни Гаугвицу. Cette \
  fameuse neutralité prussienne, ce n'est qu'un  piège. Я верю в \
  одного  Бога  и  в  высокую  судьбу  нашего  милого  императора.  Он  спасет \
  Европу!...   --  Она  вдруг  остановилась  с  улыбкою   насмешки  над  своею \
  горячностью."

var transforms = {
	'object':{'tag':'div','class':'package ${show} ${type}','children':[
		{'tag':'div','class':'header','children':[
			{'tag':'div','class':function(obj){
				if( getValue(obj.value) !== undefined ) return('arrow hide');
				else return('arrow');
			}},
			{'tag':'span','class':'name','html':'${name}'},
			{'tag':'span','class':'value','html':function(obj) {
				var value = getValue(obj.value);
				if( value !== undefined ) return(" : " + value);
				else return('');
			}},
			{'tag':'span','class':'type','html':'${type}'}
		]},
		{'tag':'div','class':'children','children':function(obj){return(children(obj.value));}}
	]}
};

$(document).ready(function() {
	$("#input").val(defaultText);
	analyze();

	$('#btnAnalyze').click(analyze);
});

function analyze() {
	var text = $("#input").val();
    var queryUrl = "/analyzer/?text=" + text;

    $.ajax({
        type: 'POST',
        url: queryUrl,
        async: true,
        contentType: "application/json",
        dataType: 'json',
        success: function(json) {
            try {
        	    visualize(json);
            } catch (e) {
            	alert(e.message);
            }
        }
    });
}

function visualize(json) {
	$('#top').html('');
	$('#top').json2html(convert('json',json,'open'),transforms.object);
	regEvents();
}

function getValue(obj) {
	var type = $.type(obj);

	switch(type) {
	case 'array':
	case 'object':
		return(undefined);
		break;
	case 'function':
		return('function');
		break;
	case 'string':
		return("'" + obj + "'");
		break;
	default:
		return(obj);
		break;
	}
}

function children(obj){
	var type = $.type(obj);

	switch(type) {
	case 'array':
	case 'object':
		return(json2html.transform(obj,transforms.object));
		break;
	default:
		break;
	}
}

function convert(name, obj, show) {
	var type = $.type(obj);

	if (show === undefined) {
		show = 'closed';
	}

	var children = [];

	switch(type) {
	case 'array':
		var len=obj.length;
		for(var j=0;j<len;++j){	
			children[j] = convert(j,obj[j]);
		}
		break;
	case 'object':
		var j = 0;
		for(var prop in obj) {
			children[j] = convert(prop, obj[prop]);
			j++;
		}
		break;
	default:
		children = obj;
		break;
	}

	return({
		'name': name,
		'value': children,
		'type': type,
		'show': show
	});
}

function regEvents() {
	$('.header').click(function(){
		var parent = $(this).parent();

		if (parent.hasClass('closed')) {
			parent.removeClass('closed');
			parent.addClass('open');
		} else {
			parent.removeClass('open');
			parent.addClass('closed');
		}
	});
}
