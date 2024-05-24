console.log('sw-omnibox.js');

// Initialize default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      merliniSuggestions: ['tabs', 'storage', 'scripting']
    });
  }
});

const URL_CHROME_EXTENSIONS_DOC =
  'https://suporte.senior.com.br/hc/pt-br/search?utf8=%E2%9C%93&query=';
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  await chrome.omnibox.setDefaultSuggestion({
    description: 'Enter a Chrome API or choose from past searches'
  });
  const { merliniSuggestions } = await chrome.storage.local.get('merliniSuggestions');
  const suggestions = merliniSuggestions.map((api) => {
    return { content: api, description: `Open chrome.${api} API` };
  });
  suggest(suggestions);
});

// Open the reference page of the chosen API
chrome.omnibox.onInputEntered.addListener((input) => {
  chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + input });
  // Save the latest keyword
  updateHistory(input);
});

async function updateHistory(input) {
  const { merliniSuggestions } = await chrome.storage.local.get('merliniSuggestions');
  merliniSuggestions.unshift(input);
  merliniSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
  return chrome.storage.local.set({ merliniSuggestions });
}
