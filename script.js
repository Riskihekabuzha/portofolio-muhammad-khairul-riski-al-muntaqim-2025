// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Navbar scroll effect and active link highlighting
let ticking = false

function updateNavbar() {
  const navbar = document.getElementById("navbar")
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-link")

  // Navbar background
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  // Active section highlighting
  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.clientHeight
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href").substring(1) === current) {
      link.classList.add("active")
    }
  })

  ticking = false
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateNavbar)
    ticking = true
  }
})

// Mobile menu toggle
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    hamburger.classList.toggle("active")

    // Add animation feedback
    hamburger.style.transform = "scale(0.9)"
    setTimeout(() => {
      hamburger.style.transform = "scale(1)"
    }, 150)
  })

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    }
  })
}

// Flip Card Animation
const flipCard = document.getElementById("flipCard")
let isFlipped = false
let autoFlipInterval

if (flipCard) {
  flipCard.addEventListener("click", () => {
    flipCard.classList.toggle("flipped")
    isFlipped = !isFlipped

    // Add click feedback
    flipCard.style.transform = "scale(0.95)"
    setTimeout(() => {
      flipCard.style.transform = "scale(1.05)"
      setTimeout(() => {
        flipCard.style.transform = "scale(1)"
      }, 100)
    }, 100)

    // Reset auto flip timer
    clearInterval(autoFlipInterval)
    startAutoFlip()
  })

  // Auto flip function
  function startAutoFlip() {
    autoFlipInterval = setInterval(() => {
      flipCard.classList.toggle("flipped")
      isFlipped = !isFlipped
    }, 5000)
  }

  // Start auto flip
  startAutoFlip()
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe all sections for scroll animations
document.querySelectorAll("section").forEach((section) => {
  section.style.opacity = "0"
  section.style.transform = "translateY(30px)"
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(section)
})

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  function updateCounter() {
    start += increment
    if (start < target) {
      element.textContent = Math.floor(start)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  updateCounter()
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const stats = entry.target.querySelectorAll(".stat-number")
      stats.forEach((stat) => {
        const target = Number.parseInt(stat.getAttribute("data-target"))
        animateCounter(stat, target)
      })
      statsObserver.unobserve(entry.target)
    }
  })
})

const aboutStats = document.querySelector(".about-stats")
if (aboutStats) {
  statsObserver.observe(aboutStats)
}

// Skills progress bar animation
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const progressBars = entry.target.querySelectorAll(".skill-progress")
      progressBars.forEach((bar, index) => {
        const width = bar.getAttribute("data-width")
        setTimeout(() => {
          bar.style.width = width
        }, index * 200)
      })
      skillsObserver.unobserve(entry.target)
    }
  })
})

const skillsSection = document.querySelector(".skills")
if (skillsSection) {
  skillsObserver.observe(skillsSection)
}

// Project filtering with enhanced animations
const filterButtons = document.querySelectorAll(".filter-btn")
const projectCards = document.querySelectorAll(".project-card")
const projectsFilter = document.querySelector(".projects-filter")

// Create and add counter element
if (projectsFilter && projectCards.length > 0) {
  const counterElement = document.createElement("div")
  counterElement.className = "projects-counter"
  projectsFilter.appendChild(counterElement)

  function updateProjectCounter(visibleCount, totalCount) {
    counterElement.textContent = `Showing ${visibleCount} of ${totalCount} projects`
    counterElement.classList.add("show")
  }

  function filterProjects(filterValue) {
    let visibleCount = 0

    // Add fade out effect first
    projectCards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "scale(0.8)"
    })

    // After fade out, filter and fade in
    setTimeout(() => {
      projectCards.forEach((card, index) => {
        if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
          card.classList.remove("hidden")
          card.style.display = "block"
          visibleCount++

          // Staggered fade in animation
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "scale(1)"
          }, index * 100)
        } else {
          card.classList.add("hidden")
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      })

      // Update counter
      setTimeout(() => {
        updateProjectCounter(visibleCount, projectCards.length)
      }, 500)
    }, 300)
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      button.classList.add("active")

      const filterValue = button.getAttribute("data-filter")
      filterProjects(filterValue)

      // Add click animation
      button.style.transform = "scale(0.95)"
      setTimeout(() => {
        button.style.transform = "translateY(-3px) scale(1.05)"
      }, 150)
    })
  })

  // Initialize counter on page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      updateProjectCounter(projectCards.length, projectCards.length)
    }, 1000)
  })
}

// Certificate Modal Functionality
const certificateModal = document.getElementById("certificateModal")
const modalClose = document.getElementById("modalClose")
const modalOverlay = document.querySelector(".modal-overlay")

const certificateData = {
  "jquery-dasar": {
    name: "jQuery Dasar",
    issuer: "Code Politan",
    date: " 29 Mei 2025",
    link: "https://www.codepolitan.com/c/4DZBVYK/",
  },
  "html-css-dasar": {
    name: "Dasar-dasar HTML dan CSS",
    issuer: "Code Politan",
    date: "29 Mei 2025",
    link: "https://www.codepolitan.com/c/QGTMBRY/",
  },
  "js-dasar": {
    name: "JavaScript Dasar",
    issuer: "Code Politan",
    date: "3 Juni 2025",
    link: "https://www.codepolitan.com/c/ZBITQ05/",
  },
  "js-async": {
    name: "JavaScript Async",
    issuer: "Code Politan",
    date: "29 Mei 2025",
    link: "https://www.codepolitan.com/c/PZ783CB/",
  },
}

// Certificate button click handlers
document.querySelectorAll(".btn-certificate").forEach((button) => {
  button.addEventListener("click", function () {
    const certificateId = this.getAttribute("data-certificate")
    const certificate = certificateData[certificateId]

    if (certificate && certificateModal) {
      document.getElementById("modalCertificateName").textContent = certificate.name
      document.getElementById("modalCertificateIssuer").textContent = certificate.issuer
      document.getElementById("modalCertificateDate").textContent = `Issued: ${certificate.date}`

      // Update the view certificate link
      const viewCertificateBtn = document.querySelector(".modal-actions .btn-primary")
      if (viewCertificateBtn) {
        viewCertificateBtn.onclick = () => window.open(certificate.link, "_blank")
      }

      certificateModal.classList.add("active")
      document.body.style.overflow = "hidden"
    }

    // Add click animation
    this.style.transform = "scale(0.95)"
    setTimeout(() => {
      this.style.transform = "scale(1)"
    }, 150)
  })
})

// Close modal functionality
function closeModal() {
  if (certificateModal) {
    certificateModal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal)
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", closeModal)
}

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    }

    // Close modal if open
    if (certificateModal && certificateModal.classList.contains("active")) {
      closeModal()
    }
  }
})

// Form submission with enhanced animations
const contactForm = document.getElementById("contactForm")
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(contactForm)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // Simple validation
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields", "error")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address", "error")
      return
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML

    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>'
    submitBtn.disabled = true
    submitBtn.style.transform = "scale(0.95)"

    setTimeout(() => {
      showNotification("Thank you for your message! I'll get back to you soon.", "success")
      contactForm.reset()
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
      submitBtn.style.transform = "scale(1)"
    }, 2000)
  })
}

// Enhanced notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Auto remove after 5 seconds
  const autoRemove = setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 300)
  }, 5000)

  // Close button functionality
  notification.querySelector(".notification-close").addEventListener("click", () => {
    clearTimeout(autoRemove)
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 300)
  })
}

// Smooth reveal animation for elements
const revealElements = document.querySelectorAll(
  ".skill-category, .project-card, .certificate-card, .contact-item, .about-img-container",
)

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }, index * 100)
      }
    })
  },
  { threshold: 0.1 },
)

revealElements.forEach((element) => {
  element.style.opacity = "0"
  element.style.transform = "translateY(30px)"
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  revealObserver.observe(element)
})

// Enhanced project cards tilt effect (only on desktop)
if (window.innerWidth > 768) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)"
    })
  })
}

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Enhanced cursor trail effect (only on desktop)
if (window.innerWidth > 768) {
  let mouseX = 0
  let mouseY = 0
  const trailElements = []

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    // Create trail element
    const trail = document.createElement("div")
    trail.className = "cursor-trail"
    trail.style.left = mouseX + "px"
    trail.style.top = mouseY + "px"

    document.body.appendChild(trail)
    trailElements.push(trail)

    // Remove old trail elements
    if (trailElements.length > 15) {
      const oldTrail = trailElements.shift()
      if (oldTrail.parentNode) {
        oldTrail.remove()
      }
    }

    // Remove trail after animation
    setTimeout(() => {
      if (trail.parentNode) {
        trail.remove()
      }
      const index = trailElements.indexOf(trail)
      if (index > -1) {
        trailElements.splice(index, 1)
      }
    }, 800)
  })
}

// Add keyboard support for filter buttons
filterButtons.forEach((button, index) => {
  button.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      button.click()
    }

    // Arrow key navigation
    if (e.key === "ArrowLeft" && index > 0) {
      filterButtons[index - 1].focus()
    }
    if (e.key === "ArrowRight" && index < filterButtons.length - 1) {
      filterButtons[index + 1].focus()
    }
  })
})

// Add ripple effect to buttons
function createRipple(event) {
  const button = event.currentTarget
  const circle = document.createElement("span")
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`
  circle.classList.add("ripple")

  const ripple = button.getElementsByClassName("ripple")[0]
  if (ripple) {
    ripple.remove()
  }

  button.appendChild(circle)
}

// Add ripple effect to all buttons
document.querySelectorAll(".btn, .filter-btn, .btn-certificate, .btn-verify").forEach((button) => {
  button.addEventListener("click", createRipple)
})

// Add scroll to top functionality
const scrollToTopBtn = document.createElement("button")
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
scrollToTopBtn.className = "scroll-to-top"
document.body.appendChild(scrollToTopBtn)

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("visible")
  } else {
    scrollToTopBtn.classList.remove("visible")
  }
})

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })

  // Add click animation
  scrollToTopBtn.style.transform = "scale(0.9) rotate(360deg)"
  setTimeout(() => {
    scrollToTopBtn.style.transform = "scale(1) rotate(0deg)"
  }, 300)
})

scrollToTopBtn.addEventListener("mouseenter", () => {
  scrollToTopBtn.style.transform = "scale(1.1)"
})

scrollToTopBtn.addEventListener("mouseleave", () => {
  scrollToTopBtn.style.transform = "scale(1)"
})

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Enhanced Portfolio loaded successfully!")

  // Set initial opacity
  document.body.style.opacity = "1"

  // Initialize any additional features here
  setTimeout(() => {
    // Trigger initial animations
    const heroContent = document.querySelector(".hero-content")
    const heroImage = document.querySelector(".hero-image")

    if (heroContent) {
      heroContent.style.opacity = "1"
      heroContent.style.transform = "translateY(0)"
    }

    if (heroImage) {
      heroImage.style.opacity = "1"
      heroImage.style.transform = "translateX(0)"
    }
  }, 100)
})

// Handle window resize
window.addEventListener("resize", () => {
  // Close mobile menu on resize
  if (window.innerWidth > 768 && navMenu) {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  }
})

// Prevent horizontal scroll
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault()
    }
  },
  { passive: false },
)

// Add touch feedback for mobile
if ("ontouchstart" in window) {
  document.querySelectorAll(".btn, .project-card, .certificate-card, .skill-category").forEach((element) => {
    element.addEventListener("touchstart", function () {
      this.style.transform = "scale(0.98)"
    })

    element.addEventListener("touchend", function () {
      this.style.transform = "scale(1)"
    })
  })
}
