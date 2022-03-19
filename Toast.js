const DEFAULT_OPTIONS = {
  position: "top-right",
  text: "Notification",
  autoClose: 3000,
  onClose: () => {},
  manualClose: true,
  showProgress: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
}

export default class Toast {
  #toastEl
  #autoCloseInterval
  #removeBound
  #autoCloseTime
  #progressInterval
  #isPause = false
  #pause
  #unpause
  #visibilityChange
  #progressTime = 0

  constructor(options) {
    this.#toastEl = document.createElement("div")
    this.#toastEl.classList.add("toast")
    setTimeout(() => {
      this.#toastEl.classList.add("show")
    }, 50)
    this.#removeBound = this.remove.bind(this)
    this.#pause = () => (this.#isPause = true)
    this.#unpause = () => (this.#isPause = false)
    this.#visibilityChange = () => {
      this.#isPause = document.visibilityState === "hidden"
    }
    this.update({ ...DEFAULT_OPTIONS, ...options })
  }

  set position(value) {
    const currentContainer = this.#toastEl.parentElement
    const selector = `.toast-container[data-position="${value}"]`
    const container = document.querySelector(selector) || createContainer(value)
    container.append(this.#toastEl)
    if (currentContainer == null || currentContainer.hasChildNodes()) return
    currentContainer.remove()
  }

  set text(value) {
    this.#toastEl.textContent = value
  }

  set autoClose(value) {
    this.#autoCloseTime = value
    this.#progressTime = 0
    if (value === false) return
    let lastTime
    this.#autoCloseInterval = setInterval(() => {
      const time = new Date()
      if (lastTime == null) {
        lastTime = time
        return
      }
      if (!this.#isPause) {
        this.#progressTime += time - lastTime
        if (this.#progressTime >= this.#autoCloseTime) {
          this.remove()
          return
        }
      }
      lastTime = time
    }, 10)
  }

  set manualClose(value) {
    this.#toastEl.classList.toggle("manual-close", value)
    if (value) {
      this.#toastEl.addEventListener("click", this.#removeBound)
    } else {
      this.#toastEl.removeEventListener("click", this.#removeBound)
    }
  }

  set showProgress(value) {
    this.#toastEl.classList.toggle("progress", value)
    if (!value || this.#autoCloseTime == false) return
    this.#toastEl.style.setProperty("--progress", 1)
    this.#progressInterval = setInterval(() => {
      if (this.#isPause) return
      this.#toastEl.style.setProperty(
        "--progress",
        1 - this.#progressTime / this.#autoCloseTime
      )
    }, 10)
  }

  set pauseOnHover(value) {
    if (value) {
      this.#toastEl.addEventListener("mouseover", this.#pause)
      this.#toastEl.addEventListener("mouseleave", this.#unpause)
    } else {
      this.#toastEl.removeEventListener("mouseover", this.#pause)
      this.#toastEl.removeEventListener("mouseleave", this.#unpause)
    }
  }

  set pauseOnFocusLoss(value) {
    if (value) {
      document.addEventListener("visibilitychange", this.#visibilityChange)
    } else {
      document.removeEventListener("visibilitychange", this.#visibilityChange)
    }
  }

  update(options) {
    Object.entries(options).forEach(([key, value]) => {
      this[key] = value
    })
  }

  remove() {
    clearInterval(this.#progressInterval)
    clearInterval(this.#autoCloseInterval)
    const container = this.#toastEl.parentElement
    this.#toastEl.classList.remove("show")
    this.#toastEl.addEventListener("transitionend", () => {
      this.#toastEl.remove()
      if (container == null || container.hasChildNodes()) return
      container.remove()
    })
    this.onClose()
  }
}

function createContainer(position) {
  const container = document.createElement("div")
  container.classList.add("toast-container")
  container.dataset.position = position
  document.body.append(container)
  return container
}
