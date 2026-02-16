const safeFetchJson = async (url, fallbackValue) => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return fallbackValue;
    }

    return await response.json();
  } catch (error) {
    return fallbackValue;
  }
};

exports.getCompanionSpark = async () => {
  const [advice, quote, activity] = await Promise.all([
    safeFetchJson('https://api.adviceslip.com/advice', { slip: { advice: 'Breathe. Feel. Continue.' } }),
    safeFetchJson('https://api.quotable.io/random?tags=love|inspirational', { content: 'Even silence can hold a heartbeat.', author: 'Unknown' }),
    safeFetchJson('https://www.boredapi.com/api/activity', { activity: 'Take a slow walk and notice your thoughts.' }),
  ]);

  return {
    advice: advice?.slip?.advice || 'Breathe. Feel. Continue.',
    quote: quote?.content || 'Even silence can hold a heartbeat.',
    quoteAuthor: quote?.author || 'Unknown',
    activity: activity?.activity || 'Take a slow walk and notice your thoughts.',
    provider: 'third-party-apis',
    generatedAt: new Date().toISOString(),
  };
};
