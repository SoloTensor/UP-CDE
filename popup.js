import { LABELS, SELECTORS } from './utils/constants.js';
import { formatExcelData } from './utils/formatters.js';

class PopupManager {
  constructor() {
    this.elements = {
      copyButton: document.querySelector(SELECTORS.copyButton),
      resetButton: document.querySelector(SELECTORS.resetButton),
      jobDetails: document.querySelector(SELECTORS.jobDetails)
    };
    this.initialize();
  }

  initialize() {
    this.loadJobDetails();
    this.elements.copyButton.addEventListener('click', () => this.handleCopy());
    this.elements.resetButton.addEventListener('click', () => this.handleReset());
  }

  async loadJobDetails() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { action: "extractJobDetails" });
      
      if (response?.success && response.data) {
        this.updateDisplay(response.data);
      } else {
        this.showError('Failed to extract job details');
      }
    } catch (error) {
      this.showError(error.message);
    }
  }

  updateDisplay(data) {
    const displayData = Object.entries(LABELS).map(([key, label]) => ({
      label,
      value: key === 'skillsRequired' ? data[key].join(", ") : data[key] || data.client?.[key]
    }));

    this.elements.jobDetails.innerHTML = displayData
      .map(item => `
        <div class="detail-row">
          <div class="detail-label">${item.label}:</div>
          <div class="detail-value">${item.value || 'NA'}</div>
        </div>
      `).join('');

    this.elements.jobDetails.dataset.rawData = formatExcelData(data);
  }

  async handleCopy() {
    try {
      await navigator.clipboard.writeText(this.elements.jobDetails.dataset.rawData);
      this.showCopyFeedback();
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  showCopyFeedback() {
    this.elements.copyButton.textContent = "Copied!";
    setTimeout(() => {
      this.elements.copyButton.textContent = "Copy Data";
    }, 1000);
  }

  handleReset() {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.reload(tab.id);
    });
  }

  showError(message) {
    console.error(message);
    this.elements.jobDetails.innerHTML = `<div class="error">${message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => new PopupManager());