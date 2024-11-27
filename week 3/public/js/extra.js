document.addEventListener('DOMContentLoaded', function () {
    // Initialize Sidenav
    const sidenavElems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavElems);

    // Initialize Tabs
    const tabsElems = document.querySelectorAll('.tabs');
    M.Tabs.init(tabsElems);

    console.log('Sidenav and Tabs initialized!');

    // Initialize Modal
    const modalElems = document.querySelectorAll('.modal');
    const modalInstances = M.Modal.init(modalElems);

    console.log('Modal initialized!');

    // Add functionality to the Submit button
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default form behavior

        // Open the modal dynamically
        const modal = M.Modal.getInstance(document.getElementById('modal1'));
        modal.open();
    });
});
