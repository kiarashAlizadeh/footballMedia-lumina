// Component for Privacy Page
async function PrivacyPage() {
  const title = 'Privacy | Football Media';
  document.title = title;

  window.clickHandler = function () {
    window.location.href = '/';
  };

  return `
<div class="container">
  <div class="terms">
    <h1>
      Privacy
    </h1>
    <p>
      we collect various types of information from you such as:
    </p>
    <ul class="details">
      <li class="item">
        Your name, email address, and other contact details
      </li>
      <li class="item">
        Your preferences, interests, and feedback
      </li>
      <li class="item">
        Your browsing history, IP address, and device information
      </li>
      <li class="item">
        Your payment information, if you make a purchase on our website
      </li>
    </ul>
    <p>
      We collect this information for the following purposes:
    </p>
    <ul class="details">
      <li class="item">
        To provide you with our products and services
      </li>
      <li class="item">
        To improve our website and user experience
      </li>
      <li class="item">
        To communicate with you and respond to your inquiries
      </li>
      <li class="item">
        To process your orders and transactions
      </li>
      <li class="item">
        To comply with our legal obligations and enforce our policies
      </li>
    </ul>
    <p>
      This policy was last updated on February 7, 2025.
    </p>
  </div>
  <button onclick="clickHandler()">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75">
      </path>
    </svg>
    <div class="text">
      Home
    </div>
  </button>
</div>`;
}

export default PrivacyPage;
