$(document).ready(function () {
    var courseId, courseName, lessonId, chapterId, userId, userEmail, userFirstName;
    let isDownloading = false; // Track if a download is in progress

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

        if (clickedButton.prop('disabled')) return;
        if (isDownloading) {
            clickedButton.text('Successful! Please Connect to CWR!');
            return;
        }

        let retryCount = 0;
        const maxRetries = 3;

        function genvpn() {
            isDownloading = true;
            $('#loadingIcon').css('display', 'inline-block');
            clickedButton.prop('disabled', true).text('Generating credentials...');

            if (!isDownloading) {
                setTimeout(() => { clickedButton.text('Please wait...'); }, 15000);
                setTimeout(() => { clickedButton.text('Almost there...'); }, 30000);
                setTimeout(() => { clickedButton.text('This may take around 2-3 minutes...'); }, 45000);
            }

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
                xhrFields: { responseType: 'blob' },
                success: function (blob) {
                    downloadFile(blob, `cwr-${userId}.guidem`);
                    $('#loadingIcon').hide();
                    clickedButton.prop('disabled', false).text('Successful! Please Connect to CWR!');
                    isDownloading = false;
                },
                error: function () {
                    retryCount++;
                    if (retryCount <= maxRetries) {
                        clickedButton.text(`Retrying (${retryCount}/${maxRetries}) in 60s...`);
                        setTimeout(genvpn, 60000);
                    } else {
                        $('#status').text('Failed to generate VPN after multiple attempts. Please try again later.').show();
                        $('#loadingIcon').hide();
                        clickedButton.prop('disabled', false).text('Generate VPN');
                        isDownloading = false;
                    }
                }
            });
        }

        genvpn();
    });
});

function downloadFile(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}
