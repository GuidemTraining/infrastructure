$(document).ready(function () {
    function addClipboardFunctionality() {
        // Add clipboard functionality to <pre> elements
        $("pre").each(function () {
            var $this = $(this);

            // Check if the clipboard button is already added
            if ($this.find(".clipboard-button").length === 0) {
                // Create the clipboard button
                var buttonHtml = $(
                    '<button class="clipboard-button btn btn-secondary btn-sm" style="position: absolute; top: 0.5rem; right: 1.5rem; z-index: 10000; color: skyblue; background: none; border: none; display: none;">' +
                    '<i class="fa fa-clipboard" aria-hidden="true"></i>' +
                    '</button>'
                );

                // Add click functionality for copying text
                buttonHtml.on("click", function () {
                    var text = $this.text().trim(); // Get the text from the <pre> element
                    navigator.clipboard.writeText(text).then(function () {
                        buttonHtml.html('<i class="fa fa-check" aria-hidden="true"></i>');
                        setTimeout(function () {
                            buttonHtml.html('<i class="fa fa-clipboard" aria-hidden="true"></i>');
                        }, 2000); // Reset button after 2 seconds
                    }).catch(function (err) {
                        console.error("Clipboard write failed:", err);
                    });
                });

                // Append the button to the <pre> element
                $this.css("position", "relative").append(buttonHtml);

                // Show the button on hover
                $this.hover(
                    function () {
                        buttonHtml.css("display", "block"); // Show button
                    },
                    function () {
                        buttonHtml.css("display", "none"); // Hide button immediately
                    }
                );
            }
        });
    }

    // Apply clipboard functionality
    addClipboardFunctionality();

    // If content changes dynamically (e.g., AJAX), reapply the functionality
    if (typeof CoursePlayerV2 !== "undefined") {
        CoursePlayerV2.on("hooks:contentDidChange", function () {
            setTimeout(addClipboardFunctionality, 1000); // Delay to ensure new content is loaded
        });
    }
});
