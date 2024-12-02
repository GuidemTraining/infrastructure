$(document).ready(function () {
    var courseId, courseName, lessonId, chapterId, userId, userEmail, userFirstName;

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            chapterId = data.chapter.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;
        });
    }

    $(document).on('click', '.vpn-guidem-button', function () {
        var clickedButton = $(this);

        if (clickedButton.prop('disabled')) {
            // Prevent multiple downloads
            return;
        }

        let retryCount = 0; // Counter for retries
        const maxRetries = 3; // Maximum retries

        function genvpn() {
            $('#loadingIcon').css('display', 'inline-block');
            clickedButton.prop('disabled', true).text('Generating credentials...');

            // Timers for dynamic feedback
            setTimeout(() => {
                clickedButton.text('Please wait...');
            }, 15000);

            setTimeout(() => {
                clickedButton.text('Almost there...');
            }, 30000);

            setTimeout(() => {
                clickedButton.text('This may take around 2-3 minutes...');
            }, 45000);

            // AJAX call to handle Blob response
            $.ajax({
                url: 'https://sb1.guidem.ph/generate-vpn',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    courseId: courseId,
                    chapterId: chapterId,
                    lessonId: lessonId,
                    userId: userId,
                }),
                xhrFields: {
                    responseType: 'blob' // Important for receiving the file as a Blob
                },
                success: function (blob) {
                    downloadFile(blob, `cwr-${userId}-.guidem`);
                    $('#loadingIcon').hide();
                    clickedButton.prop('disabled', false).text('Successful! Please Connect to CWR!');
                },
                error: function () {
                    retryCount++;
                    if (retryCount <= maxRetries) {
                        clickedButton.text(`Retrying (${retryCount}/${maxRetries}) in 60s...`);
                        setTimeout