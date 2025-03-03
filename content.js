const BASE_SELECTOR = "#main > div.container > div:nth-child(4) > div > div > div.job-details-card.d-flex.gap-0.air3-card.air3-card-outline.p-0";

// Helper function to get text content
function getText(selector) {
  const element = document.querySelector(selector);
  return element ? element.innerText.trim() : "NA";
}

function getJobTitle() {
  return getText(`${BASE_SELECTOR} > div:nth-child(1) > section:nth-child(1) > h4 > span`);
}

function getClientLocation() {
  const selectors = [
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div.cfe-ui-job-about-client.mt-7 > ul > li:nth-child(1) > strong`,
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div > ul > li:nth-child(1) > strong`
  ];

  for (const selector of selectors) {
    const text = getText(selector);
    if (text && text !== "NA") return text;
  }
  return "NA";
}

function getHireRateAndOpenJobs() {
  const text = getText(
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div.cfe-ui-job-about-client.mt-7 > ul > li:nth-child(2) > div`
  );
  let hireRate = "NA";
  let openJobs = "NA";
  if (text !== "NA") {
    const hireRateMatch = text.match(/(\d+)%\s*hire rate/i);
    if (hireRateMatch) hireRate = hireRateMatch[1];
    const openJobsMatch = text.match(/,\s*(\d+)\s*open job[s]?/i);
    if (openJobsMatch) openJobs = openJobsMatch[1];
  }
  return { hireRate, openJobs };
}

function getTotalSpent() {
  let text = getText(
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div.cfe-ui-job-about-client.mt-7 > ul > li:nth-child(3) > strong`
  );
  if (text === "NA") return text;
  text = text.replace(/total spent/i, "").trim();
  const match = text.match(/([\d.,]+)\s*(k)?/i);
  if (match) {
    let num = parseFloat(match[1].replace(/,/g, ""));
    if (match[2]) num = num * 1000;
    return String(num);
  }
  return "NA";
}

function getHiringStats() {
  const selectors = [
    // Primary selector
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div.cfe-ui-job-about-client.mt-7 > ul > li:nth-child(3) > div`,
    // Backup selectors
    `${BASE_SELECTOR} div.client-history span.hiring-stats`,
    `${BASE_SELECTOR} div.client-history div.d-flex`
  ];

  let totalHired = "NA";
  let totalActive = "NA";

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText.trim();
      
      // Check for various hire patterns
      const hiredMatch = text.match(/(\d+)\s+(?:hire|hires|hired)/i) || 
                        text.match(/(\d+)\s+people hired/i);
      if (hiredMatch) totalHired = hiredMatch[1];

      // Check for active hires
      const activeMatch = text.match(/(\d+)\s+active/i) ||
                         text.match(/(\d+)\s+working now/i);
      if (activeMatch) totalActive = activeMatch[1];

      if (totalHired !== "NA" && totalActive !== "NA") break;
    }
  }

  return { totalHired, totalActive };
}

function getClientMemberSince() {
  const selectors = [
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div > ul > li:nth-child(5) > small`,
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div.cfe-ui-job-about-client.mt-7 > ul > li:nth-child(4) > small`,
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div.cfe-ui-job-about-client.mt-7 > ul > li:nth-child(5) > small`,
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections small`
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText.trim();
      const match = text.match(/member since (\d{4})/i) || text.match(/(\d{4})/);
      if (match) return match[1];
    }
  }
  return "NA";
}

function getSkillsAndExpertise() {
  // Try to find the skills section first
  const skillsSection = document.querySelector(`${BASE_SELECTOR} section[data-test="Expertise"]`) ||
                       document.querySelector(`${BASE_SELECTOR} section.air3-card-section:has(h5:contains("Skills and Expertise"))`);
  
  if (skillsSection) {
    // Find all skill badges within the section
    const skillElements = skillsSection.querySelectorAll('a.air3-badge');
    if (skillElements && skillElements.length > 0) {
      const skills = Array.from(skillElements)
        .map(element => element.innerText.trim())
        .filter(text => text && text !== "");
      return skills.length > 0 ? skills : ["NA"];
    }
  }

  // Fallback selectors if the section wasn't found
  const fallbackSelectors = [
    `${BASE_SELECTOR} div[data-test="Skill"] a.air3-badge`,
    `${BASE_SELECTOR} .skills-list .air3-badge`,
    `${BASE_SELECTOR} > div:nth-child(1) > section:nth-child(6) .air3-badge`,
    `${BASE_SELECTOR} > div:nth-child(1) > section:nth-child(5) .air3-badge`
  ];

  for (const selector of fallbackSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements && elements.length > 0) {
      const skills = Array.from(elements)
        .map(element => element.innerText.trim())
        .filter(text => text && text !== "");
      if (skills.length > 0) return skills;
    }
  }

  return ["NA"];
}

function getRatings() {
  const text = getText(
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div.cfe-ui-job-about-client.mt-7 > div.text-light-on-muted.rating.mt-2.mb-4 > span`
  );
  let rating = "NA";
  let totalReviews = "NA";
  if (text !== "NA") {
    if (text.includes(" of ")) {
      const cleanText = text.replace(/\s+/g, " ").trim();
      const parts = cleanText.split(" of ");
      if (parts.length === 2) {
        rating = parts[0].trim();
        totalReviews = parts[1].replace(/ reviews/i, "").trim();
      }
    } else {
      rating = text;
    }
  }
  return { rating, totalReviews };
}

// Add this new function
function getTotalJobsPosted() {
  const selectors = [
    `${BASE_SELECTOR} > div.sidebar.air3-card-sections > section > div.cfe-ui-job-about-client.mt-7 > ul > li:nth-child(2) > strong`,
    `${BASE_SELECTOR} div.client-history span:contains("jobs posted")`
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText.trim();
      const match = text.match(/(\d+)\s*jobs?\s*posted/i);
      if (match) return match[1];
    }
  }
  return "NA";
}

// Update getJobDetails function to handle possible undefined values
function getJobDetails() {
  const { hireRate, openJobs } = getHireRateAndOpenJobs() || {};
  const { totalHired, totalActive } = getHiringStats() || {};
  const ratingsData = getRatings() || {};
  const skills = getSkillsAndExpertise() || ["NA"];

  return {
    jobURL: window.location.href || "NA",
    jobTitle: getJobTitle() || "NA",
    client: {
      location: getClientLocation() || "NA",
      memberSince: getClientMemberSince() || "NA",
      totalJobsPosted: getTotalJobsPosted() || "NA",
      totalSpent: getTotalSpent() || "NA",
      totalHired: totalHired || "NA",
      openJobs: openJobs || "NA",
      totalActive: totalActive || "NA",
      rating: ratingsData.rating || "NA",
      totalReviews: ratingsData.totalReviews || "NA",
      hireRate: hireRate || "NA"
    },
    skillsRequired: skills
  };
}

// Message listener for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractJobDetails") {
    try {
      const jobDetails = getJobDetails();
      sendResponse({ success: true, data: jobDetails });
    } catch (error) {
      console.error('Error extracting job details:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Keep the message channel open for async response
});