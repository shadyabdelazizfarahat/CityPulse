export const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    share: 'Share',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    done: 'Done',
  },

  // Navigation
  navigation: {
    home: 'Home',
    favorites: 'Favorites',
    profile: 'Profile',
    settings: 'Settings',
    eventDetails: 'Event Details',
  },

  // Authentication
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    welcomeBack: 'Welcome Back!',
    getStarted: 'Get Started',
    useBiometric: 'Use Biometric Login',
    biometricPrompt: 'Use your fingerprint or face to login',
    loginSuccess: 'Successfully logged in!',
    registrationSuccess: 'Account created successfully!',
  },

  // Home Screen
  home: {
    title: 'City Pulse',
    subtitle: 'Discover Local Events',
    searchPlaceholder: 'Search events...',
    cityPlaceholder: 'Enter city name',
    searchButton: 'Search Events',
    noResults: 'No events found',
    tryDifferentSearch: 'Try a different search term or city',
    popularEvents: 'Popular Events',
    nearbyEvents: 'Nearby Events',
    recentSearches: 'Recent Searches',
    clearSearchHistory: 'Clear Search History',
  },

  // Event Details
  eventDetails: {
    title: 'Event Details',
    when: 'When',
    where: 'Where',
    price: 'Price',
    category: 'Category',
    description: 'Description',
    venue: 'Venue',
    getTickets: 'Get Tickets',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    shareEvent: 'Share Event',
    viewOnMap: 'View on Map',
    eventInfo: 'Event Information',
    accessibility: 'Accessibility',
    pleaseNote: 'Please Note',
    priceFrom: 'From',
    priceTBA: 'Price TBA',
    soldOut: 'Sold Out',
    unavailable: 'Unavailable',
  },

  // Favorites
  favorites: {
    title: 'My Favorites',
    empty: 'No favorite events yet',
    emptySubtitle: 'Events you favorite will appear here',
    addedToFavorites: 'Added to favorites!',
    removedFromFavorites: 'Removed from favorites!',
  },

  // Profile
  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    personalInfo: 'Personal Information',
    preferences: 'Preferences',
    language: 'Change Language To',
    notifications: 'Notifications',
    biometricLogin: 'Biometric Login',
    aboutApp: 'About App',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    support: 'Support',
    version: 'Version',
    bio: 'Bio',
    addBio: 'Add a bio...',
    profileUpdated: 'Profile updated successfully!',
  },

  // Settings
  settings: {
    title: 'Settings',
    general: 'General',
    account: 'Account',
    security: 'Security',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account',
    darkMode: 'Dark Mode',
    pushNotifications: 'Push Notifications',
    emailNotifications: 'Email Notifications',
    locationServices: 'Location Services',
  },

  // Languages
  languages: {
    english: 'English',
    arabic: 'العربية',
    switchLanguage: 'Switch Language',
  },

  // Errors
  errors: {
    networkError: 'Network error. Please check your connection.',
    invalidCredentials: 'Invalid email or password.',
    registrationFailed: 'Registration failed. Please try again.',
    eventNotFound: 'Event not found.',
    locationPermission: 'Location permission required.',
    biometricNotAvailable: 'Biometric authentication not available.',
    genericError: 'Something went wrong. Please try again.',
    invalidEmail: 'Please enter a valid email address.',
    passwordTooShort: 'Password must be at least 6 characters.',
    passwordsDoNotMatch: 'Passwords do not match.',
    nameRequired: 'Name is required.',
    emailRequired: 'Email is required.',
    passwordRequired: 'Password is required.',
    searchRequired: 'Please enter a search term.',
    cityRequired: 'Please enter a city name.',
  },

  // Success Messages
  success: {
    loginSuccess: 'Successfully logged in!',
    registrationSuccess: 'Account created successfully!',
    profileUpdated: 'Profile updated successfully!',
    eventFavorited: 'Event added to favorites!',
    eventUnfavorited: 'Event removed from favorites!',
    passwordChanged: 'Password changed successfully!',
    settingsSaved: 'Settings saved successfully!',
  },

  // Date & Time
  dateTime: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    nextWeek: 'Next Week',
    thisMonth: 'This Month',
    nextMonth: 'Next Month',
    am: 'AM',
    pm: 'PM',
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    shortMonths: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    days: [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },

  // Categories
  categories: {
    all: 'All Categories',
    music: 'Music',
    sports: 'Sports',
    arts: 'Arts & Theater',
    family: 'Family',
    miscellaneous: 'Miscellaneous',
    comedy: 'Comedy',
    film: 'Film',
    dance: 'Dance',
    festivals: 'Festivals',
  },

  // Map
  map: {
    viewOnMap: 'View on Map',
    getDirections: 'Get Directions',
    distance: 'Distance',
    loading: 'Loading map...',
    error: 'Unable to load map',
  },

  // Biometric
  biometric: {
    title: 'Biometric Authentication',
    subtitle: 'Use your fingerprint or face ID to login quickly and securely',
    enable: 'Enable Biometric Login',
    disable: 'Disable Biometric Login',
    prompt: 'Please verify your identity',
    fallback: 'Use Password',
    notAvailable: 'Biometric authentication is not available on this device',
    notEnrolled: 'No biometric credentials are enrolled on this device',
    error: 'Biometric authentication failed',
  },
};