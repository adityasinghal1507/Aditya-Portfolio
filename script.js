console.log("JavaScript connected");
const themeButton = document.getElementById("themeToggle");
if (themeButton) {
  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeButton.textContent = "Switch to Light Mode";
    } else {
      themeButton.textContent = "Switch to Dark Mode";
    }
  });
}
(function () {
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const yearEl = document.getElementById("copyright-year");
  const sectionIds = ["about", "skills", "projects"];

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const links = Array.from(document.querySelectorAll(".site-nav a"));

  function setActiveFromHash() {
    const hash = window.location.hash.replace("#", "");
    links.forEach(function (link) {
      const target = (link.getAttribute("href") || "").replace("#", "");
      link.classList.toggle("is-active", target === hash);
    });
  }

  window.addEventListener("hashchange", setActiveFromHash);
  setActiveFromHash();

  const search = document.getElementById("project-search");
  const projectItems = Array.from(
    document.querySelectorAll(".projects-list > li")
  );
  const techButtons = Array.from(document.querySelectorAll(".tech-filters button"));
  const status = document.getElementById("project-filter-status");
  const empty = document.getElementById("projects-empty");
  let activeTech = "all";

  function projectMatches(item, query, tech) {
    const name = (item.getAttribute("data-name") || "").toLowerCase();
    const techs = (item.getAttribute("data-tech") || "").toLowerCase();
    const body = item.textContent.toLowerCase();
    const q = query.trim().toLowerCase();
    const queryMatch = !q || name.includes(q) || techs.includes(q) || body.includes(q);
    const techList = techs.split(",").map(function (part) {
      return part.trim();
    });
    const techMatch = tech === "all" || techList.indexOf(tech.toLowerCase()) !== -1;
    return queryMatch && techMatch;
  }

  function applyProjectFilters() {
    const query = search ? search.value : "";
    let visible = 0;

    projectItems.forEach(function (item) {
      const show = projectMatches(item, query, activeTech);
      item.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (empty) {
      empty.hidden = visible !== 0;
    }

    if (status) {
      const filtering = Boolean(query.trim()) || activeTech !== "all";
      status.textContent = filtering
        ? visible + " project" + (visible === 1 ? "" : "s") + " found"
        : "";
    }
  }

  if (search) {
    search.addEventListener("input", applyProjectFilters);
  }

  techButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeTech = button.getAttribute("data-tech") || "all";
      techButtons.forEach(function (other) {
        other.setAttribute(
          "aria-pressed",
          String(other === button)
        );
      });
      applyProjectFilters();
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          const id = entry.target.id;
          links.forEach(function (link) {
            const target = (link.getAttribute("href") || "").replace("#", "");
            link.classList.toggle("is-active", target === id);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });
  }
})();
