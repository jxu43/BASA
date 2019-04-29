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
	$(".filter-all").prop('checked', true);
	$('.filter').prop('checked', false);
	$('.search').val('');

};
  
function updateList(){
 	var values_age = $("input[name=age]:checked").val();
	var values_subject = $("input[name=subject]:checked").val();

	courseList.filter(function (item) {
		var ageFilter = false;
		var subjectFilter = false;
		
		if(values_age == "all") { 
			ageFilter = true;
		} else {
			ageFilter = item.values().age == values_age;
		}
		if(values_subject == "all") { 
			subjectFilter = true;
		} else {
			subjectFilter = item.values().subject.indexOf(values_subject) >= 0;
		}
		return ageFilter && subjectFilter
	});
	courseList.update();
}
                               
$(function(){
  //updateList();
  $("input[name=age]").change(updateList);
	$('input[name=subject]').change(updateList);
	
	courseList.on('updated', function (list) {
		if (list.matchingItems.length > 0) {
			$('.no-result').hide()
		} else {
			$('.no-result').show()
		}
	});
});