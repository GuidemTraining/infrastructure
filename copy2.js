$(document).ready(function () {
    function addClipboardFunctionality() {
        $("pre").each(function () {
            var $this = $(this);
            var buttonHtml = $('<button class="clipboard-button btn btn-secondary btn-sm" style="position: absolute; top: 0.5rem; right: 1.5rem; z-index: 10000; color: skyblue; opacity: 0.7; background: none; border: none; display: none;"><i class="fa fa-clipboard" aria-hidden="true"></i></button>')
                .click(function (event) {
                    var text = $this.text();
                    navigator.clipboard.writeText(text).then(function () {
                        buttonHtml.html('<i class="fa fa-check" aria-hidden="true"></i>').prop('disabled', true);
                        setTimeout(function () {
                            buttonHtml.html('<i class="fa fa-clipboard" aria-hidden="true"></i>').prop('disabled', false);
                        }, 2000);
                    }).catch(function (err) {
                        console.error("Clipboard write failed:", err);
                    });
                    event.stopPropagation();
                });

            $this.before(buttonHtml);

            $this.hover(function () {
                buttonHtml.stop().fadeTo(500, 1); // Show the button
            }, function () {
                buttonHtml.stop().fadeTo(1500, 0.4); // Fade to translucent
            });

            buttonHtml.hover(function () {
                buttonHtml.stop().fadeTo(500, 1); // Ensure visibility on hover
            }, function () {
                buttonHtml.stop().fadeTo(1500, 0.4); // Return to translucent state
            });
        });
    }

    // Initialize clipboard functionality
    addClipboardFunctionality();
});
