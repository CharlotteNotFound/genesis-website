(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const inquiry = params.get("inquiry");
  const product = params.get("product");
  const inquiryField = form.elements.inquiry_type;
  const productField = form.elements.product_interest;
  const status = document.querySelector("[data-form-status]");
  const submitButton = form.querySelector("[data-submit-button]");
  const submitLabel = form.querySelector("[data-submit-label]");
  const success = document.querySelector("[data-contact-success]");
  const endpoint = "https://formsubmit.co/ajax/leo@leacharm.com";

  if (inquiry && [...inquiryField.options].some((option) => option.value === inquiry)) inquiryField.value = inquiry;
  if (product) productField.value = product;

  const requiredFields = [...form.querySelectorAll("[required]")];
  const errorFor = (field) => document.getElementById(`${field.id}-error`);

  function fieldIsValid(field) {
    if (field.type === "checkbox") return field.checked;
    if (!field.value.trim()) return false;
    if (field.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    return true;
  }

  function validateField(field) {
    const valid = fieldIsValid(field);
    const error = errorFor(field);
    field.setAttribute("aria-invalid", String(!valid));
    if (error) error.textContent = valid ? "" : field.dataset.error || "Complete this field.";
    return valid;
  }

  requiredFields.forEach((field) => {
    field.addEventListener(field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  function setSubmitting(submitting) {
    submitButton.disabled = submitting;
    submitButton.setAttribute("aria-busy", String(submitting));
    submitLabel.textContent = submitting ? "Sending request…" : "Send project request";
    status.classList.remove("form-status--error");
  }

  function submissionPayload() {
    const data = new FormData(form);
    return {
      _subject: `New Genesis website enquiry · ${data.get("inquiry_type") || "General request"}`,
      _template: "table",
      _captcha: "false",
      _honey: data.get("_honey") || "",
      "Request type": data.get("inquiry_type") || "",
      "Product or system": data.get("product_interest") || "Not specified",
      "Full name": data.get("full_name") || "",
      email: data.get("email") || "",
      Company: data.get("company") || "",
      Role: data.get("role") || "Not specified",
      Phone: data.get("phone") || "Not specified",
      "Country or region": data.get("country") || "",
      "Project name": data.get("project_name") || "Not specified",
      "Project stage": data.get("project_stage") || "Not specified",
      Message: data.get("message") || "",
      Consent: data.get("consent") ? "Confirmed" : "Not confirmed",
      "Submitted from": window.location.href
    };
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const invalid = requiredFields.filter((field) => !validateField(field));
    if (invalid.length) {
      status.textContent = "Please review the highlighted fields.";
      status.classList.add("form-status--error");
      invalid[0].focus();
      return;
    }

    setSubmitting(true);
    status.textContent = "Securely sending your request…";

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      let response;
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(submissionPayload()),
          signal: controller.signal
        });
      } finally {
        window.clearTimeout(timeout);
      }

      const result = await response.json().catch(() => ({}));
      const accepted = result.success === true || result.success === "true";
      if (!response.ok || !accepted) {
        throw new Error(result.message || "The delivery service did not accept the request.");
      }

      status.textContent = "";
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      status.textContent = error.name === "AbortError"
        ? "Delivery timed out. Your information is still here—please try again."
        : "We could not deliver the request. Your information is still here—please try again.";
      status.classList.add("form-status--error");
    } finally {
      setSubmitting(false);
    }
  });

  document.querySelector("[data-new-request]")?.addEventListener("click", () => {
    form.reset();
    if (inquiry && [...inquiryField.options].some((option) => option.value === inquiry)) inquiryField.value = inquiry;
    if (product) productField.value = product;
    requiredFields.forEach((field) => {
      field.removeAttribute("aria-invalid");
      const error = errorFor(field);
      if (error) error.textContent = "";
    });
    success.hidden = true;
    form.hidden = false;
    status.textContent = "";
    status.classList.remove("form-status--error");
    form.querySelector("input, select, textarea").focus();
  });
})();
