import {
  auth,
  createUserWithEmailAndPassword,
  db,
  setDoc,
  doc,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  provider,
} from "./firebase.js";

const signupBtn = document.getElementById("signup-btn");

signupBtn &&
  signupBtn.addEventListener("click", () => {
    signupBtn.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"></div>`;
    signupBtn.disabled = true;
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let username = document.getElementById("username");
    let showError = document.getElementById("error-message");

    if (username.value.trim() === "") {
      signupBtn.innerHTML = `Sign Up`;
      signupBtn.disabled = false;
      showError.innerHTML = `
      <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <g fill="none">
          <path
            d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
          <path fill="currentColor"
            d="M15.314 2a2 2 0 0 1 1.414.586l4.686 4.686A2 2 0 0 1 22 8.686v6.628a2 2 0 0 1-.586 1.414l-4.686 4.686a2 2 0 0 1-1.414.586H8.686a2 2 0 0 1-1.414-.586l-4.686-4.686A2 2 0 0 1 2 15.314V8.686a2 2 0 0 1 .586-1.414l4.686-4.686A2 2 0 0 1 8.686 2h6.628Zm0 2H8.686L4 8.686v6.628L8.686 20h6.628L20 15.314V8.686L15.314 4ZM12 15a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm0-9a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Z" />
        </g>
      </svg>
      <p class=" error-message">Please enter a correct username</p>`;
      username.classList.add("error-input");
      username.focus();
    } else {
      showError.innerHTML = "";
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userInfo) => {
          const user = userInfo.user;
          await setDoc(doc(db, "users", user.uid), {
            username: username.value,
            email: email.value,
            uid: user.uid,
            image: 'assets/avatar.jpg'
          });
          console.log("username ==>", username.value);
          console.log("email ==>", email.value);
          username.value = "";
          email.value = "";
          password.value = "";
          console.log(user);
          localStorage.setItem("uid", user.uid);
          localStorage.setItem("email", user.email);
          if (window.location.pathname !== "/dashboard.html") {
            window.location.pathname = "/dashboard.html";
          }
          signupBtn.innerHTML = `Sign Up`;
          signupBtn.disabled = false;
        })
        .catch((err) => {
          signupBtn.innerHTML = `Sign Up`;
          signupBtn.disabled = false;
          let errorMessage;
          if (err.message.includes("invalid-email")) {
            errorMessage = "Please enter a valid email";
          } else if (err.message.includes("wrong-password")) {
            errorMessage = "Please enter correct password";
          } else if (err.message.includes("user-not-found")) {
            errorMessage = "Please enter a registered email";
          } else if (err.message.includes("email-already-in-use")) {
            errorMessage = "Please enter a new email";
          } else if (err.message.includes("weak-password")) {
            errorMessage = "Please enter a password of minimum 6 characters";
          } else if (err.message.includes("network-request-failed")) {
            errorMessage = "Please check your internet connection";
          } else if (err.message.includes("missing-password")) {
            errorMessage = "Please enter your password";
          } else {
            errorMessage = err.message;
          }

          showError.innerHTML = `
        <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <g fill="none">
            <path
              d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
            <path fill="currentColor"
              d="M15.314 2a2 2 0 0 1 1.414.586l4.686 4.686A2 2 0 0 1 22 8.686v6.628a2 2 0 0 1-.586 1.414l-4.686 4.686a2 2 0 0 1-1.414.586H8.686a2 2 0 0 1-1.414-.586l-4.686-4.686A2 2 0 0 1 2 15.314V8.686a2 2 0 0 1 .586-1.414l4.686-4.686A2 2 0 0 1 8.686 2h6.628Zm0 2H8.686L4 8.686v6.628L8.686 20h6.628L20 15.314V8.686L15.314 4ZM12 15a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm0-9a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Z" />
          </g>
        </svg>
        <p class=" error-message">${errorMessage}</p>`;
          email.classList.add("error-input");
          password.classList.add("error-input");
          password.focus();
          email.focus();
        });
    }
  });

const signinBtn = document.getElementById("signin-btn");

signinBtn &&
  signinBtn.addEventListener("click", () => {
    signinBtn.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"></div>`;
    signinBtn.disabled = true;
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let showError = document.getElementById("error-message");
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userInfo) => {
        const user = userInfo.user;
        console.log(user);
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("email", user.email);
        if (window.location.pathname !== "/dashboard.html") {
          window.location.pathname = "/dashboard.html";
        }
        signinBtn.innerHTML = `Sign In`;
        signinBtn.disabled = false;
      })
      .catch((err) => {
        signinBtn.innerHTML = `Sign In`;
        signinBtn.disabled = false;
        let errorMessage;
        if (err.message.includes("invalid-email")) {
          errorMessage = "Please enter a valid email";
        } else if (err.message.includes("wrong-password")) {
          errorMessage = "Please enter correct password";
        } else if (err.message.includes("user-not-found")) {
          errorMessage = "Please enter a registered email";
        } else if (err.message.includes("email-already-in-use")) {
          errorMessage = "Please enter a new email";
        } else if (err.message.includes("weak-password")) {
          errorMessage = "Please enter a password of minimum 6 characters";
        } else if (err.message.includes("network-request-failed")) {
          errorMessage = "Please check your internet connection";
        } else if (err.message.includes("missing-password")) {
          errorMessage = "Please enter your password";
        } else {
          errorMessage = err.message;
        }

        showError.innerHTML = `
      <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <g fill="none">
          <path
            d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
          <path fill="currentColor"
            d="M15.314 2a2 2 0 0 1 1.414.586l4.686 4.686A2 2 0 0 1 22 8.686v6.628a2 2 0 0 1-.586 1.414l-4.686 4.686a2 2 0 0 1-1.414.586H8.686a2 2 0 0 1-1.414-.586l-4.686-4.686A2 2 0 0 1 2 15.314V8.686a2 2 0 0 1 .586-1.414l4.686-4.686A2 2 0 0 1 8.686 2h6.628Zm0 2H8.686L4 8.686v6.628L8.686 20h6.628L20 15.314V8.686L15.314 4ZM12 15a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm0-9a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Z" />
        </g>
      </svg>
      <p class=" error-message">${errorMessage}</p>`;
        email.classList.add("error-input");
        password.classList.add("error-input");
        password.focus();
        email.focus();
      });
  });

if (localStorage.uid) {
  if (window.location.pathname !== "/dashboard.html") {
    window.location.pathname = "/dashboard.html";
  }
} else {
  if (
    location.pathname !== "/signin.html" &&
    location.pathname !== "/signup.html" &&
    location.pathname === "/dashboard.html"
  ) {
    location.pathname = "/signin.html";
  }
  console.log("User is signed out");
}

let showPasswordBtn = document.getElementById("show-password-btn");
let isPasswordVisible = false;
showPasswordBtn.addEventListener("click", () => {
  let password = document.getElementById("password");
  isPasswordVisible = !isPasswordVisible;
  if (isPasswordVisible) {
    showPasswordBtn.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <g fill="none" fill-rule="evenodd">
    <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
    <path fill="currentColor" d="M4 12.001V12c.003-.016.017-.104.095-.277c.086-.191.225-.431.424-.708c.398-.553.993-1.192 1.745-1.798C7.777 7.996 9.812 7 12 7c2.188 0 4.223.996 5.736 2.216c.752.606 1.347 1.245 1.745 1.798c.2.277.338.517.424.708c.078.173.092.261.095.277V12c-.003.016-.017.104-.095.277a4.251 4.251 0 0 1-.424.708c-.398.553-.993 1.192-1.745 1.798C16.224 16.004 14.188 17 12 17c-2.188 0-4.223-.996-5.736-2.216c-.752-.606-1.347-1.245-1.745-1.798a4.226 4.226 0 0 1-.424-.708A1.115 1.115 0 0 1 4 12.001ZM12 5C9.217 5 6.752 6.254 5.009 7.659c-.877.706-1.6 1.474-2.113 2.187a6.157 6.157 0 0 0-.625 1.055C2.123 11.23 2 11.611 2 12c0 .388.123.771.27 1.099c.155.342.37.7.626 1.055c.513.713 1.236 1.48 2.113 2.187C6.752 17.746 9.217 19 12 19c2.783 0 5.248-1.254 6.991-2.659c.877-.706 1.6-1.474 2.113-2.187c.257-.356.471-.713.625-1.055c.148-.328.271-.71.271-1.099c0-.388-.123-.771-.27-1.099a6.197 6.197 0 0 0-.626-1.055c-.513-.713-1.236-1.48-2.113-2.187C17.248 6.254 14.783 5 12 5Zm-1 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Zm1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"/>
    </g>
    </svg>`;
    password.type = "text";
  } else {
    showPasswordBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <g fill="none">
    <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
    <path fill="currentColor" d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57a9.509 9.509 0 0 1-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.116 9.116 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.118 9.118 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z"/>
    </g>
    </svg>`;
    password.type = "password";
  }
});

export { auth };

const signInWithGoogleBtn = document.getElementById("signInWithGoogleBtn");

signInWithGoogleBtn &&
  signInWithGoogleBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        try {
          await setDoc(doc(db, "users", user.uid), {
            username: user.displayName,
            email: user.email,
            uid: user.uid,
            image: user.photoURL,
          });
          localStorage.setItem("uid", user.uid);
          localStorage.setItem("email", user.email);
          if (window.location.pathname !== "/dashboard.html") {
            window.location.pathname = "/dashboard.html";
          }
        } catch (err) {
          console.log("Error", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${err}`,
          });
        }
      })
      .catch((error) => {
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${errorCode}`,
        });
      });
  });

