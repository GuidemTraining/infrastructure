// Initialize the Stepper Functionality
function initializeStepper() {
    // Ensure the DOM is loaded before executing
    document.addEventListener("DOMContentLoaded", function () {
        const completeButtons = document.querySelectorAll(".btn-complete");

        completeButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const currentStep = this.getAttribute("data-complete");
                const currentStepItem = document.querySelector(`[data-step="${currentStep}"]`);
                const nextStepItem = document.querySelector(`[data-step="${parseInt(currentStep) + 1}"]`);

                // Collapse the current step
                const currentContent = currentStepItem.querySelector(".collapse");
                if (currentContent) {
                    currentContent.classList.remove("show");
                }

                // Mark the current step as inactive
                currentStepItem.classList.remove("active");

                // Expand the next step
                if (nextStepItem) {
                    const nextContent = nextStepItem.querySelector(".collapse");
                    if (nextContent) {
                        nextContent.classList.add("show");
                    }

                    // Mark the next step as active
                    nextStepItem.classList.add("active");
                }
            });
        });
    });
}

// Ensure the Stepper Works with Thinkific's Course Player
if (typeof CoursePlayerV2 !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function (data) {
        console.log('Content changed:', data);

        // Reinitialize the stepper when the content changes
        initializeStepper();
    });
}

// Initial Call to the Stepper Functionality
initializeStepper();
