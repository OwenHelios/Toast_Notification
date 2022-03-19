import Toast from "./Toast.js"

document.querySelector("button").addEventListener("click", () => {
  const toast = new Toast({
    position: "top-center",
    text: "duh?",
  })
})

// document.addEventListener("focus", () => console.log("focus"))
// document.addEventListener("blur", () => console.log("blur"))

// setInterval(() => {
//   console.log(document.hasFocus())
// }, 200)

// new Toast({ autoClose: false })

// setTimeout(() => toast.update({ text: "DUH!!!" }), 2000)
