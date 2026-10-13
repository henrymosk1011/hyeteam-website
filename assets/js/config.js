/* =========================================================
   HyeTeam site settings
   Change the values below. Nothing else needs to be edited.
   ========================================================= */
window.HYETEAM_CONFIG = {
  /* The contact form and the Virtual Assistant application are emailed to
     this address through FormSubmit (formsubmit.co). The very first message
     sent from the live site triggers a one time "Activate Form" email to this
     inbox. Click it once and every message after that is delivered. */
  formEmail: 'info@hyeteam.com',

  /* Google Analytics 4 measurement ID, for example 'G-AB12CD34EF'.
     Leave it empty to keep analytics turned off. */
  gaMeasurementId: ''
};

/* Google Analytics loads only when a measurement ID is set above. */
(function () {
  var id = window.HYETEAM_CONFIG.gaMeasurementId;
  if (!id) return;
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(tag);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
})();
