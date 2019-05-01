var options = {
	valueNames: [
		'courseId',
		'courseName',
		'subject',
		{ data: ['age']}
	],
	page: 3,
	pagination: true
};
var courseList = new List('courses', options);

function resetList(){
	courseList.search();
	courseList.filter();
	courseList.update();
	$(".filter-all").addClass("is-checked");
	$('.filter').removeClass("is-checked");
	$('.search').val('');

};


$(':input[type=button]').on('click', function(e) {
		var $button = $( e.currentTarget );
		if ($button.hasClass("is-checked")) {
			console.log("here");
			$button.removeClass("is-checked");
			if (!($('.age-btn .filter').hasClass("is-checked")) && !($('.subject-btn .filter').hasClass("is-checked"))) {
				console.log("no class");
				$(".filter-all").addClass("is-checked");
			} else if (!$('.subject-btn .filter').hasClass("is-checked")) {
				$(".subject-btn .filter-all").addClass("is-checked");
			} else if (!$('.age-btn .filter').hasClass("is-checked")){
				$(".age-btn .filter-all").addClass("is-checked");
			}
		} else {
			$button.addClass("is-checked")
			if (!($button.is(".filter-all")) && $(".subject-btn .filter-all").hasClass("is-checked") && $(".age-btn .filter-all").hasClass("is-checked")) {
				if ($(".subject-btn .filter").hasClass("is-checked") && $(".age-btn .filter").hasClass("is-checked")) {
					$(".filter-all").removeClass("is-checked")
				} else if ($(".subject-btn .filter").hasClass("is-checked")) {
					$(".subject-btn .filter-all").removeClass("is-checked");
				} else if ($(".age-btn .filter").hasClass("is-checked")){
					$(".age-btn .filter-all").removeClass("is-checked");
				}
			} else if ($button.is(".filter-all") && $button.parents('.subject-btn').length) {
				console.log("yes");
				$(".subject-btn .filter").removeClass("is-checked");
			} else if ($button.is(".filter-all") && $button.parents('.age-btn').length) {
				console.log("yes");
				$(".age-btn .filter").removeClass("is-checked");
			} else {
				if ($button.parents('.age-btn').length) {
					$('.age-btn .filter-all').removeClass("is-checked");
				} else if ($button.parents('.subject-btn').length) {
					$('.subject-btn .filter-all').removeClass("is-checked");
				}
			}
		}
})

  
function updateList(){
	var values_ages = [];
 	$(".age-btn .is-checked ").each(function() {
 		values_ages.push($(this).val());
 	});
	var values_subjects = [];
	 $(".subject-btn .is-checked ").each(function() {
	 	values_subjects.push($(this).val());
	 });

	console.log(values_ages, values_subjects)

	courseList.filter(function (item) {
		var ageFilter = false;
		var subjectFilter = false;
		// item.values().age
		if(values_ages.includes('all') || values_ages.includes(item.values().age)) { 
			ageFilter = true;
		} else {
			ageFilter = false
		}

		if(values_subjects.includes('all')) { 
			subjectFilter = true;
		} else {
			for (let i = 0; i < values_subjects.length; i++) {
				if (item.values().subject.indexOf(values_subjects[i]) >= 0) {
					subjectFilter = true;
				}
			}
		}
		return ageFilter && subjectFilter
	});
	courseList.update();
}
                               
$(function(){
  //updateList();
  $("input[name=age]").click(updateList);
	$('input[name=subject]').click(updateList);
	
	courseList.on('updated', function (list) {
		if (list.matchingItems.length > 0) {
			$('.no-result').hide()
		} else {
			$('.no-result').show()
		}
	});
});