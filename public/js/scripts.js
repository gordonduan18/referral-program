function toggleRefCode() {
    let alreadyRegistered = document.getElementById("already-registered")
    let refCode = document.getElementById("copy-referral");
    if (refCode.style.display === "none") {
        refCode.style.display = "block";
        alreadyRegistered.style.display = "none";
    } else if (refCode.style.display === "block") {
        refCode.style.display = "none";
        alreadyRegistered.style.display = "block";
    }
}

function toggleCheckStatus() {
    let signupForm = document.getElementById("signup-form");
    let statusForm = document.getElementById("check-status-form");
    let statusText = document.getElementById("already-registered")
    if (signupForm.style.display === "none") {
        signupForm.style.display = "block";
        statusForm.style.display = "none";
        statusText.style.display = "block";
    } else {
        signupForm.style.display = "none";
        statusForm.style.display = "block";
        statusText.style.display = "none";
    }
}

function resetForm() {
    let signupForm = document.getElementById("signup-form");
    let statusForm = document.getElementById("check-status-form");
    let statusText = document.getElementById("already-registered");
    let refCode = document.getElementById("copy-referral");
    statusText.style.display = "block";
    refCode.style.display = "none";
    signupForm.style.display = "block";
    statusForm.style.display = "none";
}

function copyCode() {
    /* Get the text field */
    var copyText = document.getElementById("copy-referral-code");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");
}