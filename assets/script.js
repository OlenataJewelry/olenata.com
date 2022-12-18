(function (win, doc, nav) {
  function initImageObserver_() {
    var images = Array.from(doc.querySelectorAll(".card .image"));
    if ("IntersectionObserver" in win) {
      var imageObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var image = entry.target;
              image.style.backgroundImage = "url(" + image.dataset.src + ")";
              image.removeAttribute("data-src");
              imageObserver.unobserve(image);
            }
          });
        },
        { rootMargin: "50px 0px", threshold: 0.01 }
      );
      images.forEach(function (img) {
        imageObserver.observe(img);
      });
    }
  }

  function initConsentBanner_() {
    var consentBanner = doc.getElementById("consent-banner");
    if (consentBanner) {
      var button = consentBanner.querySelector("button");
      if (button) {
        button.onclick = function () {
          // 7 days * 24 hours * 60 minutes * 60 seconds = 604800.
          doc.cookie =
            "consent=1; max-age=604800; path=/; samesite=strict; secure";
          consentBanner.style.display = "none";
          initIOSInstallPrompt_(consentBanner);
        };
      }
      if (!doc.cookie.includes("consent=1")) {
        consentBanner.style.display = "block";
      }
    }
    return consentBanner;
  }

  function initIOSInstallPrompt_(consentBanner) {
    var isStandalone =
      ("standalone" in nav && nav.standalone) ||
      win.matchMedia("(display-mode: standalone)").matches;
    if (/ipad|iphone|ipod/.test(nav.userAgent.toLowerCase()) && !isStandalone) {
      if (!(consentBanner && consentBanner.style.display === "block")) {
        var installPrompt = doc.getElementById("ios-pwa-prompt");
        if (installPrompt) {
          installPrompt.style.display = "block";
        }
      }
    }
  }

  function init_() {
    initImageObserver_();
    initIOSInstallPrompt_(initConsentBanner_());
    "serviceWorker" in nav && nav.serviceWorker.register("/sw.js");
    doc
      .querySelectorAll('a[href="' + location.pathname + '"]')
      .forEach(function (link) {
        link.className = "active";
      });
  }

  init_();
})(window, document, navigator);
