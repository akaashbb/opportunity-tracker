/**
 * Format a number in Indian currency style (₹ with lakh/crore)
 */
export function formatCurrency(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '₹0'
  const num = parseFloat(value)
  
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(decimals)} Cr`
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(decimals)} L`
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(decimals)}K`
  }
  return `₹${num.toFixed(0)}`
}

/**
 * Format number in Indian numbering system with commas
 */
export function formatIndian(num) {
  if (!num) return '0'
  const x = num.toString()
  let afterPoint = ''
  let n = x
  if (x.indexOf('.') > 0) {
    afterPoint = x.substring(x.indexOf('.'), x.length)
    n = x.substring(0, x.indexOf('.'))
  }
  let lastThree = n.substring(n.length - 3)
  const otherNumbers = n.substring(0, n.length - 3)
  if (otherNumbers !== '') lastThree = ',' + lastThree
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  return `${parseFloat(value).toFixed(decimals)}%`
}

/**
 * Format date to readable string
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Get color for stage badge
 */
export function getStageColor(stage) {
  const colors = {
    Lead: '#f59e0b',
    Proposal: '#3b82f6',
    Negotiation: '#8b5cf6',
    Won: '#10b981',
    Lost: '#ef4444',
  }
  return colors[stage] || '#6b7280'
}

/**
 * Get color for priority badge
 */
export function getPriorityColor(priority) {
  const colors = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#10b981',
  }
  return colors[priority] || '#6b7280'
}

/**
 * Get color for status badge
 */
export function getStatusColor(status) {
  return status === 'Open' ? '#10b981' : '#6b7280'
}

/**
 * Short label for chart axis (truncate long names)
 */
export function shortLabel(str, max = 12) {
  if (!str) return ''
  return str.length > max ? str.substring(0, max) + '…' : str
}
