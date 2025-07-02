async function fetchByState(stateId) {
  try {
    const fetch = await import('node-fetch').then(mod => mod.default); // dynamic import

    const response = await fetch(`http://localhost:3000/api/mapper/state/${stateId}`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Fetch failed: ' + error.message);
  }
}



module.exports = { fetchByState };
