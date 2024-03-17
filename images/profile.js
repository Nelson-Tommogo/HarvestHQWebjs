// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get elements
const editProfileBtn = document.getElementById('edit-profile-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');
const profileNameSpan = document.getElementById('profile-name');
const profileEmailSpan = document.getElementById('profile-email');
const profileImage = document.getElementById('profile-image');
const changePhotoBtn = document.getElementById('change-photo-btn');
const profilePhotoInput = document.getElementById('profile-photo-input');

// Function to enable editing
function enableEdit() {
    // Enable input fields for editing
    profileNameSpan.contentEditable = true;
    profileEmailSpan.contentEditable = true;

    // Show save button and hide edit button
    saveProfileBtn.style.display = 'inline';
    editProfileBtn.style.display = 'none';
}

// Function to save changes
function saveChanges() {
    // Disable input fields
    profileNameSpan.contentEditable = false;
    profileEmailSpan.contentEditable = false;

    // Hide save button and show edit button
    saveProfileBtn.style.display = 'none';
    editProfileBtn.style.display = 'inline';

    // Save changes to Firestore
    const userId = firebase.auth().currentUser.uid;
    const newName = profileNameSpan.innerText;
    const newEmail = profileEmailSpan.innerText;

    const userProfileRef = firebase.firestore().collection('users').doc(userId);
    userProfileRef.update({
        name: newName,
        email: newEmail
    }).then(() => {
        console.log('Profile updated successfully!');
    }).catch((error) => {
        console.error('Error updating profile: ', error);
    });
}

// Function to handle profile photo change
function handlePhotoChange(event) {
    const file = event.target.files[0];
    const userId = firebase.auth().currentUser.uid;
    const storageRef = firebase.storage().ref('profile_photos').child(`${userId}.jpg`);
    
    // Upload the file to Firebase Storage
    storageRef.put(file).then((snapshot) => {
        console.log('Uploaded a file!');
        
        // Get the download URL for the profile photo
        storageRef.getDownloadURL().then((downloadURL) => {
            // Update the profile photo in Firestore
            const userProfileRef = firebase.firestore().collection('users').doc(userId);
            userProfileRef.update({
                profilePhotoURL: downloadURL
            }).then(() => {
                console.log('Profile photo updated successfully!');
                // Update the profile photo in the UI
                profileImage.src = downloadURL;
            }).catch((error) => {
                console.error('Error updating profile photo:', error);
            });
        }).catch((error) => {
            console.error('Error getting download URL:', error);
        });
    }).catch((error) => {
        console.error('Error uploading file:', error);
    });
}

// Function to display user profile
function displayProfile(profileData) {
    profileNameSpan.innerText = profileData.name;
    profileEmailSpan.innerText = profileData.email;
    if (profileData.profilePhotoURL) {
        profileImage.src = profileData.profilePhotoURL;
    }
}

// Fetch user profile data from Firestore
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const userId = user.uid;
        const userProfileRef = firebase.firestore().collection('users').doc(userId);

        userProfileRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                displayProfile(userData);
            } else {
                console.log('No such document!');
            }
        }).catch((error) => {
            console.log('Error getting document:', error);
        });
    } else {
        console.log('No user signed in.');
    }
});

// Event listeners
editProfileBtn.addEventListener('click', enableEdit);
saveProfileBtn.addEventListener('click', saveChanges);
changePhotoBtn.addEventListener('click', () => {
    profilePhotoInput.click();
});
profilePhotoInput.addEventListener('change', handlePhotoChange);
