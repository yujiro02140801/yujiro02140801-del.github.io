document.addEventListener("DOMContentLoaded", () => {
  setupInfiniteCarousels();
  setupFadeIn();
  setupLightbox();
  setupMouseDrag();
});

function setupInfiniteCarousels() {
  const carousels = document.querySelectorAll(".infinite-carousel");

  carousels.forEach((carousel) => {
    const originalItems = Array.from(carousel.querySelectorAll(".gallery-image"));

    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      carousel.appendChild(clone);
    });

    let isAdjusting = false;

    requestAnimationFrame(() => {
      carousel.scrollLeft = 1;
    });

    carousel.addEventListener("scroll", () => {
      if (isAdjusting) return;

      const halfWidth = carousel.scrollWidth / 2;

      if (carousel.scrollLeft >= halfWidth) {
        isAdjusting = true;
        carousel.scrollLeft -= halfWidth;
        requestAnimationFrame(() => {
          isAdjusting = false;
        });
      } else if (carousel.scrollLeft <= 0) {
        isAdjusting = true;
        carousel.scrollLeft += halfWidth;
        requestAnimationFrame(() => {
          isAdjusting = false;
        });
      }
    });
  });
}

function setupFadeIn() {
  const sections = document.querySelectorAll(".fade-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
    // セクションが最初からビューポート内にある場合は即座にis-visibleを付与
    if (section.getBoundingClientRect().top < window.innerHeight) {
      section.classList.add("is-visible");
    }
  });
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const placeholder =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  document.addEventListener("click", (event) => {
    const clickedImage = event.target.closest(".gallery-image");
    if (!clickedImage) return;

    lightboxImage.src = clickedImage.src;
    lightboxImage.alt = clickedImage.alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  });

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    lightboxImage.src = placeholder;
    lightboxImage.alt = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

function setupMouseDrag() {
  const carousels = document.querySelectorAll(".gallery-row");

  carousels.forEach((carousel) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = false;

    carousel.addEventListener("mousedown", (event) => {
      isDown = true;
      moved = false;
      startX = event.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("mouseleave", () => {
      isDown = false;
    });

    carousel.addEventListener("mouseup", () => {
      isDown = false;
    });

    carousel.addEventListener("mousemove", (event) => {
      if (!isDown) return;

      event.preventDefault();
      const x = event.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.2;

      if (Math.abs(walk) > 5) {
        moved = true;
      }

      carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.addEventListener(
      "click",
      (event) => {
        if (moved) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );
  });
}