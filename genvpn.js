$(document).ready(function () {
    var cId, cName, lId, chId, uId, uFName;

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (d) {
            cId = d.course.id;
            cName = d.course.name;
            lId = d.lesson.id;
            chId = d.chapter.id;
            uId = d.user.id;
            uFName = d.user.first_name;
        });
    }

    $(document).on('click', '.vpn-btn', function () {
        var btn = $(this);

        if (btn.prop('disabled')) return;

        let rCount = 0, mRetries = 3;

        function gen() {
            $('#loader').css('display', 'inline-block');
            btn.prop('disabled', true).text('Generating...');

            setTimeout(() => { btn.text('Wait...'); }, 15000);
            setTimeout(() => { btn.text('Almost ready...'); }, 30000);
            setTimeout(() => { btn.text('2-3 minutes needed...'); }, 45000);

            $.ajax({
                url: 'https://sb1.guidem.ph/generate-vpn',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ courseId: cId, chapterId: chId, lessonId: lId, userId: uId }),
                xhrFields: { responseType: 'blob' },
                success: function (b) {
                    dl(b, `cwr-${uId}-.guidem`);
                    $('#loader').hide();
                    btn.prop('disabled', false).text('Connected to CWR!');
                },
                error: function () {
                    rCount++;
                    if (rCount <= mRetries) {
                        btn.text(`Retrying (${rCount}/${mRetries}) in 60s...`);
                        setTimeout(gen, 60000);
                    } else {
                        $('#status').text('Failed. Try again later.').show();
                        $('#loader').hide();
                        btn.prop('disabled', false).text('Generate VPN');
                    }
                }
            });
        }

        gen();
    });
});

function dl(b, f) {
    const u = window.URL.createObjectURL(b);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = u;
    a.download = f;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(u);
    a.remove();
}
