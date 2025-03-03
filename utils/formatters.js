export const formatHireRate = (hireRate) => {
  if (!hireRate) return 'NA';
  const cleaned = hireRate.replace('%', '');
  const num = parseFloat(cleaned);
  return num > 100 ? (num / 100).toString() : cleaned;
};

export const formatExcelData = (data) => {
  if (!data) return '';
  
  return [
    data.jobURL || 'NA',
    data.jobTitle || 'NA',
    `"${data.skillsRequired.join(", ")}"` || 'NA',
    'NA',
    data.client.location || 'NA',
    'NA',
    data.client.memberSince || 'NA',
    data.client.totalJobsPosted || 'NA',
    data.client.totalHired || 'NA',
    data.client.openJobs || 'NA',
    data.client.totalActive || 'NA',
    data.client.totalSpent || 'NA',
    data.client.rating || 'NA',
    data.client.totalReviews || 'NA',
    formatHireRate(data.client.hireRate)
  ].join('\t');
};