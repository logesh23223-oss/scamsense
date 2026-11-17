/**
 * Smart Consumer Protection and Online Scam Awareness Platform
 * Core Logic Module (Beginner-Friendly Vanilla JavaScript)
 *
 * Note: This module contains pure analysis functions and educational datasets.
 * All checks run locally in your browser — no messages or URLs are stored or sent anywhere.
 */

export const EXAMPLE_MESSAGES = [
  {
    label: 'Fake Bank KYC Block',
    text: 'URGENT: Dear customer, your SBI bank account will be blocked today due to incomplete KYC. Update your PAN and share OTP immediately at http://sbi-kyc-verify.xyz/login to avoid suspension.'
  },
  {
    label: 'Fake Job Registration Fee',
    text: 'Congratulations! You are shortlisted for a work-from-home data entry job paying Rs. 35,000/month. Pay a refundable registration fee of Rs. 999 via UPI ID hr-recruit@ybl within 2 hours to confirm your seat.'
  },
  {
    label: 'Lottery Prize Trap',
    text: 'CONGRATULATIONS! Your mobile number has won Rs. 25,00,000 in the Mega Lucky Draw! Send your bank account number, IFSC code, and Rs. 2,500 processing fee to claim your prize now: bit.ly/claim-prize-2026'
  }
];

export const EXAMPLE_URLS = [
  {
    label: 'IP + KYC Impersonation',
    url: 'http://192.168.45.12/sbi-kyc-update/verify-otp'
  },
  {
    label: 'Shortened Link',
    url: 'https://bit.ly/free-cashback-claim'
  },
  {
    label: 'Misleading Subdomain',
    url: 'https://hdfcbank.login-verify-account.xyz/update-pan'
  }
];

/**
 * Warning rules used by the Scam Message Checker.
 * Each rule checks for simple keyword or pattern matches and explains why it matters.
 */
const MESSAGE_RULES = [
  {
    id: 'otp_request',
    title: 'OTP or Verification Code Request',
    severity: 'high',
    patterns: [
      /\botp\b/i,
      /one[\s-]?time\s+password/i,
      /verification\s+code/i,
      /share\s+(the\s+)?code/i,
      /send\s+(your\s+)?code/i
    ],
    explanation:
      'Legitimate banks, payment apps, and support teams never ask you to share an OTP or verification code to cancel a charge, complete KYC, or receive money.'
  },
  {
    id: 'password_pin_request',
    title: 'Password, PIN, or Card Secret Request',
    severity: 'high',
    patterns: [
      /\bpassword\b/i,
      /\bpasscode\b/i,
      /\bupi\s*pin\b/i,
      /\bmpin\b/i,
      /\batm\s*pin\b/i,
      /\bcvv\b/i,
      /login\s+credentials/i,
      /enter\s+pin/i
    ],
    explanation:
      'Passwords, UPI PINs, ATM PINs, and CVV numbers are strictly private. Asking for them via SMS, chat, or an external link is a classic sign of credential theft.'
  },
  {
    id: 'account_blocking',
    title: 'Account-Blocking or Suspension Threat',
    severity: 'high',
    patterns: [
      /account\s+(will\s+be\s+|has\s+been\s+)?(blocked|suspended|frozen|deactivated|closed)/i,
      /kyc\s+(is\s+)?(pending|expired|incomplete|suspended|update)/i,
      /update\s+(your\s+)?(kyc|pan)/i,
      /sim\s+(will\s+be\s+)?blocked/i,
      /electricity\s+(will\s+be\s+)?disconnected/i
    ],
    explanation:
      'Scammers create fear that your bank account, SIM card, or utility service will stop working today so that you panic and click a link without checking.'
  },
  {
    id: 'urgent_language',
    title: 'High-Urgency Pressure Language',
    severity: 'medium',
    patterns: [
      /\burgent\b/i,
      /\bimmediately\b/i,
      /within\s+\d+\s+(hours?|hrs?|minutes?|mins?)/i,
      /\bact\s+now\b/i,
      /\blast\s+chance\b/i,
      /\bfinal\s+(warning|notice|reminder)\b/i,
      /expire[sd]?\s+today/i
    ],
    explanation:
      'Artificial deadlines ("act within 2 hours", "expires today") are designed to rush you before you can verify the claim with family or official customer care.'
  },
  {
    id: 'prize_claims',
    title: 'Unexpected Prize, Lottery, or Reward Claim',
    severity: 'medium',
    patterns: [
      /\blottery\b/i,
      /\blucky\s+draw\b/i,
      /\bwon\s+(rs\.?|inr|₹|\$)?\s*\d+/i,
      /you\s+(have\s+)?won\b/i,
      /\bprize\s+(money|claim)\b/i,
      /\bcongratulations\b.*\b(won|prize|reward|cashback|selected)\b/i,
      /claim\s+(your\s+)?(reward|prize|cashback|gift)/i
    ],
    explanation:
      'Messages claiming you won a lottery, lucky draw, or big cash prize you never entered are commonly used to steal personal details or upfront fees.'
  },
  {
    id: 'registration_fee',
    title: 'Upfront Registration or Processing Fee Request',
    severity: 'high',
    patterns: [
      /registration\s+fee/i,
      /processing\s+fee/i,
      /security\s+deposit/i,
      /joining\s+fee/i,
      /pay\s+to\s+claim/i,
      /refundable\s+fee/i,
      /verification\s+charge/i
    ],
    explanation:
      'Genuine employers and prize contests do not require you to pay a "registration", "processing", or "refundable" fee before giving you a job or reward.'
  },
  {
    id: 'suspicious_links',
    title: 'Embedded or Shortened Web Link',
    severity: 'medium',
    patterns: [
      /https?:\/\/[^\s]+/i,
      /\b(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy|is\.gd|goo\.gl)\/[^\s]+/i,
      /\bwww\.[^\s]+/i
    ],
    explanation:
      'Unfamiliar or shortened links inside SMS and chat messages can lead to lookalike websites built to steal login details or install harmful apps.'
  },
  {
    id: 'banking_info',
    title: 'Banking or Identity Details Request',
    severity: 'high',
    patterns: [
      /bank\s+(account\s+)?(details|number)/i,
      /\bifsc\b/i,
      /\bdebit\s+card\b/i,
      /\bcredit\s+card\b/i,
      /\bnet\s*banking\b/i,
      /\baadhaar\s+(number|card|details)\b/i,
      /\bpan\s+(card|number|details)\b/i
    ],
    explanation:
      'Requests asking you to reply with or submit bank account numbers, card numbers, IFSC, PAN, or Aadhaar details over messages pose an identity and financial theft risk.'
  },
  {
    id: 'payment_request',
    title: 'Unexpected Payment or UPI Request',
    severity: 'high',
    patterns: [
      /approve\s+(the\s+)?(collect|upi|payment)/i,
      /scan\s+(the\s+)?qr\s+(code\s+)?to\s+receive/i,
      /enter\s+(upi\s+)?pin\s+to\s+receive/i,
      /send\s+(money|rs\.?|inr|₹)/i,
      /pay\s+(rs\.?|inr|₹)\s*\d+/i,
      /upi\s+request/i
    ],
    explanation:
      'You never need to enter a UPI PIN, scan a QR code, or approve a collect request to RECEIVE money. Those steps only send money out of your account.'
  }
];

/**
 * Analyses a suspicious SMS, email, or chat message against common warning signs.
 * @param {string} rawMessage
 */
export function analyzeMessage(rawMessage) {
  const text = typeof rawMessage === 'string' ? rawMessage.trim() : '';

  if (!text) {
    return {
      isValid: false,
      error: 'Please paste a message in the text box before running the check.'
    };
  }

  const detectedIndicators = [];

  for (const rule of MESSAGE_RULES) {
    const matched = rule.patterns.some((pattern) => pattern.test(text));
    if (matched) {
      detectedIndicators.push({
        id: rule.id,
        title: rule.title,
        severity: rule.severity,
        explanation: rule.explanation
      });
    }
  }

  const highSeverityCount = detectedIndicators.filter((item) => item.severity === 'high').length;
  const totalCount = detectedIndicators.length;

  let riskLevel = 'low';
  let riskLabel = 'No Listed Warning Indicators Found';
  let summaryNote =
    'No listed warning indicators found; this does not guarantee safety. Always verify unexpected messages independently before clicking links or sharing information.';

  if (totalCount >= 3 || highSeverityCount >= 2 || (highSeverityCount === 1 && totalCount >= 2)) {
    riskLevel = 'high';
    riskLabel = 'High Warning Level';
    summaryNote =
      'Multiple strong scam warning signs were detected. Treat this message with extreme caution and do not click links, share codes, or send money.';
  } else if (totalCount >= 1) {
    riskLevel = 'medium';
    riskLabel = 'Medium Warning Level';
    summaryNote =
      'One or more warning indicators were detected. Pause and verify the sender independently through an official website or trusted phone number.';
  }

  const recommendations =
    totalCount > 0
      ? [
          'Do not click any links or call phone numbers listed inside the suspicious message.',
          'Never share an OTP, UPI PIN, ATM PIN, CVV, or password with anyone.',
          'Verify independently by opening your bank or service provider’s official app or typing their known website address yourself.',
          'If you already shared banking credentials or lost money, call India’s Cyber Fraud Helpline 1930 immediately.'
        ]
      : [
          'Even without matching keywords, check who actually sent the message and whether you expected it.',
          'Avoid clicking unfamiliar links; visit official websites directly by typing the address in your browser.',
          'Never share OTPs, PINs, or passwords, even if a message sounds polite or official.'
        ];

  return {
    isValid: true,
    error: null,
    riskLevel,
    riskLabel,
    indicatorCount: totalCount,
    indicators: detectedIndicators,
    recommendations,
    summaryNote
  };
}

/**
 * Trusted official root domains mapped to commonly impersonated Indian & global brands.
 * Used strictly as a local educational check to spot mismatching domains.
 */
const BRAND_OFFICIAL_DOMAINS = [
  { keyword: 'sbi', label: 'SBI', officialDomains: ['sbi.co.in', 'onlinesbi.sbi'] },
  { keyword: 'hdfc', label: 'HDFC Bank', officialDomains: ['hdfcbank.com'] },
  { keyword: 'icici', label: 'ICICI Bank', officialDomains: ['icicibank.com'] },
  { keyword: 'axis', label: 'Axis Bank', officialDomains: ['axisbank.com'] },
  { keyword: 'kotak', label: 'Kotak Bank', officialDomains: ['kotak.com'] },
  { keyword: 'paytm', label: 'Paytm', officialDomains: ['paytm.com'] },
  { keyword: 'phonepe', label: 'PhonePe', officialDomains: ['phonepe.com'] },
  { keyword: 'gpay', label: 'Google Pay', officialDomains: ['pay.google.com', 'google.com'] },
  { keyword: 'npci', label: 'NPCI', officialDomains: ['npci.org.in'] },
  { keyword: 'uidai', label: 'UIDAI / Aadhaar', officialDomains: ['uidai.gov.in'] },
  { keyword: 'aadhaar', label: 'UIDAI / Aadhaar', officialDomains: ['uidai.gov.in'] },
  { keyword: 'irctc', label: 'IRCTC', officialDomains: ['irctc.co.in'] },
  { keyword: 'indiapost', label: 'India Post', officialDomains: ['indiapost.gov.in'] },
  { keyword: 'amazon', label: 'Amazon', officialDomains: ['amazon.in', 'amazon.com'] },
  { keyword: 'flipkart', label: 'Flipkart', officialDomains: ['flipkart.com'] },
  { keyword: 'rbi', label: 'RBI', officialDomains: ['rbi.org.in'] }
];

const SHORTENER_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'cutt.ly',
  'rb.gy',
  'is.gd',
  'goo.gl',
  'ow.ly',
  'shorturl.at'
];

const HIGH_RISK_TLDS = ['.xyz', '.top', '.click', '.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.club', '.icu'];

const SUSPICIOUS_PATH_WORDS = ['kyc', 'verify', 'otp', 'claim', 'prize', 'lottery', 'refund', 'update-pan', 'suspend', 'blocked'];

/**
 * Helper to verify if a hostname matches an official root domain or its valid subdomain.
 */
function matchesOfficialDomain(hostname, officialDomains) {
  return officialDomains.some(
    (domain) => hostname === domain || hostname.endsWith('.' + domain)
  );
}

/**
 * Checks a submitted URL for common suspicious surface characteristics.
 * Never fetches, opens, or visits the submitted URL.
 * @param {string} rawInput
 */
export function analyzeUrl(rawInput) {
  const trimmed = typeof rawInput === 'string' ? rawInput.trim() : '';

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a website URL to inspect.'
    };
  }

  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid URL format: website addresses cannot contain spaces.'
    };
  }

  // Require an explicit protocol or evaluate cleanly if user omitted scheme
  const hasExplicitProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed);
  const candidate = hasExplicitProtocol ? trimmed : 'https://' + trimmed;

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format. Please enter a complete web address such as https://example.com'
    };
  }

  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== 'http:' && protocol !== 'https:') {
    return {
      isValid: false,
      error: `Unsupported URL protocol (${protocol}). Only http:// and https:// web links are supported.`
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullPath = (parsed.pathname + parsed.search).toLowerCase();

  // Check if hostname looks like a real domain or IP address
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const isIpv4 = ipv4Regex.test(hostname);
  const isIpv6 = hostname.startsWith('[') && hostname.endsWith(']');
  const isIpAddress = isIpv4 || isIpv6;

  if (!isIpAddress && (!hostname.includes('.') || hostname.startsWith('.') || hostname.endsWith('.'))) {
    return {
      isValid: false,
      error: 'Invalid URL format: the domain name appears incomplete (missing a valid domain extension like .com or .in).'
    };
  }

  if (isIpv4) {
    const octetsValid = hostname.split('.').every((part) => Number(part) >= 0 && Number(part) <= 255);
    if (!octetsValid) {
      return {
        isValid: false,
        error: 'Invalid URL format: the IP address numbers are out of range.'
      };
    }
  }

  const indicators = [];

  if (!hasExplicitProtocol) {
    indicators.push({
      title: 'Missing http:// or https:// Prefix in Input',
      severity: 'medium',
      explanation:
        'You pasted a link without https:// or http://. When checking a link from an SMS or email, always inspect the exact protocol it uses.'
    });
  } else if (protocol === 'http:') {
    indicators.push({
      title: 'Unencrypted Connection (HTTP instead of HTTPS)',
      severity: 'medium',
      explanation:
        'This link uses http:// instead of https://. Genuine banking, shopping, and login pages always encrypt traffic with HTTPS.'
    });
  }

  if (isIpAddress) {
    indicators.push({
      title: 'IP-Address-Based Website URL',
      severity: 'high',
      explanation:
        'Legitimate companies and banks use official domain names (e.g., onlinesbi.sbi), not raw numerical IP addresses. IP-based public links are a strong phishing indicator.'
    });
  }

  if (parsed.username || parsed.password || trimmed.includes('@')) {
    indicators.push({
      title: 'Unusual "@" Symbol or Embedded Credentials in URL',
      severity: 'high',
      explanation:
        'An "@" symbol in a web link can trick users: browsers ignore everything before "@" and actually open the domain written after it.'
    });
  }

  if (hostname.includes('xn--')) {
    indicators.push({
      title: 'Encoded International Characters (Punycode "xn--")',
      severity: 'high',
      explanation:
        'Domains starting with "xn--" can disguise lookalike foreign characters to mimic trusted brand names visually.'
    });
  }

  const hyphenCount = (hostname.match(/-/g) || []).length;
  const labelCount = hostname.split('.').length;
  if (hyphenCount >= 3 || labelCount >= 4) {
    indicators.push({
      title: 'Unusual Subdomain or Hyphen Structure',
      severity: 'medium',
      explanation:
        'Scammers often stack trusted words as subdomains or hyphenated prefixes (like bankname.verify-login.example) while the real owner is the final part of the domain.'
    });
  }

  if (SHORTENER_DOMAINS.some((shortener) => hostname === shortener || hostname.endsWith('.' + shortener))) {
    indicators.push({
      title: 'Shortened URL Hiding Final Destination',
      severity: 'medium',
      explanation:
        'URL shorteners hide the actual website you will land on. Avoid clicking shortened links in unexpected SMS, WhatsApp, or email messages.'
    });
  }

  if (HIGH_RISK_TLDS.some((tld) => hostname.endsWith(tld))) {
    indicators.push({
      title: 'Uncommon or Frequently Abused Domain Extension',
      severity: 'medium',
      explanation:
        'While some legitimate sites use extensions like .xyz or .top, low-cost extensions are heavily used for temporary phishing pages impersonating banks and stores.'
    });
  }

  // Check brand impersonation (only flag if the domain is NOT the brand's official domain)
  for (const brand of BRAND_OFFICIAL_DOMAINS) {
    const combinedText = hostname + ' ' + fullPath;
    if (combinedText.includes(brand.keyword) && !matchesOfficialDomain(hostname, brand.officialDomains)) {
      indicators.push({
        title: `Possible ${brand.label} Name on Non-Official Domain`,
        severity: 'high',
        explanation: `The link mentions "${brand.keyword}", but the domain (${hostname}) does not match ${brand.label}'s official domain (${brand.officialDomains.join(' / ')}).`
      });
      break;
    }
  }

  // Check common phishing lookalike digit-for-letter tricks (e.g., paypa1, amaz0n, g00gle)
  if (/(paypa1|amaz0n|g00gle|f1ipkart|hdfc0|sb1)/i.test(hostname)) {
    indicators.push({
      title: 'Lookalike Character Substitution in Domain',
      severity: 'high',
      explanation:
        'Replacing letters with digits (such as "0" for "o" or "1" for "l") is a common typosquatting technique used to imitate known brands.'
    });
  }

  const matchedPathWords = SUSPICIOUS_PATH_WORDS.filter((word) => fullPath.includes(word));
  if (matchedPathWords.length > 0 && !BRAND_OFFICIAL_DOMAINS.some((b) => matchesOfficialDomain(hostname, b.officialDomains))) {
    indicators.push({
      title: 'Urgency or Verification Keywords in Web Path',
      severity: 'medium',
      explanation:
        `The web path contains action words (${matchedPathWords.join(', ')}) commonly used in fake KYC, refund, or prize-claim links.`
    });
  }

  const highCount = indicators.filter((item) => item.severity === 'high').length;
  const totalCount = indicators.length;

  let riskLevel = 'low';
  let riskLabel = 'No Listed Surface Warning Indicators Found';
  let summaryNote =
    'No listed surface warning indicators were detected in this URL format; however, this local check cannot verify website reputation or safety. Never enter sensitive details on unfamiliar sites.';

  if (highCount >= 1 || totalCount >= 3) {
    riskLevel = 'high';
    riskLabel = 'High Warning Level';
    summaryNote =
      'This URL shows strong suspicious structural signs. Do not open this link or enter any personal, banking, or login information.';
  } else if (totalCount >= 1) {
    riskLevel = 'medium';
    riskLabel = 'Medium Warning Level';
    summaryNote =
      'This URL shows unusual characteristics. Verify the official web address independently before visiting.';
  }

  return {
    isValid: true,
    error: null,
    parsedUrl: {
      protocol: protocol.replace(':', '').toUpperCase(),
      hostname,
      pathname: parsed.pathname || '/'
    },
    riskLevel,
    riskLabel,
    indicatorCount: totalCount,
    indicators,
    recommendations: [
      'Always read the domain name right before the first single "/" — that is the true website owner.',
      'For banks, government portals (.gov.in), or shopping apps, type the official address manually or use the official mobile app.',
      'This tool performs surface structural checks only and does not visit the website or verify its complete reputation.'
    ],
    summaryNote
  };
}

/**
 * Educational Scam Awareness Library (8 Core Categories)
 */
export const SCAM_LIBRARY = [
  {
    id: 'phishing',
    category: 'identity',
    categoryLabel: 'Links & Identity',
    name: 'Phishing Scams',
    icon: 'mail-warning',
    shortExplanation:
      'Fake emails, SMS messages, or lookalike websites pretending to be your bank, courier, or government service to steal passwords and personal details.',
    warningSigns: [
      'Urgent threats that your account or KYC will be closed today.',
      'Sender email or website domain slightly misspelled (e.g., sbi-verify.xyz).',
      'Links asking you to log in immediately to fix a problem.'
    ],
    example:
      'An SMS reads: "Your bank KYC is suspended. Click bit.ly/kyc-fix-now and enter your netbanking login and OTP within 2 hours."',
    preventionTips: [
      'Never log in through a link sent in an SMS or email.',
      'Check the exact website domain name carefully before typing any details.',
      'Contact your bank using the customer care number printed on the back of your debit card.'
    ]
  },
  {
    id: 'upi-scams',
    category: 'financial',
    categoryLabel: 'Financial & Payment',
    name: 'UPI Payment Scams',
    icon: 'smartphone',
    shortExplanation:
      'Tricks where fraudsters send a "Collect Request" or QR code claiming you need to approve it or enter your UPI PIN to receive money.',
    warningSigns: [
      'Buyer on an online marketplace insists on sending a QR code for you to scan to "receive" payment.',
      'You receive a payment collect notification asking for your UPI PIN.',
      'Caller pressures you to complete the transaction quickly while staying on the phone.'
    ],
    example:
      'You list a sofa for sale. A buyer sends a QR code and says: "Scan this and enter your UPI PIN to receive Rs. 8,000 in your account."',
    preventionTips: [
      'Remember the golden rule: you NEVER enter your UPI PIN or scan a QR code to receive money.',
      'Read every UPI prompt carefully — check whether it says "Pay" or "Receive".',
      'Decline unexpected collect requests immediately.'
    ]
  },
  {
    id: 'fake-shopping',
    category: 'jobs-shopping',
    categoryLabel: 'Shopping & Offers',
    name: 'Fake Shopping Websites',
    icon: 'shopping-bag',
    shortExplanation:
      'Fraudulent online stores advertising luxury gadgets, clothes, or appliances at unbelievably low prices that take your money and never deliver.',
    warningSigns: [
      'Prices 70–90% lower than every trusted store.',
      'No Cash-on-Delivery option; demands advance UPI or card payment.',
      'Missing physical address, fake customer reviews, or newly created website.'
    ],
    example:
      'A social media ad promotes brand-new wireless earbuds worth Rs. 15,000 for Rs. 799 with a "90% Flash Sale ending in 5 minutes" timer.',
    preventionTips: [
      'Compare prices on well-known, established shopping platforms.',
      'Check the return policy, contact details, and independent reviews before paying.',
      'Prefer Cash-on-Delivery or trusted payment gateways when trying an unfamiliar store.'
    ]
  },
  {
    id: 'fake-jobs',
    category: 'jobs-shopping',
    categoryLabel: 'Shopping & Offers',
    name: 'Fake Job Offers',
    icon: 'briefcase',
    shortExplanation:
      'Scammers promising high-paying remote jobs, part-time liking/rating tasks, or guaranteed placements in exchange for an upfront "registration" or "training" fee.',
    warningSigns: [
      'High salary offered for simple tasks with no proper interview.',
      'Asked to pay a registration fee, laptop deposit, or ID card fee.',
      'Communication comes only from free email addresses or messaging apps.'
    ],
    example:
      'A WhatsApp message offers Rs. 3,000/day for liking videos, then asks you to deposit Rs. 5,000 into a "task wallet" to unlock higher earnings.',
    preventionTips: [
      'Legitimate employers never ask candidates to pay money to get hired.',
      'Verify job openings on the company’s official careers website.',
      'Never transfer money for "prepaid tasks" or security deposits.'
    ]
  },
  {
    id: 'lottery-prize',
    category: 'financial',
    categoryLabel: 'Financial & Payment',
    name: 'Lottery and Prize Scams',
    icon: 'award',
    shortExplanation:
      'Messages or calls congratulating you on winning a large cash prize, car, or lucky draw you never entered, then demanding taxes or processing charges.',
    warningSigns: [
      'You never bought a ticket or entered any contest.',
      'Asked to pay "GST", "processing fee", or "courier charges" upfront.',
      'Requests for bank account details and Aadhaar/PAN photos to release funds.'
    ],
    example:
      'An email claims you won Rs. 25 lakh in a telecom lucky draw and asks for Rs. 4,500 as a government clearance fee before transferring the prize.',
    preventionTips: [
      'If you did not enter a competition, you cannot win it.',
      'Never pay money to claim a supposed prize.',
      'Block and report unsolicited lottery messages.'
    ]
  },
  {
    id: 'identity-theft',
    category: 'identity',
    categoryLabel: 'Links & Identity',
    name: 'Identity Theft',
    icon: 'user-check',
    shortExplanation:
      'Stealing your personal information—such as Aadhaar, PAN, passport, or photos—to open fraudulent bank accounts, take loans, or impersonate you online.',
    warningSigns: [
      'Unfamiliar loan enquiries or SIM cards issued in your name.',
      'Forms asking for unnecessary ID uploads for simple services.',
      'Unexpected password reset alerts for your email or social accounts.'
    ],
    example:
      'A fake loan app asks you to upload your PAN, Aadhaar, and contacts list, then misuses your documents and harasses your contacts.',
    preventionTips: [
      'Share ID documents only with verified organisations and use masked Aadhaar when appropriate.',
      'Check your credit report periodically for unknown loans.',
      'Turn on two-factor authentication on email and banking accounts.'
    ]
  },
  {
    id: 'otp-banking',
    category: 'financial',
    categoryLabel: 'Financial & Payment',
    name: 'OTP and Banking Scams',
    icon: 'key-round',
    shortExplanation:
      'Callers pretending to be bank staff, RBI officials, or customer support agents who trick you into reading out an OTP or installing screen-sharing apps.',
    warningSigns: [
      'Caller claims they need your OTP to "stop a fraud transaction" or "activate reward points".',
      'Asks you to install AnyDesk, TeamViewer, or QuickSupport.',
      'Caller sounds authoritative or threatens immediate legal/account action.'
    ],
    example:
      'A caller says: "Your credit card reward points worth Rs. 4,200 expire tonight. Tell me the OTP sent to your phone so I can credit the cash."',
    preventionTips: [
      'Never read an OTP aloud to anyone on a call—not even someone claiming to be bank staff.',
      'Never install remote screen-sharing apps at a stranger’s request.',
      'Hang up and dial your bank’s official helpline number directly.'
    ]
  },
  {
    id: 'social-media',
    category: 'identity',
    categoryLabel: 'Links & Identity',
    name: 'Social Media Scams',
    icon: 'message-square-warning',
    shortExplanation:
      'Hacked friend accounts asking for emergency loans, fake investment/crypto groups, and impersonation profiles tricking followers out of money.',
    warningSigns: [
      'A friend or relative messages suddenly from a new number asking for urgent UPI help.',
      'Promises of doubling your money in 24 hours via crypto or stock tips.',
      'Fake "verified" pages offering giveaways if you pay shipping or log in.'
    ],
    example:
      'A cloned Instagram account of your friend sends a DM: "My UPI is not working and I have a hospital emergency. Please transfer Rs. 6,000, I will return it tonight."',
    preventionTips: [
      'Always call your friend on their regular phone number to confirm before sending money.',
      'Lock down social media privacy settings and enable two-factor authentication.',
      'Avoid "guaranteed return" investment schemes promoted in chat groups.'
    ]
  }
];

/**
 * Safety Tips Information Cards (8 Requested Topics)
 */
export const SAFETY_TIPS = [
  {
    id: 'password-safety',
    title: 'Password Safety',
    summary: 'Strong, unique passwords stop attackers from unlocking multiple accounts if one website leaks data.',
    doTip: 'Use a long passphrase (12+ characters) with letters, numbers, and symbols, and use a different password for banking and email.',
    avoidTip: 'Avoid using your name, birth date, phone number, or "123456", and never reuse your bank password on shopping sites.'
  },
  {
    id: 'otp-protection',
    title: 'OTP Protection',
    summary: 'An OTP is the final digital key protecting your bank account and logins.',
    doTip: 'Read the full SMS text carefully—it states whether the OTP is for a login, a card payment, or adding a new device.',
    avoidTip: 'Never share an OTP over a phone call, WhatsApp, SMS reply, or online form—even if the person claims to be from your bank or police.'
  },
  {
    id: 'upi-safety',
    title: 'UPI Payment Safety',
    summary: 'UPI is fast and safe when you understand how receiving vs. sending works.',
    doTip: 'Verify the recipient name shown on your screen before entering your UPI PIN, and keep daily transaction limits reasonable.',
    avoidTip: 'Never enter your UPI PIN, scan a QR code, or accept a collect request when someone promises to SEND you money.'
  },
  {
    id: 'safe-shopping',
    title: 'Safe Online Shopping',
    summary: 'Protect yourself from fake discount portals and non-delivery fraud.',
    doTip: 'Stick to established marketplaces or verified brand websites, and check independent reviews and return terms.',
    avoidTip: 'Avoid clicking sponsored social media ads promising 80–90% discounts on popular electronics with advance-only payment.'
  },
  {
    id: 'email-sms-safety',
    title: 'Email and SMS Safety',
    summary: 'Scam messages rely on fear, urgency, or excitement to make you act without thinking.',
    doTip: 'Pause whenever a message demands urgent action on KYC, electricity disconnection, courier delivery, or tax refunds.',
    avoidTip: 'Never download unknown APK files or click shortened links sent from random mobile numbers.'
  },
  {
    id: 'website-verification',
    title: 'Website Verification',
    summary: 'One missing or extra letter in a web address can send you to an impersonator site.',
    doTip: 'Check that the site uses https:// and read the domain name immediately before the first "/" (for example, .gov.in for Indian government portals).',
    avoidTip: 'Do not trust a site solely because it displays a bank logo or padlock—scam pages also copy logos and use free HTTPS certificates.'
  },
  {
    id: 'social-privacy',
    title: 'Social Media Privacy',
    summary: 'Public personal details help scammers build convincing impersonation traps.',
    doTip: 'Set your profile privacy to Friends Only, hide your phone number/birthdate, and turn on two-factor authentication.',
    avoidTip: 'Do not post photos of boarding passes, Aadhaar/PAN cards, bank passbooks, or vehicle registration papers publicly.'
  },
  {
    id: 'fake-job-awareness',
    title: 'Fake Job Offer Awareness',
    summary: 'Job seekers are frequently targeted with upfront fee traps and fake work-from-home offers.',
    doTip: 'Verify the recruiter on the company’s official website or LinkedIn page and attend a real interview process.',
    avoidTip: 'Never pay a registration fee, training deposit, or prepaid task deposit to start a job.'
  }
];

/**
 * Cyber Safety Awareness Quiz (10 Questions)
 */
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Someone calls you and asks for your bank OTP. What should you do?',
    options: [
      'Share the OTP.',
      'Disconnect the call and contact your bank using an official number.',
      'Send the OTP through WhatsApp.',
      'Share your banking password.'
    ],
    correctIndex: 1,
    explanation:
      'Genuine bank employees never ask for your OTP. Always disconnect the call and verify using the official number on your bank card or official website.'
  },
  {
    id: 2,
    question: 'A buyer on a marketplace sends a QR code and asks you to scan it and enter your UPI PIN to receive payment. What does entering your UPI PIN actually do?',
    options: [
      'It credits the buyer’s money into your bank account.',
      'It verifies your identity for free.',
      'It deducts money from your bank account and sends it to the scammer.',
      'It blocks spam callers.'
    ],
    correctIndex: 2,
    explanation:
      'You never need to scan a QR code or enter your UPI PIN to receive money. Entering your UPI PIN always authorises money leaving your account.'
  },
  {
    id: 3,
    question: 'You receive an SMS saying your bank account will be blocked in 2 hours unless you click a link to update KYC. What is the safest response?',
    options: [
      'Click the link immediately so your account stays active.',
      'Call the mobile number written inside the SMS.',
      'Ignore the link and check directly inside your official banking app or branch.',
      'Reply to the SMS with your PAN and Aadhaar number.'
    ],
    correctIndex: 2,
    explanation:
      'Urgent account-blocking threats with links are classic phishing tactics. Always verify directly through your official banking app or branch.'
  },
  {
    id: 4,
    question: 'Which of these website links shows a strong warning sign of a fake banking website?',
    options: [
      'https://onlinesbi.sbi',
      'https://uidai.gov.in',
      'http://192.168.10.5/sbi-kyc-login',
      'https://www.rbi.org.in'
    ],
    correctIndex: 2,
    explanation:
      'Official banks do not ask customers to log in through raw numerical IP addresses or unencrypted http:// links.'
  },
  {
    id: 5,
    question: 'An online recruiter offers you a high-paying remote job with no interview, but asks for a Rs. 1,500 refundable registration fee first. What should you do?',
    options: [
      'Pay the fee quickly before the seat fills up.',
      'Refuse to pay, as genuine employers do not charge registration fees to hire candidates.',
      'Share your debit card CVV for verification instead.',
      'Ask them to deduct it from your Aadhaar card.'
    ],
    correctIndex: 1,
    explanation:
      'Legitimate employers never ask job applicants for registration, training, or refundable security fees.'
  },
  {
    id: 6,
    question: 'What is the official Indian Cyber Financial Fraud Helpline number to call immediately if money is stolen online?',
    options: [
      '108',
      '1930',
      '1800-000',
      '911'
    ],
    correctIndex: 1,
    explanation:
      'In India, 1930 is the official national Cyber Financial Fraud Helpline, and complaints can also be filed at https://cybercrime.gov.in/.'
  },
  {
    id: 7,
    question: 'A stranger claiming to be customer support asks you to install a screen-sharing app (like AnyDesk or TeamViewer) to process a refund. What should you do?',
    options: [
      'Install the app and read your OTP out loud.',
      'Refuse immediately, because screen-sharing lets scammers watch your screen and control your phone.',
      'Install it only if they send a WhatsApp photo of an ID card.',
      'Share your UPI PIN in chat instead.'
    ],
    correctIndex: 1,
    explanation:
      'Remote screen-sharing apps allow fraudsters to view OTPs, banking apps, and even initiate transfers directly from your device.'
  },
  {
    id: 8,
    question: 'A friend messages you from a new WhatsApp number asking for an urgent Rs. 5,000 UPI transfer for a medical emergency. What should you do first?',
    options: [
      'Transfer the money immediately without checking.',
      'Call your friend on their known regular phone number to confirm it is truly them.',
      'Send your ATM PIN so they can withdraw cash.',
      'Forward the message to five groups.'
    ],
    correctIndex: 1,
    explanation:
      'Account cloning and hacked social media impersonation are very common. Always confirm by voice call on a trusted number before sending money.'
  },
  {
    id: 9,
    question: 'You see an online store selling a brand-new smartphone worth Rs. 60,000 for Rs. 4,999 with "Prepaid UPI Only — No Cash on Delivery". What is the likely risk?',
    options: [
      'It is guaranteed safe because the website shows a padlock icon.',
      'It is likely a fake shopping scam designed to collect advance payments without delivering.',
      'It is safe as long as the site has a countdown timer.',
      'It is an official government subsidy.'
    ],
    correctIndex: 1,
    explanation:
      'Unrealistic discounts paired with advance-only payments and countdown timers are hallmark signs of fake e-commerce websites. Even scam sites can have HTTPS padlocks.'
  },
  {
    id: 10,
    question: 'Which password practice gives your email and banking accounts the strongest protection?',
    options: [
      'Using your mobile number as the password on every website.',
      'Using "Password@123" so it is easy to remember.',
      'Using a unique, long passphrase for each important account and enabling two-factor authentication (2FA).',
      'Writing your passwords in your public social media bio.'
    ],
    correctIndex: 2,
    explanation:
      'Unique long passwords ensure that one breached site cannot compromise your bank or email, while 2FA adds a second layer of protection.'
  }
];

/**
 * Calculates final quiz score and builds per-question review feedback.
 * @param {Array} questions
 * @param {Array<number|null>} selectedAnswers
 */
export function calculateQuizScore(questions, selectedAnswers) {
  let score = 0;
  const review = questions.map((question, index) => {
    const selectedIndex = typeof selectedAnswers[index] === 'number' ? selectedAnswers[index] : null;
    const isCorrect = selectedIndex === question.correctIndex;
    if (isCorrect) {
      score += 1;
    }
    return {
      id: question.id,
      question: question.question,
      options: question.options,
      selectedIndex,
      correctIndex: question.correctIndex,
      isCorrect,
      explanation: question.explanation
    };
  });

  const total = questions.length;
  let feedbackHeading = 'Keep Practising Digital Safety';
  let feedbackMessage =
    'Review the explanations below and visit the Scam Awareness Library to strengthen your scam-spotting habits.';

  if (score >= 9) {
    feedbackHeading = 'Strong Cyber Safety Awareness';
    feedbackMessage =
      'You recognised almost every warning sign accurately. Keep verifying links independently and helping family members stay alert too.';
  } else if (score >= 6) {
    feedbackHeading = 'Good Awareness Foundation';
    feedbackMessage =
      'You spotted most scam traps, though a few subtle warning signs slipped through. Check the review below to close the gaps.';
  }

  return {
    score,
    total,
    percentage: total > 0 ? Math.round((score / total) * 100) : 0,
    feedbackHeading,
    feedbackMessage,
    review
  };
}
