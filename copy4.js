$(document).ready(function () {
    var courseId, lessonId, chapterId, userId, userFirstName;
    var courseData = {};

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            lessonId = data.lesson.id;
            chapterId = data.chapter.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;
        });
    }

    function addClipboardFunctionality() {
        $("pre").each(function () {
            var $this = $(this);

            // Ensure button is not duplicated
            if ($this.find(".clipboard-button").length === 0) {
                // Create clipboard button
                var buttonHtml = $(
                    '<button class="clipboard-button btn btn-secondary btn-sm" style="position: absolute; top: 5px; right: 15px; z-index: 10000; color: skyblue; background: none; border: none; cursor: pointer; display: none;">' +
                    '<i class="fa fa-clipboard" aria-hidden="true"></i>' +
                    '</button>'
                );

                buttonHtml.on("click", function (event) {
                    var text = $this.text().trim(); 
                    navigator.clipboard.writeText(text).then(function () {
                        buttonHtml.html('<i class="fa fa-check" aria-hidden="true"></i>');
                        setTimeout(function () {
                            buttonHtml.html('<i class="fa fa-clipboard" aria-hidden="true"></i>');
                        }, 2000); /
                    }).catch(function (err) {
                        console.error("Clipboard write failed:", err);
                    });

                    event.stopPropagation();
                });

                $this.css("position", "relative").append(buttonHtml);

                $this.hover(
                    function () {
                        buttonHtml.fadeIn(12200); // Show on hover
                    },
                    function () {
                        buttonHtml.fadeOut(12200); // Hide when not hovered
                    }
                );
            }
        });
    }

    function sendProgressData() {
        console.log("Sending progress data...");
    }

    addClipboardFunctionality();

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            sendProgressData();
            setTimeout(addClipboardFunctionality, 1000); 
    }
});
