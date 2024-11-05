function hideElements() {
  // Hide elements containing "DataAnnotation" (case-insensitive)
  const dataAnnotationElements = document.evaluate(
    "//text()[contains(translate(., 'DATAANNOTATION', 'dataannotation'), 'dataannotation')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );

  for (let i = 0; i < dataAnnotationElements.snapshotLength; i++) {
    const element = dataAnnotationElements.snapshotItem(i);
    if (element.parentNode) {
      element.parentNode.style.display = "none";
    }
  }

  // Hide strings containing $ sign (except for the payment link)
  const textNodes = document.evaluate(
    "//text()[not(ancestor::a[@href='/workers/payments'])]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );

  for (let i = 0; i < textNodes.snapshotLength; i++) {
    const node = textNodes.snapshotItem(i);
    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes("$")) {
      const span = document.createElement("span");
      span.innerHTML = node.textContent.replace(
        /([^\s]*\$[^\s]*)/g,
        '<span style="display: none;">$1</span>',
      );
      node.parentNode.replaceChild(span, node);
    }
  }

  // Hide specific elements
  const elementsToHide = [
    'a[href="/workers/inbox"]',
    'a[href="/workers/payments"]',
    'a[href="/workers/referrals"]',
    'a.dropdown-toggle[data-toggle="dropdown"]',
    '*[id^="NavbarInboxBadge"]',
    "footer", // Added footer to the list of elements to hide
  ];

  elementsToHide.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = "none";
    }
  });
}

function hidePaymentLink() {
  const paymentLink = document.querySelector(
    'a[href="/workers/payments"] span',
  );
  if (paymentLink) {
    paymentLink.style.display = "none";
  }
}

function waitForElementsAndHide() {
  const observer = new MutationObserver((mutations, obs) => {
    const paymentLink = document.querySelector(
      'a[href="/workers/payments"] span',
    );
    const nameDropdown = document.querySelector(
      'a.dropdown-toggle.text-white[data-toggle="dropdown"]',
    );
    const transferFundsLink = document.querySelector(
      'a.nav-link[href="/workers/payments"]',
    );
    const inboxLink = document.querySelector(
      'a.nav-link[href="/workers/inbox"]',
    );
    const referralsLink = document.querySelector(
      'a.nav-link[href="/workers/referrals"]',
    );

    if (paymentLink) {
      hidePaymentLink();
    }

    if (nameDropdown) {
      nameDropdown.style.display = "none";
    }

    if (inboxLink) {
      inboxLink.style.display = "none";
    }
    if (transferFundsLink) {
      transferFundsLink.style.display = "none";
    }

    if (referralsLink) {
      referralsLink.style.display = "none";
    }

    if (
      paymentLink &&
      nameDropdown &&
      transferFundsLink &&
      referralsLink &&
      inboxLink
    ) {
      obs.disconnect(); // Stop observing once we've hidden all elements
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Run the initial hiding when the page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    hideElements();
    waitForElementsAndHide();
  });
} else {
  hideElements();
  waitForElementsAndHide();
}
