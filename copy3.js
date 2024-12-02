$(document).ready(function() {
    var courseId, lessonId, chapterId, userId, userFirstName;
    var courseData = {};

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            lessonId = data.lesson.id;
            chapterId = data.chapter.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;
            sendProgressData();
        });
    }
    function addClipboardFunctionality() {
        $("pre").each(function() {
            var $this = $(this);
            var buttonHtml = $('<button class="clipboard-button btn btn-secondary btn-sm" style="position: absolute; top: 0.5rem; right: 1.5rem; z-index: 10000;color:skyblue;opacity:0.7;background:none;border:none; display: none;"><i class="fa fa-clipboard" aria-hidden="true"></i></button>').click(function(event) {
                var text = $this.text();
                navigator.clipboard.writeText(text).then(function() {
                    buttonHtml.html('<i class="fa fa-check" aria-hidden="true"></i>').prop('disabled', true);
                    setTimeout(function() {
                        buttonHtml.html('<i class="fa fa-clipboard" aria-hidden="true"></i>').prop('disabled', false);
                        buttonHtml.fadeOut(6000); 
                    }, 2000);
                }).catch(function(err) {
                });
                event.stopPropagation(); 
            });
            $this.before(buttonHtml);
            $this.hover(function() {
                buttonHtml.show();
            }, function() {
                if (!buttonHtml.is(':animated')) { 
                    buttonHtml.fadeOut(6500); 
                }
            });
            buttonHtml.hover(function() {
                buttonHtml.show();
            }, function() {
                if (!buttonHtml.is(':animated')) { 
                    buttonHtml.fadeOut(6500);  
                }
            });
        });
    }

    addClipboardFunctionality();
    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function(data) {
            sendProgressData();
            setTimeout(addClipboardFunctionality, 1000);
        });
});
