type Step = {
  id: string;
  question: string;
  options: {
    text: string;
    nextStep?: string;
    solution?: string;
  }[];
};

type TroubleshootingFlow = {
  [key: string]: Step;
};

export const troubleshootingFlows: Record<string, TroubleshootingFlow> = {
  'WiFi Issues': {
    start: {
      id: 'start',
      question: 'Is your WiFi router powered on and showing lights?',
      options: [
        { 
          text: 'No',
          nextStep: 'check-power'
        },
        { 
          text: 'Yes',
          nextStep: 'check-connection'
        }
      ]
    },
    'check-power': {
      id: 'check-power',
      question: 'Please check the power connection of your router.',
      options: [
        {
          text: 'Power is now on',
          nextStep: 'check-connection'
        },
        {
          text: 'Still no power',
          solution: 'Please try a different power outlet or contact your ISP for router replacement.'
        }
      ]
    },
    'check-connection': {
      id: 'check-connection',
      question: 'Can you see your WiFi network in the available networks list?',
      options: [
        {
          text: 'Yes',
          nextStep: 'try-connect'
        },
        {
          text: 'No',
          nextStep: 'router-reset'
        }
      ]
    },
    'try-connect': {
      id: 'try-connect',
      question: 'Try connecting to your WiFi network. What happens?',
      options: [
        {
          text: 'Connected successfully',
          nextStep: 'check-speed'
        },
        {
          text: 'Wrong password',
          solution: 'Check the WiFi password on your router (usually on a sticker) or contact your ISP for the correct password.'
        },
        {
          text: 'Connects but no internet',
          nextStep: 'check-isp'
        }
      ]
    },
    'check-speed': {
      id: 'check-speed',
      question: 'How is your internet speed now?',
      options: [
        {
          text: 'Working well',
          solution: 'Great! Your WiFi issue has been resolved.'
        },
        {
          text: 'Still slow',
          nextStep: 'optimize-connection'
        }
      ]
    },
    'optimize-connection': {
      id: 'optimize-connection',
      question: 'Let\'s try to optimize your connection. Are you close to your router?',
      options: [
        {
          text: 'Yes, but still slow',
          solution: 'Try changing your WiFi channel in router settings or contact your ISP for a speed test.'
        },
        {
          text: 'No, I\'m far away',
          solution: 'Move closer to the router or consider getting a WiFi extender.'
        }
      ]
    },
    'router-reset': {
      id: 'router-reset',
      question: 'Let\'s try resetting your router. Unplug it for 30 seconds, then plug it back in.',
      options: [
        {
          text: 'Network is now visible',
          nextStep: 'try-connect'
        },
        {
          text: 'Still no network',
          solution: 'Your router may need to be reconfigured or replaced. Please contact your ISP.'
        }
      ]
    },
    'check-isp': {
      id: 'check-isp',
      question: 'Let\'s check if there\'s an ISP outage.',
      options: [
        {
          text: 'ISP reports outage',
          solution: 'Please wait for your ISP to resolve the outage and try again later.'
        },
        {
          text: 'No reported outage',
          nextStep: 'router-reset'
        }
      ]
    }
  },
  'Slow Performance': {
    start: {
      id: 'start',
      question: 'When did you start noticing the slow performance?',
      options: [
        {
          text: 'After recent changes',
          nextStep: 'check-recent-changes'
        },
        {
          text: 'Gradually over time',
          nextStep: 'check-resources'
        }
      ]
    },
    'check-recent-changes': {
      id: 'check-recent-changes',
      question: 'Have you installed new software or updates recently?',
      options: [
        {
          text: 'Yes',
          nextStep: 'verify-software'
        },
        {
          text: 'No',
          nextStep: 'check-resources'
        }
      ]
    },
    'verify-software': {
      id: 'verify-software',
      question: 'Try uninstalling recent software or reverting updates. Did it help?',
      options: [
        {
          text: 'Yes, it\'s faster now',
          solution: 'The recent changes were causing the slowdown. Keep your system as is or carefully reinstall needed software.'
        },
        {
          text: 'No improvement',
          nextStep: 'check-resources'
        }
      ]
    },
    'check-resources': {
      id: 'check-resources',
      question: 'Let\'s check your system resources. Is CPU or Memory usage very high?',
      options: [
        {
          text: 'Yes, high usage',
          nextStep: 'optimize-resources'
        },
        {
          text: 'No, normal usage',
          nextStep: 'scan-malware'
        }
      ]
    },
    'optimize-resources': {
      id: 'optimize-resources',
      question: 'Close unnecessary programs and browser tabs. Did performance improve?',
      options: [
        {
          text: 'Yes, it\'s better now',
          solution: 'Try to keep fewer programs running simultaneously and regularly restart your computer.'
        },
        {
          text: 'No improvement',
          nextStep: 'scan-malware'
        }
      ]
    },
    'scan-malware': {
      id: 'scan-malware',
      question: 'Run a malware scan. Did it find any threats?',
      options: [
        {
          text: 'Yes, threats found',
          solution: 'Remove the detected threats and restart your computer. This should improve performance.'
        },
        {
          text: 'No threats found',
          nextStep: 'check-disk'
        }
      ]
    },
    'check-disk': {
      id: 'check-disk',
      question: 'Check your disk space. Is it almost full?',
      options: [
        {
          text: 'Yes, low space',
          solution: 'Free up disk space by removing unnecessary files and programs. Aim to keep at least 10% free space.'
        },
        {
          text: 'No, plenty of space',
          solution: 'Consider running disk cleanup, defragmentation, or upgrading your hardware if problems persist.'
        }
      ]
    }
  },
  'Website Access': {
    start: {
      id: 'start',
      question: 'Can you access any websites at all?',
      options: [
        {
          text: 'No websites work',
          nextStep: 'check-internet'
        },
        {
          text: 'Only some don\'t work',
          nextStep: 'specific-sites'
        }
      ]
    },
    'check-internet': {
      id: 'check-internet',
      question: 'Let\'s check your internet connection. Is it connected?',
      options: [
        {
          text: 'No connection',
          solution: 'Please check your WiFi or ethernet connection first.'
        },
        {
          text: 'Yes, connected',
          nextStep: 'check-dns'
        }
      ]
    },
    'check-dns': {
      id: 'check-dns',
      question: 'Try changing your DNS to 8.8.8.8 (Google DNS). Did it help?',
      options: [
        {
          text: 'Yes, working now',
          solution: 'Keep using the new DNS settings for better reliability.'
        },
        {
          text: 'No change',
          nextStep: 'check-browser'
        }
      ]
    },
    'specific-sites': {
      id: 'specific-sites',
      question: 'Are these websites accessible from other devices?',
      options: [
        {
          text: 'Yes, only this device',
          nextStep: 'check-browser'
        },
        {
          text: 'No, all devices',
          solution: 'The websites might be down or blocked by your ISP. Try again later or contact your ISP.'
        }
      ]
    },
    'check-browser': {
      id: 'check-browser',
      question: 'Try a different web browser. Does it work there?',
      options: [
        {
          text: 'Yes, other browser works',
          solution: 'Clear your main browser\'s cache and cookies, or reset its settings if problems persist.'
        },
        {
          text: 'No, same issue',
          nextStep: 'check-security'
        }
      ]
    },
    'check-security': {
      id: 'check-security',
      question: 'Check your firewall and antivirus settings. Are they blocking access?',
      options: [
        {
          text: 'Yes, found blocking',
          solution: 'Adjust your security settings or add exceptions for trusted websites.'
        },
        {
          text: 'No blocking found',
          solution: 'Try resetting your network settings or contact your system administrator for help.'
        }
      ]
    }
  },
  'Other Issues': {
    start: {
      id: 'start',
      question: 'What type of technical issue are you experiencing?',
      options: [
        {
          text: 'Hardware related',
          nextStep: 'hardware-type'
        },
        {
          text: 'Software related',
          nextStep: 'software-type'
        },
        {
          text: 'Something else',
          nextStep: 'general-help'
        }
      ]
    },
    'hardware-type': {
      id: 'hardware-type',
      question: 'What hardware is causing issues?',
      options: [
        {
          text: 'Printer',
          solution: 'Check printer connection, drivers, and queue. Restart both printer and computer if needed.'
        },
        {
          text: 'Monitor/Display',
          solution: 'Verify cable connections, try different ports, or update display drivers.'
        },
        {
          text: 'Other hardware',
          nextStep: 'general-help'
        }
      ]
    },
    'software-type': {
      id: 'software-type',
      question: 'Is it a specific application or general system issue?',
      options: [
        {
          text: 'Specific app',
          solution: 'Try reinstalling the application or checking for updates.'
        },
        {
          text: 'System issue',
          solution: 'Run system diagnostics or contact your system administrator.'
        }
      ]
    },
    'general-help': {
      id: 'general-help',
      question: 'Would you like to speak with a support representative?',
      options: [
        {
          text: 'Yes, please',
          solution: 'We\'ll connect you with a support representative shortly.'
        },
        {
          text: 'No, try self-help',
          solution: 'Please browse our knowledge base or try describing your issue differently.'
        }
      ]
    }
  }
}; 