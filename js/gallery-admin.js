function adminInit() {
	console.log("adminInit");
	
	$(".gallery-item").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		$(this).toggleClass("selected-image");
		
		//var selectedImages = [];
		//selectedTags.push($(this).attr('data-tags'));
		//selectedImages.push($(this).attr('data-id'));
		
		selectTags();
    	
    	return false;
	});
	
	function selectTags(){
		
		var groupTags = $("#input-tags").attr("value").split(',');
		var interTags;
		var firstTags;
		var selectedTags = [];
		var selTags = [];
		var i = 0;
		
		if($(".selected-image").length == 1){
			
			firstTag = $(".selected-image:first").attr('data-tags').split(',');
			selectedTags = groupTags = interTags = [ firstTag ];
			
		} else if ($(".selected-image").length > 1){

			if(!groupTags[0]){
				console.log('groupTags is empty, '+i);
				groupTags = [ $(".selected-image:first").attr('data-tags').split(',') ];
			}
			
			$(".selected-image").each(function(){
				i++;
				attrTags = $(this).attr('data-tags');
				attrTags = attrTags.split(',');
				selTags.push(attrTags);
				
				$.each(attrTags, function(ke,va){
					if(selectedTags.indexOf(va) == -1 ){
						selectedTags.push(va);
					}	
				})	
				
				interTags = _.intersection(attrTags, groupTags);
				groupTags = _.intersection(selectedTags, groupTags);
				
			});
			
			interSelTags = _.intersection(JSON.stringify(selTags));
			console.log("selTags: "+JSON.stringify(selTags));
			console.log("interSelTags: "+interSelTags);
		
		} else {
			console.log("nothing selected");
			selectedTags = [];
			groupedTags = [];
		}

	console.log("selectedtags: "+selectedTags);
	console.log("grouptags: "+groupTags);
	console.log("interTags: "+interTags);
						

		$("#input-tags").attr("value",groupTags.join());
		var selectizeTags = $("#input-tags")[0].selectize;
		selectizeTags.clear();
		$.each(interTags, function(i,v){
			//console.log(v);
			selectizeTags.createItem(v);
		})
		selectizeTags.refreshItems()
		
		
		$('#input-tags').selectize({
			plugins: ['remove_button'],
	    	delimiter: ',',
	    	create: function(input) {
		        return {
		            value: input,
		            text: input
		        }
		    }
		});
			
		//console.log(tags);
	}
	
	$(function() {
		$('#input-tags').selectize({
			plugins: ['remove_button'],
	    delimiter: ',',
	    create: function(input) {
	        return {
	            value: input,
	            text: input
	        }
	    }
		});
	});
};
