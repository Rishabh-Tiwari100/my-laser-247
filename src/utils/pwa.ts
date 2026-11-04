interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let installPrompt: InstallPromptEvent | null = null;
let initialized = false;

export function initializePwa() {
  if (initialized) return;
  initialized = true;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event as InstallPromptEvent;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
  });
}

export async function promptAppInstall() {
  if (!installPrompt) return 'unavailable' as const;
  const prompt = installPrompt;
  installPrompt = null;
  await prompt.prompt();
  return (await prompt.userChoice).outcome;
}
