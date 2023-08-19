import {
  signOut,
  auth,
  doc,
  getDoc,
  db,
  addDoc,
  serverTimestamp,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "./firebase.js";

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn &&
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful");
        localStorage.clear();
        window.location.pathname = "/index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });

if (window.location.pathname !== "/selected.html")
  if (!localStorage.uid) {
    if (window.location.pathname !== "/index.html") {
      window.location.pathname = "/index.html";
    }
  }

let profileLink = document.getElementById("profile-link");

const getCurrentUserData = async () => {
  const docSnap = await getDoc(doc(db, "users", localStorage.getItem("uid")));

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    profileLink.innerHTML = docSnap.data().username;
    localStorage.setItem("username", docSnap.data().username);
    localStorage.setItem("image", docSnap.data().image);
  } else {
    console.log("No such document!");
  }
};

window.location.pathname == "/dashboard.html" && getCurrentUserData();

const publishBlog = document.getElementById("publishBlog");

publishBlog &&
  publishBlog.addEventListener("click", async () => {
    let titleInput = document.getElementById("titleInput");
    let bodyInput = document.getElementById("bodyInput");
    if (titleInput.value.trim() !== "" && bodyInput.value.trim() !== "") {
      const docRef = await addDoc(collection(db, "blogs"), {
        title: titleInput.value,
        body: bodyInput.value,
        timestamp: serverTimestamp(),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        uid: localStorage.getItem("uid"),
        image: localStorage.getItem("image"),
      });
    }
    titleInput.value = "";
    bodyInput.value = "";
  });

const showMyBlogs = () => {
  let blogDisplayArea = document.getElementById("blogDisplayArea");
  const q = query(
    collection(db, "blogs"),
    where("uid", "==", `${localStorage.getItem("uid")}`)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    blogDisplayArea.innerHTML = "";
    querySnapshot.forEach((doc) => {
      console.log(doc.id);
      let date = new Date(doc.data().timestamp.seconds);
      blogDisplayArea.innerHTML += `
        <div class="card border border-secondary-subtle rounded py-2">
                <div class="card-header d-flex gap-4">
                    <img class="blog-avatar m-0" src="${
                      doc.data().image || "assets/avatar.jpg"
                    }" alt="">
                    <span class="d-flex flex-column justify-content-end">
                        <h5 class="card-title mb-3">${doc.data().title}</h5>
                        <h6 class="card-subtitle text-body-secondary">${
                          doc.data().username
                        } - ${date.toLocaleDateString()}</h6>
                    </span>
                </div>
                <div class="card-body">
                  <p class="card-text">${doc.data().body}</p>
                  <a href="javascript:void(0)" onclick="deleteBlog('${
                    doc.id
                  }')" class="card-link text-decoration-none">Delete</a>
                </div>
              </div>`;
    });
  });
};

window.location.pathname == "/dashboard.html" && showMyBlogs();

const showAllBlogs = () => {
  let blogDisplayArea = document.getElementById("blogDisplayArea");
  const unsubscribe = onSnapshot(collection(db, "blogs"), (querySnapshot) => {
    blogDisplayArea.innerHTML = "";
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      let date = new Date(doc.data().timestamp.seconds);
      blogDisplayArea.innerHTML += `
              <div class="card border border-secondary-subtle rounded py-2">
              <div class="card-header d-flex gap-4">
                  <img class="blog-avatar m-0" src="${
                    doc.data().image || "assets/avatar.jpg"
                  }" alt="">
                  <span class="d-flex flex-column justify-content-end">
                      <h5 class="card-title mb-3">${doc.data().title}</h5>
                      <h6 class="card-subtitle mb-2 text-body-secondary">${
                        doc.data().username
                      } - ${date.toLocaleDateString()}</h6>
                  </span>
              </div>
              <div class="card-body">
                <p class="card-text">${doc.data().body}</p>
                <a href="selected.html?uid=${
                  doc.data().uid
                }" class="card-link text-decoration-none">See all from this user</a>
              </div>
            </div>`;
    });
  });
};

window.location.pathname == "/index.html" && showAllBlogs();

const deleteBlog = async (id) => {
  await deleteDoc(doc(db, "blogs", id));
};

// const filterBlogs = (data) => {
//     window.location.pathname = "/selected.html";
//     console.log("hello")
//     let heading = document.getElementById("heading");
//     heading.innerText = `All from ${data.username}`;
// }

window.deleteBlog = deleteBlog;
// window.filterBlogs = filterBlogs;

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const mountainsRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(mountainsRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

let fileInput = document.getElementById("upload");
let profileAvatar = document.getElementById("profile-avatar");

fileInput &&
  fileInput.addEventListener("change", () => {
    console.log(fileInput.files[0]);
    profileAvatar.style.backgroundImage = `url(${URL.createObjectURL(
      fileInput.files[0]
    )})`;
  });

let updateBtn = document.getElementById("updateBtn");

updateBtn &&
  updateBtn.addEventListener("click", async () => {
    updateBtn.disabled = true;
    let username = document.getElementById("username");
    username.disabled = true;
    const imageUrl = await uploadFile(fileInput.files[0]);
    const currentuserRef = doc(db, "users", localStorage.getItem("uid"));
    console.log(currentuserRef);
    await updateDoc(currentuserRef, {
      username: username.value,
      email: localStorage.getItem("email"),
      uid: localStorage.getItem("uid"),
      image: imageUrl,
    });
    updateBtn.disabled = false;
  });

if (window.location.pathname == "/profile.html") {
  const docSnap = await getDoc(doc(db, "users", localStorage.getItem("uid")));
  if (docSnap.exists()) {
      let username = document.getElementById("username");

    profileAvatar.style.backgroundImage = `url(${docSnap.data().image})`;
      username.value = docSnap.data().username;
      
  } else {
    console.log("No such document!");
  }
}

const showSelectedUserBlogs = (selectedUid) => {
    let blogDisplayArea = document.getElementById("blogDisplayArea");
    let usernameShow = document.getElementById("usernameShow");
    let email = document.getElementById("email");
  const q = query(collection(db, "blogs"), where("uid", "==", selectedUid));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    blogDisplayArea.innerHTML = "";
      querySnapshot.forEach((doc) => {
        usernameShow.innerHTML = doc.data().username;
        email.innerHTML = doc.data().email;
        let date = new Date(doc.data().timestamp.seconds);
        blogDisplayArea.innerHTML += `
        <div class="card border border-secondary-subtle rounded py-2">
        <div class="card-header d-flex gap-4">
            <img class="blog-avatar m-0" src="${
                doc.data().image || "assets/avatar.jpg"
              }" alt="">
              <span class="d-flex flex-column justify-content-end">
              <h5 class="card-title mb-3">${doc.data().title}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">${
                doc.data().username
              } - ${date.toLocaleDateString()}</h6>
          </span>
      </div>
      <div class="card-body">
        <p class="card-text">${doc.data().body}</p>
        </div>
    </div>`
    });
  });
};

if (window.location.pathname == "/selected.html") {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
    const selectedUid = urlParams.get("uid");
  showSelectedUserBlogs(selectedUid);
}
