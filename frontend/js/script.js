document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("toggle");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("toggle");
      });
    });
  }

  // 2. Animated Counter Numbers
  const statNumbers = document.querySelectorAll(".stat-number");
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 1500;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = target + "+";
          clearInterval(timer);
        } else {
          counter.innerText = Math.ceil(current) + "+";
        }
      }, stepTime);
    });
  };

  const aboutSection = document.querySelector(".about-section");
  if (aboutSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          animateCounters();
          animated = true;
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(aboutSection);
  }

  // 3. Project Filter Gallery
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // 4. Lightbox Popup Modal
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (lightboxModal && lightboxImg && lightboxClose) {
    document.querySelectorAll(".gallery-card").forEach((card) => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img");
        const title = card.querySelector("h3") ? card.querySelector("h3").innerText : "";
        const desc = card.querySelector("p") ? card.querySelector("p").innerText : "";

        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = `<strong>${title}</strong> — ${desc}`;
        lightboxModal.style.display = "flex";
      });
    });

    lightboxClose.addEventListener("click", () => {
      lightboxModal.style.display = "none";
    });

    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.style.display = "none";
      }
    });
  }

  // 5. Smooth Scroll for CTA buttons
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 6. Contact Form Validation & API Submission to Node/MongoDB Backend
  const enquiryForm = document.getElementById("enquiryForm");
  const formSuccess = document.getElementById("formSuccess");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const phone = document.getElementById("phone");
      const projectType = document.getElementById("projectType");
      const budget = document.getElementById("budget");
      const message = document.getElementById("message");

      // Reset Error Messages
      document.querySelectorAll(".error-msg").forEach((el) => (el.style.display = "none"));

      // Validations
      if (!name || name.value.trim() === "") {
        document.getElementById("nameError").style.display = "block";
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        document.getElementById("emailError").style.display = "block";
        isValid = false;
      }

      if (!phone || phone.value.trim().length < 8) {
        document.getElementById("phoneError").style.display = "block";
        isValid = false;
      }

      if (!projectType || projectType.value === "") {
        document.getElementById("typeError").style.display = "block";
        isValid = false;
      }

      if (!budget || budget.value === "") {
        document.getElementById("budgetError").style.display = "block";
        isValid = false;
      }

      // If validation succeeds, send data to backend API
      if (isValid) {
        const formData = {
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          projectType: projectType.value,
          budget: budget.value,
          message: message ? message.value.trim() : ""
        };

        try {
          const response = await fetch("http://localhost:5000/api/enquiries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });

          const data = await response.json();

          if (response.ok && data.success) {
            formSuccess.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${data.message}`;
            formSuccess.style.display = "block";
            enquiryForm.reset();
            setTimeout(() => {
              formSuccess.style.display = "none";
            }, 5000);
          } else {
            alert(data.message || "Something went wrong. Please try again.");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("Unable to connect to server. Please ensure backend server is running on port 5000.");
        }
      }
    });
  }
});