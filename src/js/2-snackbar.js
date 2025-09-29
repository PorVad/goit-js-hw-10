
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const delay = Number(formData.get("delay"));
  const state = formData.get("state");

  if (!Number.isFinite(delay) || delay < 0) {
    iziToast.error({
      title: "Error",
      message: "Please enter a valid non-negative delay",
    });
    return;
  }

  createPromise(delay, state)
    .then((d) => {
      iziToast.success({
        title: "Fulfilled",
        message: `Fulfilled promise in ${d}ms`,
      });
      console.log(`Fulfilled promise in ${d}ms`);
    })
    .catch((d) => {
      iziToast.error({
        title: "Rejected",
        message: `Rejected promise in ${d}ms`,
      });
      console.log(`Rejected promise in ${d}ms`);
    })
});
