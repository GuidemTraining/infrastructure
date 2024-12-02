$(document).ready(function () {
    var courseId, courseName, lessonId, chapterId, userId, userEmail, userFirstName;
    let isDownloading = false;
    let downloadCount = 0;
    const downloadHistory = [];
    const banThresholds = [3, 5];
    const banDurations = [600000, 10800000]; // 10 minutes, 3 hours
    const cooldownDuration = 300000; // 5-minute cooldown
    let currentBan = null;
    let cooldownTimer = null;

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

        const now = Date.now();
        downloadHistory.push(now);

        // Remove downloads older than 1 hour
        while (downloadHistory.length > 0 && now - downloadHistory[0] > 3600000) {
            downloadHistory.shift();
        }

        if (currentBan && now < currentBan) {
            const remainingTime = Math.ceil((currentBan - now) / 60000);
            clickedButton.text(`Rate limit exceeded. Try again in ${remainingTime} minute(s).`);
            return;
        }

        if (downloadHistory.length >= banThresholds[1]) {
            currentBan = now + banDurations[1]; // 3-hour ban
            clickedButton.text('Rate limit exceeded. Try again in 3 hours.');
            return;
        } else if (downloadHistory.length >= banThresholds[0]) {
            currentBan = now + banDurations[0]; // 10-minute ban
            clickedButton.text('Rate limit exceeded. Try again in 10 minutes.');
            return;
        }

        let retryCount = 0;
        const maxRetries = 3;

        function genvpn() {
            isDownloading = true;
            $('#loadingIcon').css('display', 'inline-block');
            clickedButton.prop('disabled', true).text('Generating credentials...');

            setTimeout(() => { clickedButton.text('Please wait...'); }, 15000);
            setTimeout(() => { clickedButton.text('Almost there...'); }, 30000);
            setTimeout(() => { clickedButton.text('This may take around 2-3 minutes...'); }, 45000);

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
                    downloadCount++;
                    $('#loadingIcon').hide();
                    clickedButton.prop('disabled', true).text('Successful! Please Connect to CWR!');
                    isDownloading = false;

                    // Start 5-minute cooldown
                    if (cooldownTimer) clearTimeout(cooldownTimer);
                    cooldownTimer = setTimeout(() => {
                        clickedButton.prop('disabled', false).text('Generate VPN');
                    }, cooldownDuration);
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
