(() => {
  "use strict";

  const sidebar = document.querySelector("#sidebar");
  const openButton = document.querySelector("#menuOpen");
  const closeButton = document.querySelector("#menuClose");
  const backdrop = document.querySelector("#drawerBackdrop");

  const navLinks = [...document.querySelectorAll(".nav-link")];
  const title = document.querySelector("#heroTitle");
  const description = document.querySelector("#heroText");
  const sceneLabel = document.querySelector("#sceneLabel");
  const discoverLink = document.querySelector("#discoverLink");

  const mobileQuery = window.matchMedia("(max-width: 640px)");

  const sections = {
    home: {
      title: "Find your<br><em>perspective.</em>",
      text: "Explore moments, places, and ideas worth keeping.",
      label: "01 / HOME",
      discover: "Discover the gallery",
      target: "#gallery"
    },

    gallery: {
      title: "Collect the<br><em>moments.</em>",
      text: "A visual collection of places, details, and stories.",
      label: "02 / GALLERY",
      discover: "Back to the beginning",
      target: "#home"
    },

    shortcuts: {
      title: "Make room for<br><em>discovery.</em>",
      text: "Keep your favorite destinations and creative references close.",
      label: "03 / SHORTCUTS",
      discover: "Explore the gallery",
      target: "#gallery"
    },

    exhibits: {
      title: "Stories worth<br><em>a closer look.</em>",
      text: "A curated space for visual experiments and small discoveries.",
      label: "04 / EXHIBITS",
      discover: "Explore the gallery",
      target: "#gallery"
    },

    events: {
      title: "Meet the world<br><em>in person.</em>",
      text: "Find inspiration in shared experiences and creative gatherings.",
      label: "05 / EVENTS",
      discover: "Get in touch",
      target: "#contact"
    },

    store: {
      title: "Keep a little<br><em>inspiration.</em>",
      text: "Thoughtful objects and prints for people who notice the details.",
      label: "06 / STORE",
      discover: "Get in touch",
      target: "#contact"
    },

    contact: {
      title: "Let's start a<br><em>conversation.</em>",
      text: "Have a question or an idea? We would love to hear from you.",
      label: "07 / CONTACT",
      discover: "Back to the beginning",
      target: "#home"
    },

    feedback: {
      title: "Your view<br><em>matters.</em>",
      text: "Share an idea that could make this space better.",
      label: "08 / FEEDBACK",
      discover: "Get in touch",
      target: "#contact"
    }
  };

  let lastFocusedElement = null;

  function setDrawer(open) {
    const isOpen = sidebar.classList.contains("is-open");

    if (open === isOpen) return;

    if (open) {
      lastFocusedElement = document.activeElement;
    }

    sidebar.classList.toggle("is-open", open);
    sidebar.setAttribute("aria-hidden", String(!open));
    sidebar.inert = !open;

    openButton.setAttribute("aria-expanded", String(open));
    openButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );

    backdrop.hidden = !(open && mobileQuery.matches);

    document.body.classList.toggle(
      "drawer-open",
      open && mobileQuery.matches
    );

    if (open) {
      closeButton.focus({ preventScroll: true });
    } else if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
    } else {
      openButton.focus({ preventScroll: true });
    }
  }

  function renderSection(id) {
    const data = sections[id];

    if (!data) return;

    title.innerHTML = data.title;
    description.textContent = data.text;
    sceneLabel.textContent = data.label;

    discoverLink.textContent = `${data.discover} `;

    const arrow = document.createElement("i");
    arrow.className = "fa-solid fa-arrow-right";
    arrow.setAttribute("aria-hidden", "true");

    discoverLink.append(arrow);
    discoverLink.href = data.target;

    navLinks.forEach((link) => {
      const active = link.hash === `#${id}`;

      link.classList.toggle("is-active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function navigateTo(id) {
    if (!sections[id]) return;

    renderSection(id);
    history.replaceState(null, "", `#${id}`);
  }

  openButton.addEventListener("click", () => {
    setDrawer(!sidebar.classList.contains("is-open"));
  });

  closeButton.addEventListener("click", () => {
    setDrawer(false);
  });

  backdrop.addEventListener("click", () => {
    setDrawer(false);
  });

  document.addEventListener("keydown", (event) => {
    if (!sidebar.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setDrawer(false);
      return;
    }

    if (event.key !== "Tab" || !mobileQuery.matches) return;

    const focusableElements = [
      ...sidebar.querySelectorAll(
        'a[href], button:not([disabled])'
      )
    ].filter((element) => element.getClientRects().length > 0);

    if (!focusableElements.length) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.hash.slice(1);

      if (!sections[id]) return;

      event.preventDefault();
      navigateTo(id);

      if (mobileQuery.matches) {
        setDrawer(false);
      }
    });
  });

  discoverLink.addEventListener("click", (event) => {
    const id = discoverLink.hash.slice(1);

    if (!sections[id]) return;

    event.preventDefault();
    navigateTo(id);
  });

  mobileQuery.addEventListener("change", () => {
    const isOpen = sidebar.classList.contains("is-open");

    backdrop.hidden = !(isOpen && mobileQuery.matches);

    document.body.classList.toggle(
      "drawer-open",
      isOpen && mobileQuery.matches
    );
  });

  // Restore the correct section when loading a URL with a hash.
  const initialSection = location.hash.slice(1);

  if (sections[initialSection]) {
    renderSection(initialSection);
  }
})();