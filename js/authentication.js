  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyApU7_YcSXNXzixSxD8KBRtivt5oVuyj2c",
    authDomain: "smartmavuno.firebaseapp.com",
    databaseURL: "https://smartmavuno-default-rtdb.firebaseio.com",
    projectId: "smartmavuno",
    storageBucket: "smartmavuno.appspot.com",
    messagingSenderId: "298910741240",
    appId: "1:298910741240:web:dbbe6e3dfcfc1568e9c10d",
    measurementId: "G-N1C5FBGVEE"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log("logged in");
    
        const mkoolima_user = firebase.auth().currentUser;
        //what will displayed on the header
        var jina = mkoolima_user.displayName;
        
        var photo = mkoolima_user.photoURL;
    
        if (jina === null){
        //if no dispaly name, we use the email address
        jina = mkoolima_user.email;
        }
        $('#user_profile').html(jina);
        if (photo != null){
            //use the google photo
            $("#avatar").attr("hidden", true);
            $("#user_photo").attr("hidden", false);
            $("#user_photo").attr("src", photo);
        }
    } else {
        console.log("Not logged in");
        window.location.replace("login.html");
    }
    });
});
